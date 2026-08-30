import Link from "next/link";
import { stripeClient } from "@/lib/stripe";
import { getProduct } from "@/data/products";

export default async function ShopSuccessPage({
  searchParams,
}: PageProps<"/shop/success">) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;

  let email: string | null = null;
  let hasGiftCards = false;
  let hasPhysical = false;
  let paid = false;

  if (sessionId) {
    // A light, optional reconciliation — the webhook is the source of truth
    // for fulfilment. A bad or expired session_id must not 500 the page and
    // deny a paying customer their confirmation, so any failure is swallowed.
    try {
      const stripe = stripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      email = session.customer_details?.email ?? null;
      const cart = session.metadata?.cart ?? "";
      for (const pair of cart.split(",")) {
        const product = getProduct(pair.split(":")[0]);
        if (product?.kind === "gift-card") hasGiftCards = true;
        if (product?.kind === "supply") hasPhysical = true;
      }
    } catch (err) {
      console.error("Shop success page failed to read the Stripe session:", err);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <div className="bg-surface border border-border rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2">
          {paid ? "Order Confirmed" : "Thanks for Your Order"}
        </h1>
        <p className="text-muted">
          {email ? (
            <>A receipt is on its way to <span className="text-foreground">{email}</span>.</>
          ) : (
            <>A receipt has been emailed to you.</>
          )}
        </p>

        {hasGiftCards && (
          <p className="text-sm text-muted mt-4">
            Your gift card{" "}
            code{hasPhysical ? "s are" : "s are"} in that email — mention the code when you book and
            we&apos;ll apply the balance to your service.
          </p>
        )}
        {hasPhysical && (
          <p className="text-sm text-muted mt-4">
            We&apos;ll get your supplies packed and on their way to the address you provided.
          </p>
        )}

        <p className="text-sm text-muted mt-6">
          Questions about your order? Just reply to the email or give us a call.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Link href="/shop" className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4">
            Back to Shop
          </Link>
          <span aria-hidden className="text-border">&middot;</span>
          <Link href="/" className="chrome-btn inline-block px-6 py-2 rounded-lg font-semibold text-sm">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
