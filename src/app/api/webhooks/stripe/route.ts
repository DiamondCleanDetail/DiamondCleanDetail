import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripeClient } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = stripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    const groupId = session.metadata?.group_id;

    if (session.payment_status === "paid") {
      const db = supabaseAdmin();
      const query = groupId
        ? db.from("bookings").update({ status: "paid" }).eq("group_id", groupId).eq("status", "pending")
        : bookingId
          ? db.from("bookings").update({ status: "paid" }).eq("id", bookingId).eq("status", "pending")
          : null;

      const { error } = query ? await query : { error: null };
      if (error) {
        console.error("Webhook failed to mark booking paid:", error.message);
      }
    }
  }

  // A customer who starts checkout but never pays (closes the tab, card
  // declines and they give up) would otherwise leave a "pending" row that
  // blocks that time slot forever — nothing else ever transitions it out
  // of "pending". Release the slot by cancelling it once Stripe considers
  // the session dead.
  if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const groupId = session.metadata?.group_id;
    if (groupId) {
      const db = supabaseAdmin();
      const { error } = await db
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("group_id", groupId)
        .eq("status", "pending");
      if (error) {
        console.error("Webhook failed to release abandoned booking:", error.message);
      }
    }
  }

  return NextResponse.json({ received: true });
}
