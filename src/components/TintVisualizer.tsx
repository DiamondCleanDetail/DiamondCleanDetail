"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { tintLevels } from "@/data/tintLevels";

export default function TintVisualizer({ hasTeslaVariant }: { hasTeslaVariant?: boolean }) {
  const [level, setLevel] = useState(tintLevels.find((l) => l.value === 20)!);
  const [isTesla, setIsTesla] = useState(false);

  const image = isTesla ? level.teslaImage : level.image;

  return (
    <div className="relative w-full">
      <div className="relative py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center mb-10">
          <h3 className="font-semibold text-lg sm:text-xl text-neutral-900">Choose Your Tint Level</h3>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Preview how each shade looks before you book.
          </p>
          {hasTeslaVariant && (
            <div className="inline-flex bg-neutral-100 border border-neutral-200 rounded-full p-1 text-xs mt-5">
              <button
                type="button"
                onClick={() => setIsTesla(false)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  !isTesla
                    ? "bg-neutral-200 text-neutral-900 font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Standard Vehicle
              </button>
              <button
                type="button"
                onClick={() => setIsTesla(true)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  isTesla
                    ? "bg-neutral-200 text-neutral-900 font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Tesla
              </button>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-6xl px-6">
          {/* Level tabs */}
          <div className="relative flex w-full rounded-full border border-neutral-200 bg-neutral-100 p-1">
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
                      isActive ? "text-[color:var(--accent-foreground)]" : "text-neutral-400 hover:text-neutral-700"
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
            <AnimatePresence mode="popLayout">
              <motion.span
                key={level.value}
                aria-hidden
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const }}
                className="pointer-events-none select-none absolute bottom-[68%] right-[10%] z-0 text-7xl sm:text-9xl font-black text-neutral-900/25 leading-none"
              >
                {level.label}
              </motion.span>
            </AnimatePresence>

            <div className="absolute inset-0">
              {image ? (
                <Image
                  src={image}
                  alt={`${level.label} tint preview`}
                  fill
                  priority
                  className="object-contain"
                />
              ) : (
                <div className="absolute inset-0 rounded-xl border border-dashed border-neutral-300 flex items-center justify-center">
                  <p className="text-sm text-neutral-500 text-center px-6">
                    {isTesla ? "Tesla" : "Standard vehicle"} preview at{" "}
                    <span className="text-neutral-900 font-medium">{level.label}</span> coming soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
