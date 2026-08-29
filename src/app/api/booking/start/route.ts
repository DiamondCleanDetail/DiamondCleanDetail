import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stripeClient } from "@/lib/stripe";
import { getCategory, resolveLinePrice } from "@/data/catalog";
import {
  isPastDate,
  isSlotTooSoon,
  isValidIsoDate,
  isBookableDay,
  bookableDaysLabel,
  leadTimeLabel,
  parseTimeToMinutes,
  rangesOverlap,
  timeSlots,
  CLOSING_MINUTES,
} from "@/lib/scheduling";
import { sendBookingEmails } from "@/lib/bookingEmails";

type ItemInput = {
  serviceSlug: string;
  packageSlug: string;
  addOnSlugs?: string[];
  note?: string;
  /** Tint only, and only for a Tesla: which coverage/film pair was chosen.
   * The price is looked up from these here rather than accepted from the
   * client, same as every other figure on this route. */
  isTesla?: boolean;
  filmSlug?: string;
  teslaCoverageSlug?: string;
};

type StartBookingBody = {
  items: ItemInput[];
  vehicleSize: "sedan" | "suv" | "truck";
  vehicleInfo: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as StartBookingBody;

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "No services selected." }, { status: 400 });
  }
  if (!["sedan", "suv", "truck"].includes(body.vehicleSize)) {
    return NextResponse.json({ error: "Invalid vehicle size." }, { status: 400 });
  }
  if (!body.name || !body.phone || !body.vehicleInfo || !body.date || !body.time) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  // Dates are compared as strings, so anything not in `YYYY-MM-DD` has to be
  // rejected as malformed rather than silently sorting below today's date and
  // coming back as the wrong error.
  if (!isValidIsoDate(body.date)) {
    return NextResponse.json({ error: "That date isn't a valid date." }, { status: 400 });
  }
  // The date picker enforces this client-side, but nothing stops a direct
  // API request from skipping it — a past or weekend date would otherwise
  // create a real, chargeable booking Farhan can never fulfill. Both sides now
  // ask the same question ("is it past in Denver?"), so the picker can no
  // longer offer a date this rejects.
  if (isPastDate(body.date)) {
    return NextResponse.json({ error: "That date has already passed." }, { status: 400 });
  }
  if (!isBookableDay(body.date)) {
    return NextResponse.json(
      { error: `We only take appointments on ${bookableDaysLabel()}.` },
      { status: 400 }
    );
  }
  // The form only ever offers these, so anything else came from somewhere
  // that skipped it — and an unrecognised time would otherwise be stored
  // verbatim and scheduled as if it were midnight.
  if (!timeSlots.includes(body.time)) {
    return NextResponse.json({ error: "That isn't one of our appointment times." }, { status: 400 });
  }
  // Same rule the form filters today's slots with, applied again here so a
  // stale page or a direct request can't book a van into a slot it can't
  // reach. Today's 9:00 AM was bookable at 4:00 PM before this.
  if (isSlotTooSoon(body.date, body.time)) {
    return NextResponse.json(
      { error: `We need at least ${leadTimeLabel()}' notice — please pick a later time.` },
      { status: 400 }
    );
  }

  const resolved = body.items.map((item) => {
    const category = getCategory(item.serviceSlug);
    const pkg = category?.packages.find((p) => p.slug === item.packageSlug);
    return { item, category, pkg };
  });
  if (resolved.some((r) => !r.category || !r.pkg)) {
    return NextResponse.json(
      { error: "One of the selected services is no longer available." },
      { status: 400 }
    );
  }

  const groupId = randomUUID();
  const db = supabaseAdmin();

  // Re-validate the slot server-side. The client only checks availability
  // when the page loads, so without this a second tab, a slow connection,
  // or a direct API request could double-book the same appointment.
  const totalDuration = resolved.reduce((sum, r) => sum + (r.pkg!.durationMinutes ?? 60), 0);
  const start = parseTimeToMinutes(body.time);
  const end = start + totalDuration;
  if (end > CLOSING_MINUTES) {
    return NextResponse.json({ error: "That time doesn't leave enough room before closing." }, { status: 400 });
  }
  const { data: existingBookings, error: availabilityError } = await db
    .from("bookings")
    .select("service_slug, package_slug, booking_time")
    .eq("booking_date", body.date)
    .neq("status", "cancelled");
  if (availabilityError) {
    console.error("Failed to check availability:", availabilityError.message);
    return NextResponse.json({ error: "Could not verify availability. Please try again." }, { status: 500 });
  }
  const hasConflict = (existingBookings ?? []).some((existing) => {
    const existingCategory = getCategory(existing.service_slug);
    const existingPkg = existingCategory?.packages.find((p) => p.slug === existing.package_slug);
    const existingStart = parseTimeToMinutes(existing.booking_time);
    const existingEnd = existingStart + (existingPkg?.durationMinutes ?? 60);
    return rangesOverlap(start, end, existingStart, existingEnd);
  });
  if (hasConflict) {
    return NextResponse.json(
      { error: "That time was just booked by someone else — please pick another." },
      { status: 409 }
    );
  }

  const rows = resolved.map(({ item, category, pkg }) => {
    // The same resolver the form prices with, so what someone agreed to and
    // what they are charged cannot differ. A Tesla coverage/film pair we do
    // not price resolves to null and falls to 0 rather than silently billing
    // the size-based figure, which would be a different number than shown.
    const basePrice =
      resolveLinePrice(pkg!, body.vehicleSize, {
        isTesla: item.isTesla,
        filmSlug: item.filmSlug,
        teslaCoverageSlug: item.teslaCoverageSlug,
      }) ?? 0;
    // Resolve add-ons from the catalog rather than trusting any price the
    // client sent, and ignore any the package already covers.
    const addOns = (category!.addOns ?? []).filter(
      (a) =>
        (item.addOnSlugs ?? []).includes(a.slug) && !a.includedIn?.includes(pkg!.slug)
    );
    const addOnsTotal = addOns.reduce((n, a) => n + a.price, 0);
    const price = basePrice + addOnsTotal;
    const depositPercent = pkg!.depositPercent ?? 0;
    const deposit = depositPercent > 0 ? Math.round((basePrice * depositPercent) / 100) : 0;
    // Quote-only packages charge nothing up front, add-ons included — they get
    // quoted with the job. Otherwise add-ons are charged in full alongside the
    // deposit, matching what the wizard showed.
    const chargeAmount =
      pkg!.pricing.type === "quote"
        ? 0
        : (deposit > 0 ? deposit : basePrice) + addOnsTotal;
    const addOnNote = addOns.length > 0 ? ` + Add-ons: ${addOns.map((a) => a.name).join(", ")}` : "";
    return {
      category: category!,
      pkg: pkg!,
      chargeAmount,
      dbRow: {
        group_id: groupId,
        service_slug: category!.slug,
        package_slug: pkg!.slug,
        vehicle_size: body.vehicleSize,
        vehicle_info: `${body.vehicleInfo}${item.note ?? ""}${addOnNote}`,
        customer_name: body.name,
        customer_phone: body.phone,
        customer_email: body.email || null,
        booking_date: body.date,
        booking_time: body.time,
        price_cents: Math.round(price * 100),
        deposit_cents: Math.round(chargeAmount * 100),
        status: "pending",
      },
    };
  });

  const { data: inserted, error } = await db
    .from("bookings")
    .insert(rows.map((r) => r.dbRow))
    .select("id");

  if (error || !inserted) {
    console.error("Failed to create booking:", error?.message);
    return NextResponse.json({ error: "Could not save your booking. Please try again." }, { status: 500 });
  }

  const totalCharge = rows.reduce((sum, r) => sum + r.chargeAmount, 0);

  if (totalCharge <= 0) {
    // Every selected service is quote-only — nothing to charge, and this
    // never touches Stripe/the webhook, so send the confirmation now.
    await sendBookingEmails({
      customerName: body.name,
      customerEmail: body.email || null,
      customerPhone: body.phone,
      vehicleInfo: body.vehicleInfo,
      date: body.date,
      time: body.time,
      chargedCents: 0,
      items: rows.map((r) => ({
        serviceName: r.category.name,
        packageName: r.pkg.name,
        priceCents: r.dbRow.price_cents,
        isQuote: true,
      })),
    }).catch((err) => console.error("sendBookingEmails threw unexpectedly:", err));
    return NextResponse.json({ redirectUrl: `/booking/success?group_id=${groupId}` });
  }

  const lineItems = rows
    .filter((r) => r.chargeAmount > 0)
    .map((r) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(r.chargeAmount * 100),
        product_data: {
          name: `${r.category.name} — ${r.pkg.name}`,
          description: `${body.vehicleInfo} · ${body.date} at ${body.time}`,
        },
      },
      quantity: 1,
    }));

  const stripe = stripeClient();
  const origin = req.nextUrl.origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${origin}/booking/success?group_id=${groupId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/booking`,
    metadata: { group_id: groupId },
    // Stripe's default is 24h. An abandoned checkout otherwise blocks that
    // time slot for a full day even though no payment is coming — an hour
    // is plenty of time to finish paying but releases the slot quickly.
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
  });

  await db
    .from("bookings")
    .update({ stripe_session_id: session.id })
    .in(
      "id",
      inserted.map((r) => r.id)
    );

  return NextResponse.json({ redirectUrl: session.url });
}
