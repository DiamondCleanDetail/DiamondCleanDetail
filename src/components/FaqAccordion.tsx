"use client";

import { useState } from "react";

export default function FaqAccordion({
  items,
  light = false,
}: {
  items: { q: string; a: string }[];
  /** Set true when rendering on a light-themed page (e.g. window tinting). */
  light?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const border = light ? "border-neutral-300" : "border-border";
  const surface = light ? "bg-neutral-50" : "bg-surface";
  const heading = light ? "text-neutral-900" : "text-foreground";
  const muted = light ? "text-neutral-500" : "text-muted";

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className={`border-2 ${border} ${surface} rounded-xl overflow-hidden`}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
            >
              <span className={`font-medium text-sm sm:text-base ${heading}`}>{item.q}</span>
              <span
                className={`shrink-0 text-lg leading-none transition-transform duration-200 ${muted} ${open ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            {open && (
              <p className={`px-5 pb-4 text-sm leading-relaxed ${muted}`}>{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
