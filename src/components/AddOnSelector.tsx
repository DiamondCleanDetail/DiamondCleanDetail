"use client";

import Image from "next/image";
import { formatPrice, type AddOn } from "@/data/catalog";

/** Grid of optional extras. In `readOnly` mode it's a display-only menu for
 * the service page; otherwise each tile toggles, for the checkout step.
 * Add-ons already covered by the chosen package render as "Included" and
 * can't be selected, so nobody pays twice for the same panel. */
export default function AddOnSelector({
  addOns,
  selected = [],
  onToggle,
  packageSlug,
  readOnly = false,
}: {
  addOns: AddOn[];
  selected?: string[];
  onToggle?: (slug: string) => void;
  /** Currently chosen package, used to grey out already-covered add-ons. */
  packageSlug?: string;
  readOnly?: boolean;
}) {
  if (addOns.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {addOns.map((a) => {
        const included = Boolean(packageSlug && a.includedIn?.includes(packageSlug));
        const isSelected = !included && selected.includes(a.slug);
        const interactive = !readOnly && !included;

        const inner = (
          <>
            <div className="relative aspect-[4/3] bg-surface-2">
              {a.image ? (
                <Image
                  src={a.image}
                  alt={a.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[11px] text-muted text-center px-3">Photo coming soon</p>
                </div>
              )}
              {interactive && (
                <span
                  className={`absolute top-2 right-2 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                    isSelected
                      ? "bg-accent border-accent text-accent-foreground"
                      : "bg-background/80 backdrop-blur-sm border-border"
                  }`}
                >
                  {isSelected && "✓"}
                </span>
              )}
              {included && (
                <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-widest bg-background/85 backdrop-blur-sm border border-border rounded-full px-2 py-1 text-muted">
                  Included
                </span>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-sm">{a.name}</h4>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">{a.description}</p>
              <p className={`mt-3 font-bold ${included ? "text-muted" : "chrome-text"}`}>
                {included ? "Included in this tier" : `+${formatPrice(a.price)}`}
              </p>
            </div>
          </>
        );

        const base = "text-left h-full rounded-xl overflow-hidden border transition-colors";

        if (!interactive) {
          return (
            <div
              key={a.slug}
              className={`${base} bg-surface border-border ${included ? "opacity-70" : ""}`}
            >
              {inner}
            </div>
          );
        }

        return (
          <button
            type="button"
            key={a.slug}
            onClick={() => onToggle?.(a.slug)}
            aria-pressed={isSelected}
            className={`${base} ${
              isSelected ? "border-accent bg-accent/10" : "bg-surface border-border hover:border-muted"
            }`}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}
