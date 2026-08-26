"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type Coverage = "partial-front" | "full-front" | "full-body";

const options: { value: Coverage; label: string; image: string }[] = [
  { value: "partial-front", label: "Partial Front", image: "/services/ppf-visualizer-bumper.png" },
  { value: "full-front", label: "Full Front", image: "/services/ppf-visualizer-front.png" },
  { value: "full-body", label: "Full Body", image: "/services/ppf-visualizer-full.png" },
];

export default function PPFVisualizer() {
  const [coverage, setCoverage] = useState<Coverage>("partial-front");
  const active = options.find((o) => o.value === coverage)!;

  return (
    <div className="w-full bg-gradient-to-b from-surface-2/60 via-surface-2/30 to-transparent py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center mb-8">
        <h3 className="font-semibold text-lg sm:text-xl">Preview Your Coverage</h3>
        <p className="text-xs sm:text-sm text-muted mt-2">
          Highlighted panels show what&apos;s covered by the selected package.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="relative aspect-[1133/535] w-full">
          <div className="absolute inset-x-[10%] inset-y-[8%] bg-[#1a63ff]/25 blur-[80px] rounded-full" />
          <AnimatePresence>
            <motion.div
              key={active.value}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const }}
              className="absolute inset-0 drop-shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
            >
              <Image
                src={active.image}
                alt={`${active.label} PPF coverage`}
                fill
                priority
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 max-w-md mx-auto">
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setCoverage(opt.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)] ${
                coverage === opt.value
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface-2 text-muted hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
