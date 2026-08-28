"use client";

import { useState } from "react";
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
        <SegmentedTabs
          items={packages.map((p) => ({ value: p.slug, label: p.name }))}
          value={pkg.slug}
          onChange={setActive}
          layoutId="ppf-tab-highlight"
          tone="dark"
          className="w-full"
        />

        {/* Content */}
        <div className="mt-10 sm:mt-14 grid lg:grid-cols-[3fr_2fr] gap-8 sm:gap-10 items-start">
          <div className="relative aspect-[1600/768] w-full">
            <AnimatePresence initial={false}>
              {image ? (
                <motion.div
                  key={image}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const }}
                >
                  <Image
                    src={image}
                    alt={`${pkg.name} PPF coverage`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="absolute inset-0 rounded-xl border border-dashed border-border/60 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const }}
                >
                  <p className="text-sm text-muted">Coverage photo coming soon</p>
                </motion.div>
              )}
            </AnimatePresence>
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
