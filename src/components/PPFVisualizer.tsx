"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Package } from "@/data/catalog";
import { priceLabel } from "@/data/catalog";
import SegmentedTabs from "@/components/SegmentedTabs";

const images: Record<string, string> = {
  barrier: "/services/ppf-visualizer-barrier.png",
  shield: "/services/ppf-visualizer-shield.png",
  armor: "/services/ppf-visualizer-armor.png",
  track: "/services/ppf-visualizer-track.png",
  "full-protection": "/services/ppf-visualizer-full-protection.png",
};

const priceOverride: Record<string, { price: string; note?: string }> = {
  "full-protection": {
    price: "$4,999 – $6,999",
    note: "Price varies by coverage area and vehicle size. Contact us for an exact estimate and installation time.",
  },
};

export default function PPFVisualizer({
  packages,
  categorySlug,
  showCta = true,
  value,
  onChange,
}: {
  packages: Package[];
  categorySlug: string;
  showCta?: boolean;
  /** Controlled tier. The booking wizard passes these so the visualizer's
   * tier tabs ARE the package choice. Uncontrolled (the service page), the
   * tabs only drive the preview and the CTA links carry the choice instead.
   * Before this, the wizard embedded the visualizer read-only above its own
   * package list — so clicking "Shield" on the big visual looked exactly
   * like choosing Shield while the booking quietly stayed on the default
   * tier, and the mismatch only surfaced as a wrong total at payment. */
  value?: string;
  onChange?: (slug: string) => void;
}) {
  const firstSlug = packages[0]?.slug ?? "";
  const [internalActive, setActive] = useState(firstSlug);
  const active = value ?? internalActive;
  /**
   * Which layer is actually on screen.
   *
   * Kept apart from `active` so the tier copy, price and CTA can update the
   * instant someone picks a tier, while the image only advances once its
   * file has loaded. All the layers are eager, so in practice that has
   * already happened — but on a slow enough connection a click can still
   * land first, and this is what makes a blank frame impossible rather than
   * merely unlikely: the outgoing image stays until the incoming one can
   * replace it.
   */
  const [shown, setShown] = useState(firstSlug);
  const stackRef = useRef<HTMLDivElement>(null);
  // `active` only ever changes through selectTier, so this mirror stays in
  // step without writing to a ref during render.
  const activeRef = useRef(firstSlug);

  function advanceImageTo(slug: string) {
    activeRef.current = slug;
    // Ask the DOM whether that layer's file has arrived, rather than tracking
    // it through React's onLoad: these images are eager and typically finish
    // before hydration, so the event has already been and gone by the time a
    // handler is attached. `complete` is synchronous and cannot be missed.
    const img = stackRef.current?.querySelector<HTMLImageElement>(
      `[data-slug="${slug}"] img`
    );
    if (!img || img.complete) {
      setShown(slug);
      return;
    }
    // Still in flight: hold the outgoing image until this one can replace it,
    // so the swap is never to an empty layer.
    img.addEventListener(
      "load",
      () => {
        if (activeRef.current === slug) setShown(slug);
      },
      { once: true }
    );
  }

  function selectTier(slug: string) {
    setActive(slug);
    onChange?.(slug);
    advanceImageTo(slug);
  }

  // In controlled mode the tier can also change from outside — the wizard's
  // package list below this visualizer sets the same selection — and the
  // image stack has to follow that change exactly as it follows a tab click.
  useEffect(() => {
    if (value !== undefined && value !== activeRef.current) advanceImageTo(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const pkg = packages.find((p) => p.slug === active) ?? packages[0];
  if (!pkg) return null;

  const image = images[pkg.slug];
  const override = priceOverride[pkg.slug];

  return (
    <div className="w-full py-14 sm:py-20 bg-black">
      <div className="mx-auto max-w-3xl px-6 text-center mb-10">
        <h3 className="font-semibold text-lg sm:text-xl">Preview Your Coverage</h3>
        <p className="text-xs sm:text-sm text-muted mt-2">
          Choose a tier to see exactly which panels are protected.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Tier tabs */}
        <SegmentedTabs
          items={packages.map((p) => ({ value: p.slug, label: p.name }))}
          value={pkg.slug}
          onChange={selectTier}
          layoutId="ppf-tab-highlight"
          tone="dark"
          className="w-full"
        />

        {/* Content */}
        <div className="mt-10 sm:mt-14 grid lg:grid-cols-[3fr_2fr] gap-8 sm:gap-10 items-start">
          {/* Fixed aspect box holding every tier's image at once. The box
              owns the height, so swapping layers cannot shift the layout. */}
          <div ref={stackRef} className="relative aspect-[1600/768] w-full">
            {packages.map((p) => {
              const src = images[p.slug];
              if (!src) return null;
              const isShown = p.slug === shown;
              return (
                <div
                  key={p.slug}
                  data-slug={p.slug}
                  data-shown={isShown}
                  aria-hidden={!isShown}
                  className="ppf-coverage-layer absolute inset-0"
                >
                  <Image
                    src={src}
                    alt={isShown ? `${p.name} PPF coverage` : ""}
                    fill
                    // Every layer is fetched up front — that is the whole
                    // point — but only the one on screen at mount competes
                    // for priority with the rest of the page.
                    priority={p.slug === firstSlug}
                    loading="eager"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain"

                  />
                </div>
              );
            })}
            {!image && (
              <div className="absolute inset-0 rounded-xl border border-dashed border-border/60 flex items-center justify-center">
                <p className="text-sm text-muted">Coverage photo coming soon</p>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={pkg.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] as const }}
            >
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">
                Tier {packages.findIndex((p) => p.slug === pkg.slug) + 1} of {packages.length}
              </span>
              <h4 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2">{pkg.name}</h4>
              <p className="text-sm sm:text-base text-muted mt-3">{pkg.tagline}</p>
              <p className="text-xs sm:text-sm text-muted/80 mt-3 italic">
                Coverage areas: {pkg.features.join(", ")}
              </p>
              {override?.note && (
                <p className="text-xs text-muted/70 mt-3">{override.note}</p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-5 bg-surface-2 border border-border rounded-xl px-5 py-4">
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">
                    {override ? "Estimated Range" : "Starting From"}
                  </p>
                  <p className="chrome-text text-2xl sm:text-3xl font-bold leading-tight">
                    {override?.price ?? priceLabel(pkg, "sedan").replace(/^From /, "")}
                  </p>
                </div>
                {showCta && (
                  <Link
                    href={`/booking?service=${categorySlug}&package=${pkg.slug}`}
                    className="chrome-btn ml-auto inline-block px-7 py-3.5 rounded-lg font-bold text-base whitespace-nowrap"
                  >
                    {pkg.pricing.type === "quote" ? "Get a Quote →" : "Book This →"}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
