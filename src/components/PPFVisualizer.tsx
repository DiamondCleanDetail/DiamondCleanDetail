"use client";

import { useState } from "react";

type Coverage = "partial-front" | "full-front" | "full-body";

const options: { value: Coverage; label: string }[] = [
  { value: "partial-front", label: "Partial Front" },
  { value: "full-front", label: "Full Front" },
  { value: "full-body", label: "Full Body" },
];

const panelsByCoverage: Record<Coverage, string[]> = {
  "partial-front": ["bumper", "mirror"],
  "full-front": ["bumper", "hood", "fenders", "mirror"],
  "full-body": ["bumper", "hood", "fenders", "mirror", "roof", "doors", "rear"],
};

const highlight = "#eef0f2";
const base = "#3a3d42";

export default function PPFVisualizer() {
  const [coverage, setCoverage] = useState<Coverage>("partial-front");
  const active = new Set(panelsByCoverage[coverage]);

  const fill = (panel: string) => (active.has(panel) ? highlight : base);
  const opacity = (panel: string) => (active.has(panel) ? 0.9 : 1);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="font-semibold mb-4">Preview Your Coverage</h3>

      <div className="bg-surface-2 rounded-lg p-6">
        <svg viewBox="0 0 400 160" className="w-full h-auto">
          {/* rear */}
          <path d="M300 60 Q350 62 375 100 L375 120 L320 120 L310 65 Z" fill={fill("rear")} opacity={opacity("rear")} stroke="#55585e" strokeWidth="1.5" />
          {/* roof */}
          <path d="M150 40 Q200 25 260 42 L250 55 L160 55 Z" fill={fill("roof")} opacity={opacity("roof")} stroke="#55585e" strokeWidth="1.5" />
          {/* doors */}
          <rect x="150" y="60" width="140" height="55" fill={fill("doors")} opacity={opacity("doors")} stroke="#55585e" strokeWidth="1.5" />
          {/* fenders */}
          <path d="M60 70 Q90 55 140 60 L140 115 L70 115 Z" fill={fill("fenders")} opacity={opacity("fenders")} stroke="#55585e" strokeWidth="1.5" />
          {/* hood */}
          <path d="M40 90 Q60 65 130 68 L130 100 L45 100 Z" fill={fill("hood")} opacity={opacity("hood")} stroke="#55585e" strokeWidth="1.5" />
          {/* bumper */}
          <path d="M20 100 Q22 115 35 120 L45 120 L45 95 Q30 95 20 100 Z" fill={fill("bumper")} opacity={opacity("bumper")} stroke="#55585e" strokeWidth="1.5" />
          {/* mirror */}
          <rect x="140" y="55" width="10" height="8" fill={fill("mirror")} opacity={opacity("mirror")} stroke="#55585e" strokeWidth="1" />
          {/* wheels */}
          <circle cx="100" cy="122" r="18" fill="#17181a" stroke="#55585e" strokeWidth="2" />
          <circle cx="320" cy="122" r="18" fill="#17181a" stroke="#55585e" strokeWidth="2" />
        </svg>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            type="button"
            key={opt.value}
            onClick={() => setCoverage(opt.value)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              coverage === opt.value
                ? "border-accent bg-accent/10"
                : "border-border bg-surface-2 text-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted mt-3">
        Highlighted panels show what&apos;s covered by the selected package.
      </p>
    </div>
  );
}
