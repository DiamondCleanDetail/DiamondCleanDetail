"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { MAX_LINE_QTY, PRODUCTS_COMING_SOON } from "@/data/products";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

function money(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7" aria-hidden>
      <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8M2 7h20v4H2zM12 21V7M12 7S11 3 8.5 3 6 5 6 5s.5 2 3 2M12 7s1-4 3.5-4S18 5 18 5s-.5 2-3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BottleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7" aria-hidden>
      <path d="M10 2h4v3h-4zM9 8a3 3 0 0 1 1.2-2.4l.3-.2V5h3v.4l.3.2A3 3 0 0 1 15 8v12a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM9 12h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stepper({
  qty,
  onChange,
  disabled,
}: {
  qty: number;
  onChange: (next: number) => void;
  disabled?: boolean;
}) {
  if (disabled) {
    return <span className="text-xs text-muted">Out of stock</span>;
  }
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => onChange(1)}
        className="chrome-btn px-4 py-2 rounded-lg font-semibold text-sm"
      >
        Add
      </button>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(qty - 1)}
        className="w-8 h-8 rounded-lg border border-border text-foreground hover:border-foreground/40 transition-colors leading-none"
      >
        &minus;
      </button>
      <span className="w-5 text-center tabular-nums font-medium">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(MAX_LINE_QTY, qty + 1))}
        className="w-8 h-8 rounded-lg border border-border text-foreground hover:border-foreground/40 transition-colors leading-none"
      >
        +
      </button>
    </div>
  );
}

function ProductCard({
  product,
  qty,
  onQty,
}: {
  product: Product;
  qty: number;
  onQty: (next: number) => void;
}) {
  return (
    <div className="card-lift h-full bg-surface border border-border rounded-xl p-5 flex flex-col">
      <div className="h-24 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-muted mb-4">
        {product.kind === "gift-card" ? <GiftIcon /> : <BottleIcon />}
      </div>
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-muted mt-1 flex-1">{product.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="chrome-text font-semibold">{money(product.priceCents)}</span>
        <Stepper qty={qty} onChange={onQty} disabled={!product.inStock} />
      </div>
    </div>
  );
}

export default function ShopClient({ products }: { products: Product[] }) {
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const giftCards = products.filter((p) => p.kind === "gift-card");
  const supplies = products.filter((p) => p.kind === "supply");

  const setQty = (slug: string, next: number) =>
    setQtys((prev) => {
      const copy = { ...prev };
      if (next <= 0) delete copy[slug];
      else copy[slug] = next;
      return copy;
    });

  const { count, subtotalCents } = useMemo(() => {
    let count = 0;
    let subtotalCents = 0;
    for (const [slug, qty] of Object.entries(qtys)) {
      const p = products.find((x) => x.slug === slug);
      if (!p) continue;
      count += qty;
      subtotalCents += p.priceCents * qty;
    }
    return { count, subtotalCents };
  }, [qtys, products]);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const items = Object.entries(qtys).map(([slug, qty]) => ({ slug, qty }));
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok || !data.redirectUrl) {
        setError(data.error || "Could not start checkout. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.redirectUrl;
    } catch {
      setError("Could not reach checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      {/* Padding at the bottom so the sticky checkout bar never covers the
          last row of cards. */}
      <div className="pb-28">
        {giftCards.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-1">Gift Cards</h2>
            <p className="text-sm text-muted mb-5">Delivered by email as a code — redeemable against any service.</p>
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {giftCards.map((p) => (
                <StaggerItem key={p.slug}>
                  <ProductCard product={p} qty={qtys[p.slug] ?? 0} onQty={(n) => setQty(p.slug, n)} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-1">Detailing Supplies</h2>
          <p className="text-sm text-muted mb-5">The same products we use, shipped to your door.</p>
          {PRODUCTS_COMING_SOON ? (
            <div className="rounded-xl border border-dashed border-border bg-surface-2/40 p-8 text-center">
              <p className="text-foreground font-medium">Products coming soon</p>
              <p className="text-sm text-muted mt-2 max-w-md mx-auto">
                We&apos;re putting together a lineup of the products we trust. In the meantime, gift
                cards above make a great gift.
              </p>
            </div>
          ) : (
            supplies.length > 0 && (
              <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {supplies.map((p) => (
                  <StaggerItem key={p.slug}>
                    <ProductCard product={p} qty={qtys[p.slug] ?? 0} onQty={(n) => setQty(p.slug, n)} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )
          )}
        </section>
      </div>

      {/* Sticky checkout bar — appears only once something is in the cart. */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted">
                {count} item{count === 1 ? "" : "s"}
                <span className="mx-2 text-border">&bull;</span>
                <span className="chrome-text font-semibold text-base">{money(subtotalCents)}</span>
              </p>
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
              <p className="text-[11px] text-muted mt-0.5">Shipping, if any, is calculated at checkout.</p>
            </div>
            <button
              type="button"
              onClick={checkout}
              disabled={loading}
              className="chrome-btn px-6 py-3 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? "Starting…" : "Checkout →"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
