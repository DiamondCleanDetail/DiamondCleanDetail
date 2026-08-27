"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { windshieldTintLevels } from "@/data/tintLevels";

/** Shown when the customer selects the Windshield Strip coverage option —
 * its own shade picker, since the visor strip supports 80% (not offered
 * for full windows) and deserves its own visual rather than reusing the
 * Step 1 body-window preview. */
export default function WindshieldTintPreview() {
  const [level, setLevel] = useState(windshieldTintLevels.find((l) => l.value === 5) ?? windshieldTintLevels[0]);

  return (
    <div className="mt-8 pt-8 border-t-2 border-neutral-200">
      <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Windshield Strip Shade</p>
      <p className="text-sm text-neutral-500 mb-4">
        The visor strip runs across the top of the windshield only — pick a shade to preview it.
      </p>

      <div className="relative flex w-full rounded-full border-2 border-neutral-300 bg-neutral-100 p-1">
        {windshieldTintLevels.map((l) => {
          const isActive = l.value === level.value;
          return (
            <button
              type="button"
              key={l.value}
              onClick={() => setLevel(l)}
              className="relative flex-1 py-2 sm:py-2.5 text-center"
            >
              {isActive && (
                <motion.span
                  layoutId="windshield-tab-highlight"
                  className="absolute inset-0 bg-neutral-200 rounded-full"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span
                className={`relative z-10 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {l.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative mt-6 aspect-[3054/955] w-full">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={level.value}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {level.windshieldImage ? (
              <Image
                src={level.windshieldImage}
                alt={`${level.label} windshield strip preview`}
                fill
                sizes="(max-width: 640px) 100vw, 1152px"
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center">
                <p className="text-sm text-neutral-500 text-center px-6">
                  Windshield strip preview at <span className="text-neutral-900 font-medium">{level.label}</span> coming soon.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
