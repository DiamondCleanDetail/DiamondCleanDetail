import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCategory } from "@/data/catalog";

export const dynamic = "force-dynamic";

type BookingRow = {
  id: string;
  service_slug: string;
  package_slug: string;
  vehicle_size: string;
  vehicle_info: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  booking_date: string;
  booking_time: string;
  price_cents: number;
  deposit_cents: number;
  status: "pending" | "paid" | "cancelled";
  group_id: string | null;
  created_at: string;
};

function serviceLabel(row: BookingRow): string {
  const category = getCategory(row.service_slug);
  const pkg = category?.packages.find((p) => p.slug === row.package_slug);
  if (category && pkg) return `${category.name} — ${pkg.name}`;
  return `${row.service_slug} / ${row.package_slug}`;
}

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const statusStyle: Record<BookingRow["status"], string> = {
  paid: "text-green-400",
  pending: "text-accent",
  cancelled: "text-muted line-through",
};

export default async function AdminPage() {
  const db = supabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: upcoming, error: upcomingError }, { data: recent, error: recentError }] = await Promise.all([
    db
      .from("bookings")
      .select("*")
      .neq("status", "cancelled")
      .gte("booking_date", today)
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true })
      .limit(50),
    db
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const upcomingJobs = (upcoming ?? []) as BookingRow[];
  const recentBookings = (recent ?? []) as BookingRow[];
  const loadError = upcomingError?.message ?? recentError?.message;

  const paidThisMonthCents = recentBookings
    .filter((b) => b.status === "paid" && b.created_at.slice(0, 7) === today.slice(0, 7))
    .reduce((sum, b) => sum + b.deposit_cents, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted mb-10">
        Live bookings from Supabase — this data is real, not a preview.
      </p>

      {loadError && (
        <div className="mb-8 bg-red-950/40 border border-red-900 text-red-300 rounded-xl p-4 text-sm">
          Couldn&apos;t load bookings: {loadError}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted">Upcoming Jobs</p>
          <p className="text-2xl font-bold mt-1">{upcomingJobs.length}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted">Awaiting Payment</p>
          <p className="text-2xl font-bold mt-1">{upcomingJobs.filter((j) => j.status === "pending").length}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted">Collected This Month</p>
          <p className="text-2xl font-bold mt-1">{money(paidThisMonthCents)}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <section className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Jobs</h2>
          {upcomingJobs.length === 0 ? (
            <p className="text-sm text-muted">No upcoming bookings.</p>
          ) : (
            <div className="space-y-3">
              {upcomingJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-surface-2 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{job.customer_name}</p>
                    <p className="text-muted">{serviceLabel(job)}</p>
                    <p className="text-muted text-xs mt-0.5">
                      {job.vehicle_info} ·{" "}
                      <a href={`tel:${job.customer_phone}`} className="hover:text-foreground transition-colors">
                        {job.customer_phone}
                      </a>
                      {job.customer_email && (
                        <>
                          {" · "}
                          <a href={`mailto:${job.customer_email}`} className="hover:text-foreground transition-colors">
                            {job.customer_email}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p>
                      {job.booking_date} · {job.booking_time}
                    </p>
                    <p className={statusStyle[job.status]}>
                      {job.status === "pending" && job.deposit_cents > 0
                        ? `Pending — ${money(job.deposit_cents)} due`
                        : job.status === "paid"
                          ? `Paid ${money(job.deposit_cents)}`
                          : "Awaiting quote"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-muted">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-surface-2 rounded-lg p-4 flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="font-medium">{b.customer_name}</span>
                    <span className="text-muted"> — {serviceLabel(b)}</span>
                  </div>
                  <span className={statusStyle[b.status]}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
