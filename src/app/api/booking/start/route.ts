import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stripeClient } from "@/lib/stripe";
import { getCategory, priceForSize } from "@/data/catalog";
import { todayIso, isWeekend, parseTimeToMinutes, rangesOverlap, CLOSING_MINUTES } from "@/lib/scheduling";

type ItemInput = { serviceSlug: string; packageSlug: string; note?: string };

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
  // The date picker enforces this client-side, but nothing stops a direct
  // API request from skipping it — a past or weekend date would otherwise
  // create a real, chargeable booking Farhan can never fulfill.
  if (body.date < todayIso()) {
    return NextResponse.json({ error: "That date has already passed." }, { status: 400 });
  }
  if (isWeekend(body.date)) {
    return NextResponse.json({ error: "We're closed on weekends." }, { status: 400 });
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
    const price = priceForSize(pkg!, body.vehicleSize) ?? 0;
    const depositPercent = pkg!.depositPercent ?? 0;
    const deposit = depositPercent > 0 ? Math.round((price * depositPercent) / 100) : 0;
    const chargeAmount = pkg!.pricing.type === "quote" ? 0 : deposit > 0 ? deposit : price;
    return {
      category: category!,
      pkg: pkg!,
      chargeAmount,
      dbRow: {
        group_id: groupId,
        service_slug: category!.slug,
        package_slug: pkg!.slug,
        vehicle_size: body.vehicleSize,
        vehicle_info: `${body.vehicleInfo}${item.note ?? ""}`,
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
    // Every selected service is quote-only — nothing to charge.
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
