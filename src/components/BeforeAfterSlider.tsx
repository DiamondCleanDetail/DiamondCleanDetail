"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";

export default function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Uncoated",
  afterLabel = "Coated",
}: {
  before: string | null;
  after: string | null;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [pos, setPos] = useState(50); // percent, 0 = all "before", 100 = all "after"
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  if (!before || !after) {
    return (
      <div className="relative aspect-square w-full max-w-[380px] mx-auto rounded-xl border border-dashed border-border/60 flex items-center justify-center">
        <p className="text-sm text-muted text-center px-6">
          Drag-to-compare {beforeLabel.toLowerCase()} vs {afterLabel.toLowerCase()} photos coming soon.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-[380px] mx-auto rounded-xl overflow-hidden select-none cursor-ew-resize bg-surface-2"
      onMouseDown={(e) => {
        setDragging(true);
        updateFromClientX(e.clientX);
      }}
      onMouseMove={(e) => {
        if (dragging) updateFromClientX(e.clientX);
      }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchStart={(e) => {
        setDragging(true);
        updateFromClientX(e.touches[0].clientX);
      }}
      onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
      onTouchEnd={() => setDragging(false)}
    >
      {/* After (coated) — full base layer */}
      <Image src={after} alt={afterLabel} fill className="object-cover pointer-events-none" />
      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-black/60 text-white px-2 py-1 rounded pointer-events-none">
        {afterLabel}
      </span>

      {/* Before (uncoated) — same full-size layer, revealed via clip-path so
          it stays pixel-aligned with the "after" layer underneath. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image src={before} alt={beforeLabel} fill className="object-cover pointer-events-none" />
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-black/60 text-white px-2 py-1 rounded pointer-events-none">
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 w-0.5 bg-white pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M8 6L2 12L8 18" stroke="#0a0a0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 6L22 12L16 18" stroke="#0a0a0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
