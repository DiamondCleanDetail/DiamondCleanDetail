import { NextRequest, NextResponse } from "next/server";
import { stripeClient } from "@/lib/stripe";
import {
  getProduct,
  isShippable,
  SHIPPING_FLAT_CENTS,
  MAX_LINE_QTY,
  PRODUCTS_COMING_SOON,
} from "@/data/products";

type CartLine = { slug: string; qty: number };
type CheckoutBody = { items: CartLine[] };

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Re-resolve every line from the catalogue. Nothing the browser sends about
  // price, name, or stock is trusted — only the slug and a sane quantity.
  const resolved: { slug: string; qty: number; name: string; unitCents: number; shippable: boolean }[] = [];
  for (const line of body.items) {
    const product = typeof line.slug === "string" ? getProduct(line.slug) : undefined;
    const qty = Math.floor(Number(line.qty));
    if (!product) {
      return NextResponse.json({ error: "One of those items is no longer available." }, { status: 400 });
    }
    if (!product.inStock) {
      return NextResponse.json({ error: `${product.name} is out of stock.` }, { status: 400 });
    }
    // Physical products aren't for sale yet — only gift cards can be bought.
    if (PRODUCTS_COMING_SOON && product.kind === "supply") {
      return NextResponse.json({ error: "Our products aren't for sale yet — gift cards only for now." }, { status: 400 });
    }
    if (!Number.isFinite(qty) || qty < 1 || qty > MAX_LINE_QTY) {
      return NextResponse.json({ error: "That quantity isn't valid." }, { status: 400 });
    }
    resolved.push({
      slug: product.slug,
      qty,
      name: product.name,
      unitCents: product.priceCents,
      shippable: isShippable(product),
    });
  }

  const hasPhysical = resolved.some((r) => r.shippable);

  const lineItems = resolved.map((r) => ({
    price_data: {
      currency: "usd",
      unit_amount: r.unitCents,
      product_data: { name: r.name },
    },
    quantity: r.qty,
  }));

  // The webhook fulfils from this, so it has to survive Stripe's 500-char
  // metadata limit: slug:qty pairs, nothing more. The cart is capped in the
  // UI and by MAX_LINE_QTY, so this stays well under the limit.
  const cartCompact = resolved.map((r) => `${r.slug}:${r.qty}`).join(",");

  const stripe = stripeClient();
  const origin = req.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      // Always collect the email so we can send codes / a receipt, and so the
      // owner can reach the buyer.
      customer_creation: "always",
      // Only ask for a shipping address when something physical is in the cart;
      // a gift-card-only order needs no address.
      ...(hasPhysical
        ? {
            shipping_address_collection: { allowed_countries: ["US"] as const },
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount" as const,
                  fixed_amount: { amount: SHIPPING_FLAT_CENTS, currency: "usd" },
                  display_name: "Standard shipping",
                },
              },
            ],
          }
        : {}),
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata: { kind: "shop", cart: cartCompact },
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    });

    return NextResponse.json({ redirectUrl: session.url });
  } catch (err) {
    console.error("Shop checkout failed to create a Stripe session:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
