import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCategory, formatPrice } from "@/data/catalog";
import { todayIso } from "@/lib/scheduling";

/** One row of the bookings table, narrowed to what the account page reads. */
export type BookingRow = {
  id: string;
  group_id: string | null;
  service_slug: string;
  package_slug: string;
  vehicle_size: string | null;
  vehicle_info: string | null;
  booking_date: string;
  booking_time: string;
  price_cents: number | null;
  deposit_cents: number | null;
  status: string;
};

/**
 * One visit. A single checkout can create several rows — book a tint and a
 * ceramic coating together and that is two rows sharing a group_id, one
 * arrival, one price. The account page has to show that as one appointment or
 * it reads as two bookings for the same slot.
 */
export type Visit = {
  key: string;
  date: string;
  time: string;
  vehicle: string | null;
  vehicleSize: string | null;
  status: string;
  /** What was booked, resolved to real names via the catalogue. */
  lines: { service: string; serviceSlug: string; packageName: string; packageSlug: string }[];
  totalCents: number;
  paidCents: number;
  isUpcoming: boolean;
};

export type AccountData = {
  upcoming: Visit[];
  past: Visit[];
  /** Distinct vehicles, most recently booked first. */
  vehicles: { label: string; size: string | null; lastDate: string }[];
  /** Only set if they have ever booked a maintenance package. */
  maintenance: {
    packageSlug: string;
    cadenceLabel: string;
    everyDays: number;
    lastVisit: string | null;
    dueDate: string | null;
    daysUntilDue: number | null;
    visitCount: number;
  } | null;
  totalSpentCents: number;
  /** Whether they have at least one finished, paid-for visit — the only
   * people it makes sense to ask for a review. */
  canReview: boolean;
};

/** Visits per cadence, from the maintenance package slugs in the catalogue. */
const CADENCE: Record<string, { label: string; everyDays: number }> = {
  "monthly-maintenance": { label: "Monthly", everyDays: 30 },
  "biweekly-maintenance": { label: "Every two weeks", everyDays: 14 },
};

function daysBetween(fromIso: string, toIso: string): number {
  // Both are plain YYYY-MM-DD in the business timezone. Parsed as UTC noon so
  // neither DST nor the viewer's own timezone can shift the count by a day.
  const at = (s: string) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10), 12);
  return Math.round((at(toIso) - at(fromIso)) / 86_400_000);
}

function addDays(iso: string, days: number): string {
  const d = new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10), 12));
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** "Saturday 6 September" — no year unless it isn't this one. */
export function formatVisitDate(iso: string, today = todayIso()): string {
  const d = new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10), 12));
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(iso.slice(0, 4) === today.slice(0, 4) ? {} : { year: "numeric" }),
    timeZone: "UTC",
  });
}

export function formatMoney(cents: number): string {
  return formatPrice(Math.round(cents / 100));
}

/**
 * Everything the account page needs, for one email address.
 *
 * Bookings are matched on the email typed into the booking form, not on a
 * Clerk user id — the two are only connected by the person using the same
 * address, and someone can book before they ever create an account. Matched
 * case-insensitively for the same reason.
 */
export async function getAccountData(email: string): Promise<AccountData> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("bookings")
    .select(
      "id, group_id, service_slug, package_slug, vehicle_size, vehicle_info, booking_date, booking_time, price_cents, deposit_cents, status"
    )
    .ilike("customer_email", email)
    .neq("status", "cancelled")
    .order("booking_date", { ascending: false });

  if (error) {
    console.error("Account lookup failed:", error.message);
    return emptyAccount();
  }

  const rows = (data ?? []) as BookingRow[];
  const today = todayIso();

  // Group into visits. Rows without a group_id are their own visit.
  const byGroup = new Map<string, BookingRow[]>();
  for (const r of rows) {
    const key = r.group_id ?? `single:${r.id}`;
    const list = byGroup.get(key);
    if (list) list.push(r);
    else byGroup.set(key, [r]);
  }

  const visits: Visit[] = [...byGroup.entries()].map(([key, group]) => {
    const first = group[0];
    return {
      key,
      date: first.booking_date,
      time: first.booking_time,
      vehicle: first.vehicle_info,
      vehicleSize: first.vehicle_size,
      status: first.status,
      lines: group.map((r) => {
        const cat = getCategory(r.service_slug);
        const pkg = cat?.packages.find((p) => p.slug === r.package_slug);
        return {
          service: cat?.name ?? r.service_slug,
          serviceSlug: r.service_slug,
          packageName: pkg?.name ?? r.package_slug,
          packageSlug: r.package_slug,
        };
      }),
      totalCents: group.reduce((n, r) => n + (r.price_cents ?? 0), 0),
      paidCents: group.reduce((n, r) => n + (r.deposit_cents ?? 0), 0),
      isUpcoming: first.booking_date >= today,
    };
  });

  const upcoming = visits
    .filter((v) => v.isUpcoming)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const past = visits
    .filter((v) => !v.isUpcoming)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  // Vehicles, newest first, deduped on the text the customer typed.
  const vehicles: AccountData["vehicles"] = [];
  for (const v of [...upcoming, ...past].sort((a, b) => b.date.localeCompare(a.date))) {
    const label = (v.vehicle ?? "").split("·")[0].trim();
    if (!label || vehicles.some((x) => x.label.toLowerCase() === label.toLowerCase())) continue;
    vehicles.push({ label, size: v.vehicleSize, lastDate: v.date });
  }

  // Maintenance rhythm. There is no subscription behind this — every visit is
  // booked and paid for one at a time — so this reports the cadence they chose
  // and when the next one is due, and never implies anything is automatic.
  let maintenance: AccountData["maintenance"] = null;
  const maintenanceVisits = visits
    .filter((v) => v.lines.some((l) => l.serviceSlug === "maintenance-plans"))
    .sort((a, b) => b.date.localeCompare(a.date));
  if (maintenanceVisits.length) {
    const latest = maintenanceVisits[0];
    const line = latest.lines.find((l) => l.serviceSlug === "maintenance-plans")!;
    const cadence = CADENCE[line.packageSlug];
    if (cadence) {
      const lastDone = maintenanceVisits.find((v) => !v.isUpcoming)?.date ?? null;
      const dueDate = lastDone ? addDays(lastDone, cadence.everyDays) : null;
      maintenance = {
        packageSlug: line.packageSlug,
        cadenceLabel: cadence.label,
        everyDays: cadence.everyDays,
        lastVisit: lastDone,
        dueDate,
        daysUntilDue: dueDate ? daysBetween(today, dueDate) : null,
        visitCount: maintenanceVisits.filter((v) => !v.isUpcoming).length,
      };
    }
  }

  return {
    upcoming,
    past,
    vehicles,
    maintenance,
    totalSpentCents: past.reduce((n, v) => n + v.totalCents, 0),
    canReview: past.some((v) => v.status === "paid"),
  };
}

function emptyAccount(): AccountData {
  return {
    upcoming: [],
    past: [],
    vehicles: [],
    maintenance: null,
    totalSpentCents: 0,
    canReview: false,
  };
}
