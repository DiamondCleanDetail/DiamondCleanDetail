"use client";

import { useState } from "react";

type Coverage = "partial-front" | "full-front" | "full-body";

const options: { value: Coverage; label: string }[] = [
  { value: "partial-front", label: "Partial Front" },
  { value: "full-front", label: "Full Front" },
  { value: "full-body", label: "Full Body" },
];

export default function PPFVisualizer() {
  const [coverage, setCoverage] = useState<Coverage>("partial-front");

  return (
    <div className="w-full bg-gradient-to-b from-surface-2/60 via-surface-2/30 to-transparent py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center mb-8">
        <h3 className="font-semibold text-lg sm:text-xl">Preview Your Coverage</h3>
        <p className="text-xs sm:text-sm text-muted mt-2">
          Highlighted panels will show what&apos;s covered by the selected package.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="aspect-[21/9] rounded-xl border border-dashed border-border/60 flex items-center justify-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          <p className="text-sm text-muted">Coverage diagram coming soon</p>
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
