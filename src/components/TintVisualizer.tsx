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
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">
            Step 1
          </span>
          <h3 className="font-semibold">Choose Your Tint Level</h3>
        </div>
        {hasTeslaVariant && (
          <div className="flex bg-surface-2 border border-border rounded-full p-1 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setIsTesla(false)}
              className={`px-3 py-1 rounded-full transition-colors ${
                !isTesla ? "bg-accent text-accent-foreground" : "text-muted"
              }`}
            >
              Standard Vehicle
            </button>
            <button
              type="button"
              onClick={() => setIsTesla(true)}
              className={`px-3 py-1 rounded-full transition-colors ${
                isTesla ? "bg-accent text-accent-foreground" : "text-muted"
              }`}
            >
              Tesla
            </button>
          </div>
        )}
      </div>

      {/* Level tabs — full-width strip, matches the reference layout */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {tintLevels.map((l) => (
          <button
            type="button"
            key={l.value}
            onClick={() => setLevel(l)}
            className={`rounded-lg py-3 text-sm font-semibold transition-colors border ${
              level.value === l.value
                ? "chrome-btn border-transparent"
                : "bg-surface-2 border-border text-muted hover:text-foreground"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="relative rounded-lg overflow-hidden bg-surface-2">
        <span
          aria-hidden
          className="pointer-events-none select-none absolute left-3 bottom-2 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 z-0 text-6xl sm:text-8xl font-black text-foreground/10 leading-none"
        >
          {level.label}
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${isTesla ? "tesla" : "standard"}-${level.value}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative aspect-video"
          >
            {image ? (
              <Image src={image} alt={`${level.label} tint preview`} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <p className="text-sm text-muted">
                  {isTesla ? "Tesla" : "Standard vehicle"} preview at{" "}
                  <span className="text-foreground font-medium">{level.label}</span> coming soon.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
