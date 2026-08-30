import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripeClient } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCategory } from "@/data/catalog";
import { sendBookingEmails } from "@/lib/bookingEmails";
import { getProduct, isShippable } from "@/data/products";
import { giftCodeFromSeed } from "@/lib/giftCards";
import { sendShopEmails, type ShopLine, type IssuedGiftCard } from "@/lib/shopEmails";

/** Fulfil a paid shop order: issue gift-card codes and email the buyer and
 * the owner. The order isn't stored in the database — it lives in Stripe and
 * in the two emails — so codes are derived from the session id to stay stable
 * if Stripe redelivers the event. */
async function fulfilShopOrder(session: Stripe.Checkout.Session): Promise<void> {
  const cart = session.metadata?.cart ?? "";
  const lines: ShopLine[] = [];
  const giftCards: IssuedGiftCard[] = [];

  cart
    .split(",")
    .map((pair) => pair.split(":"))
    .forEach(([slug, qtyRaw], lineIdx) => {
      const product = getProduct(slug);
      const qty = Math.floor(Number(qtyRaw));
      if (!product || !Number.isFinite(qty) || qty < 1) return;
      lines.push({ name: product.name, qty, unitCents: product.priceCents, kind: product.kind });
      if (product.kind === "gift-card") {
        for (let i = 0; i < qty; i++) {
          giftCards.push({
            code: giftCodeFromSeed(`${session.id}:${lineIdx}:${i}`),
            amountCents: product.priceCents,
          });
        }
      }
    });

  if (lines.length === 0) {
    console.error("Shop webhook: empty or unrecognised cart on", session.id);
    return;
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.unitCents * l.qty, 0);
  const shippingCents = session.shipping_cost?.amount_total ?? 0;
  const totalCents = session.amount_total ?? subtotalCents + shippingCents;

  // Shipping details moved to collected_information in recent API versions;
  // fall back through the older locations so an address isn't silently lost.
  const s = session as unknown as {
    collected_information?: { shipping_details?: { name?: string; address?: Record<string, string> } };
    shipping_details?: { name?: string; address?: Record<string, string> };
  };
  const ship = s.collected_information?.shipping_details ?? s.shipping_details ?? null;
  const addr = ship?.address ?? null;

  await sendShopEmails({
    customerName: session.customer_details?.name ?? ship?.name ?? null,
    customerEmail: session.customer_details?.email ?? null,
    items: lines,
    giftCards,
    shipping: addr
      ? {
          name: ship?.name ?? null,
          line1: addr.line1 ?? null,
          line2: addr.line2 ?? null,
          city: addr.city ?? null,
          state: addr.state ?? null,
          postalCode: addr.postal_code ?? null,
          country: addr.country ?? null,
        }
      : null,
    subtotalCents,
    shippingCents,
    totalCents,
    reference: session.id,
  }).catch((err) => console.error("sendShopEmails threw unexpectedly:", err));
}

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

    // Shop orders and bookings both come through here; a shop order carries no
    // booking rows to update, so it's handled on its own and returns early.
    if (session.metadata?.kind === "shop") {
      if (session.payment_status === "paid") {
        await fulfilShopOrder(session);
      }
      return NextResponse.json({ received: true });
    }

    const bookingId = session.metadata?.booking_id;
    const groupId = session.metadata?.group_id;

    if (session.payment_status === "paid") {
      const db = supabaseAdmin();
      const query = groupId
        ? db.from("bookings").update({ status: "paid" }).eq("group_id", groupId).eq("status", "pending").select()
        : bookingId
          ? db.from("bookings").update({ status: "paid" }).eq("id", bookingId).eq("status", "pending").select()
          : null;

      const { data: updatedRows, error } = query ? await query : { data: null, error: null };
      if (error) {
        console.error("Webhook failed to mark booking paid:", error.message);
      } else if (updatedRows && updatedRows.length > 0) {
        const first = updatedRows[0];
        await sendBookingEmails({
          customerName: first.customer_name,
          customerEmail: first.customer_email,
          customerPhone: first.customer_phone,
          vehicleInfo: first.vehicle_info,
          date: first.booking_date,
          time: first.booking_time,
          chargedCents: updatedRows.reduce((sum, r) => sum + r.deposit_cents, 0),
          items: updatedRows.map((r) => {
            const category = getCategory(r.service_slug);
            const pkg = category?.packages.find((p) => p.slug === r.package_slug);
            return {
              serviceName: category?.name ?? r.service_slug,
              packageName: pkg?.name ?? r.package_slug,
              priceCents: r.price_cents,
              isQuote: pkg?.pricing.type === "quote",
            };
          }),
        }).catch((err) => console.error("sendBookingEmails threw unexpectedly:", err));
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
