import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stripeClient } from "@/lib/stripe";
import { getCategory, priceForSize } from "@/data/catalog";

type CartItemInput = { serviceSlug: string; packageSlug: string };

type CheckoutBody = {
  items: CartItemInput[];
  vehicleSize: "sedan" | "suv" | "truck";
  vehicleInfo: string;
  name: string;
  phone: string;
  date: string;
  time: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CheckoutBody;

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (!["sedan", "suv", "truck"].includes(body.vehicleSize)) {
    return NextResponse.json({ error: "Invalid vehicle size." }, { status: 400 });
  }
  if (!body.name || !body.phone || !body.vehicleInfo || !body.date || !body.time) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const resolved = body.items.map((item) => {
    const category = getCategory(item.serviceSlug);
    const pkg = category?.packages.find((p) => p.slug === item.packageSlug);
    return { item, category, pkg };
  });
  if (resolved.some((r) => !r.category || !r.pkg)) {
    return NextResponse.json({ error: "One of the items in your cart is no longer available." }, { status: 400 });
  }

  const groupId = randomUUID();
  const db = supabaseAdmin();

  const rows = resolved.map(({ category, pkg }) => {
    const price = priceForSize(pkg!, body.vehicleSize) ?? 0;
    const depositPercent = pkg!.depositPercent ?? 0;
    const deposit = depositPercent > 0 ? Math.round((price * depositPercent) / 100) : 0;
    const chargeAmount = pkg!.pricing.type === "quote" ? 0 : deposit > 0 ? deposit : price;
    return {
      group_id: groupId,
      service_slug: category!.slug,
      package_slug: pkg!.slug,
      vehicle_size: body.vehicleSize,
      vehicle_info: body.vehicleInfo,
      customer_name: body.name,
      customer_phone: body.phone,
      booking_date: body.date,
      booking_time: body.time,
      price_cents: Math.round(price * 100),
      deposit_cents: Math.round(chargeAmount * 100),
      status: "pending",
      category,
      pkg,
      chargeAmount,
    };
  });

  const dbRows = rows.map((r) => ({
    group_id: r.group_id,
    service_slug: r.service_slug,
    package_slug: r.package_slug,
    vehicle_size: r.vehicle_size,
    vehicle_info: r.vehicle_info,
    customer_name: r.customer_name,
    customer_phone: r.customer_phone,
    booking_date: r.booking_date,
    booking_time: r.booking_time,
    price_cents: r.price_cents,
    deposit_cents: r.deposit_cents,
    status: r.status,
  }));

  const { data: inserted, error } = await db.from("bookings").insert(dbRows).select("id");

  if (error || !inserted) {
    console.error("Failed to create cart booking group:", error?.message);
    return NextResponse.json({ error: "Could not save your booking. Please try again." }, { status: 500 });
  }

  const totalCharge = rows.reduce((sum, r) => sum + r.chargeAmount, 0);

  if (totalCharge <= 0) {
    // Every item in the cart is quote-only — nothing to charge.
    return NextResponse.json({ redirectUrl: `/booking/success?group_id=${groupId}` });
  }

  const lineItems = rows
    .filter((r) => r.chargeAmount > 0)
    .map((r) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(r.chargeAmount * 100),
        product_data: {
          name: `${r.category!.name} — ${r.pkg!.name}`,
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
    cancel_url: `${origin}/cart`,
    metadata: { group_id: groupId },
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
