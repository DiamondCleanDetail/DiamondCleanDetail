"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Package } from "@/data/catalog";
import { priceLabel } from "@/data/catalog";

const images: Record<string, string> = {
  guard: "/services/ppf-visualizer-bumper.png",
  armor: "/services/ppf-visualizer-front.png",
  fortress: "/services/ppf-visualizer-full.png",
};

const priceOverride: Record<string, { price: string; note?: string }> = {
  fortress: {
    price: "$4,999 – $6,999",
    note: "Price varies by coverage area and vehicle size. Contact us for an exact estimate and installation time.",
  },
};

export default function PPFVisualizer({
  packages,
  categorySlug,
  showCta = true,
}: {
  packages: Package[];
  categorySlug: string;
  showCta?: boolean;
}) {
  const [active, setActive] = useState(packages[0]?.slug ?? "");
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
        <div className="relative flex w-full rounded-full border border-border bg-surface p-1 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.6)]">
          {packages.map((p) => {
            const isActive = p.slug === active;
            return (
              <button
                type="button"
                key={p.slug}
                onClick={() => setActive(p.slug)}
                className="relative flex-1 py-2.5 sm:py-3 text-center"
              >
                {isActive && (
                  <motion.span
                    layoutId="ppf-tab-highlight"
                    className="absolute inset-0 chrome-chip rounded-full"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive ? "text-[color:var(--accent-foreground)]" : "text-muted hover:text-foreground"
                  }`}
                >
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="relative aspect-[1133/535] w-full">
            {image ? (
              <div className="absolute inset-0">
                <Image
                  src={image}
                  alt={`${pkg.name} PPF coverage`}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            ) : (
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
