"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { tintLevels } from "@/data/tintLevels";

export default function TintVisualizer({ hasTeslaVariant }: { hasTeslaVariant?: boolean }) {
  const [level, setLevel] = useState(tintLevels[2]); // default 20%
  const [isTesla, setIsTesla] = useState(false);

  const image = isTesla ? level.teslaImage : level.image;

  return (
    <div className="w-full py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center mb-10">
        <h3 className="font-semibold text-lg sm:text-xl">Choose Your Tint Level</h3>
        <p className="text-xs sm:text-sm text-muted mt-2">
          Preview how each shade looks before you book.
        </p>
        {hasTeslaVariant && (
          <div className="inline-flex bg-surface border border-border rounded-full p-1 text-xs mt-5">
            <button
              type="button"
              onClick={() => setIsTesla(false)}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                !isTesla ? "chrome-chip text-[color:var(--accent-foreground)] font-semibold" : "text-muted hover:text-foreground"
              }`}
            >
              Standard Vehicle
            </button>
            <button
              type="button"
              onClick={() => setIsTesla(true)}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                isTesla ? "chrome-chip text-[color:var(--accent-foreground)] font-semibold" : "text-muted hover:text-foreground"
              }`}
            >
              Tesla
            </button>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Level tabs */}
        <div className="relative flex w-full rounded-full border border-border bg-surface p-1 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.6)]">
          {tintLevels.map((l) => {
            const isActive = l.value === level.value;
            return (
              <button
                type="button"
                key={l.value}
                onClick={() => setLevel(l)}
                className="relative flex-1 py-2.5 sm:py-3 text-center"
              >
                {isActive && (
                  <motion.span
                    layoutId="tint-tab-highlight"
                    className="absolute inset-0 chrome-chip rounded-full"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive ? "text-[color:var(--accent-foreground)]" : "text-muted hover:text-foreground"
                  }`}
                >
                  {l.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Preview */}
        <div className="relative mt-10 sm:mt-14 aspect-[3054/955] w-full">
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -bottom-4 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-0 text-7xl sm:text-9xl font-black text-foreground/10 leading-none"
          >
            {level.label}
          </span>

          <AnimatePresence mode="wait">
            {image ? (
              <motion.div
                key={`${isTesla ? "tesla" : "standard"}-${level.value}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as const }}
                className="absolute inset-0 drop-shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
              >
                <Image
                  src={image}
                  alt={`${level.label} tint preview`}
                  fill
                  priority
                  className="object-contain"
                />
              </motion.div>
            ) : (
              <motion.div
                key={`${isTesla ? "tesla" : "standard"}-${level.value}-empty`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 rounded-xl border border-dashed border-border/60 flex items-center justify-center"
              >
                <p className="text-sm text-muted text-center px-6">
                  {isTesla ? "Tesla" : "Standard vehicle"} preview at{" "}
                  <span className="text-foreground font-medium">{level.label}</span> coming soon.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
