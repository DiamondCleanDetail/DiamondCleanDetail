import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stripeClient } from "@/lib/stripe";
import { getCategory } from "@/data/catalog";

type StartBookingBody = {
  serviceSlug: string;
  packageSlug: string;
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

  const category = getCategory(body.serviceSlug);
  const pkg = category?.packages.find((p) => p.slug === body.packageSlug);
  if (!category || !pkg) {
    return NextResponse.json({ error: "Unknown service or package." }, { status: 400 });
  }
  if (!body.name || !body.phone || !body.vehicleInfo || !body.date || !body.time) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!["sedan", "suv", "truck"].includes(body.vehicleSize)) {
    return NextResponse.json({ error: "Invalid vehicle size." }, { status: 400 });
  }

  const isQuote = pkg.pricing.type === "quote";
  const price =
    pkg.pricing.type === "fixed"
      ? pkg.pricing.byVehicleSize[body.vehicleSize]
      : pkg.pricing.type === "starting-at"
        ? pkg.pricing.amount
        : 0;
  const depositPercent = pkg.depositPercent ?? 0;
  const deposit = depositPercent > 0 ? Math.round((price * depositPercent) / 100) : 0;
  const chargeAmount = isQuote ? 0 : deposit > 0 ? deposit : price;

  const db = supabaseAdmin();
  const { data: booking, error } = await db
    .from("bookings")
    .insert({
      service_slug: body.serviceSlug,
      package_slug: body.packageSlug,
      vehicle_size: body.vehicleSize,
      vehicle_info: body.vehicleInfo,
      customer_name: body.name,
      customer_phone: body.phone,
      customer_email: body.email || null,
      booking_date: body.date,
      booking_time: body.time,
      price_cents: Math.round(price * 100),
      deposit_cents: Math.round(chargeAmount * 100),
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !booking) {
    console.error("Failed to create booking:", error?.message);
    return NextResponse.json({ error: "Could not save booking. Please try again." }, { status: 500 });
  }

  // Quote-only or $0 services skip Stripe entirely.
  if (isQuote || chargeAmount <= 0) {
    return NextResponse.json({ redirectUrl: `/booking/success?booking_id=${booking.id}` });
  }

  const stripe = stripeClient();
  const origin = req.nextUrl.origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(chargeAmount * 100),
          product_data: {
            name: `${category.name} — ${pkg.name}`,
            description: `${body.vehicleInfo} · ${body.date} at ${body.time}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/booking/success?booking_id=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/booking?service=${body.serviceSlug}&package=${body.packageSlug}`,
    metadata: { booking_id: booking.id },
  });

  await db.from("bookings").update({ stripe_session_id: session.id }).eq("id", booking.id);

  return NextResponse.json({ redirectUrl: session.url });
}
