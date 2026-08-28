"use client";

import { motion } from "framer-motion";

/** One option in the selector. `value` must be unique within the group. */
export type SegmentedItem = { value: string; label: string };

/** Light sections (the window-tinting configurator) vs. the dark PPF block. */
type Tone = "light" | "dark";

const toneStyles: Record<
  Tone,
  { container: string; thumb: string; active: string; inactive: string }
> = {
  light: {
    container: "border-2 border-neutral-300 bg-neutral-100",
    thumb: "bg-neutral-200",
    active: "text-neutral-900",
    inactive: "text-neutral-400 hover:text-neutral-700",
  },
  dark: {
    container: "border border-border bg-surface shadow-[0_15px_40px_-20px_rgba(0,0,0,0.6)]",
    thumb: "chrome-chip",
    active: "text-[color:var(--accent-foreground)]",
    inactive: "text-muted hover:text-foreground",
  },
};

/**
 * The segmented pill selector used by every configurator on the site (tint
 * shade, tint coverage, film type, PPF tier).
 *
 * Every one of these used to be a hand-rolled copy of the same markup: a
 * `flex` row of `flex-1` buttons with no horizontal padding. That works only
 * while every label is short. As soon as one label is long enough to wrap
 * ("Full Protection", "Diamond Ceramic RX1", "Front Two Windows") the row
 * breaks in three ways at phone widths:
 *
 *   1. The wrapped label grows past its `flex-1` share and pushes its text
 *      into the capsule's rounded end, so it reads as overflowing the pill.
 *   2. Buttons had no horizontal padding, so a wrapped label in one cell ran
 *      straight into its neighbour with no gutter between them.
 *   3. One label on two lines next to four on one line left them visibly
 *      off-centre from each other.
 *
 * So the layout is responsive instead: a two-column grid of pills on phones
 * (`mobileLayout="grid"`, the safe default — every label gets a full half of
 * the screen and simply cannot overflow), switching to the familiar single
 * capsule row from `md` up, where there is room for the longest label on one
 * line. Selectors whose labels are all short — the tint shades, "Clear"
 * through "5%" — pass `mobileLayout="row"` to keep the capsule at every width.
 *
 * Vertical alignment is handled the same way at both layouts: each button is
 * a centred flex box, and both grid cells and flex children stretch to the
 * tallest in their row, so a label that does wrap stays centred against its
 * one-line neighbours rather than sitting high.
 */
export default function SegmentedTabs({
  items,
  value,
  onChange,
  /** Must be unique per selector on a page — it drives the sliding thumb. */
  layoutId,
  tone = "light",
  mobileLayout = "grid",
  className = "",
}: {
  items: SegmentedItem[];
  value: string;
  onChange: (value: string) => void;
  layoutId: string;
  tone?: Tone;
  mobileLayout?: "grid" | "row";
  className?: string;
}) {
  const styles = toneStyles[tone];
  const isGrid = mobileLayout === "grid";
  // An odd item count leaves the last pill alone on its row; span it across
  // both columns so the grid ends on a flush edge instead of a gap.
  const spanLastColumn = isGrid && items.length % 2 === 1;

  return (
    <div
      className={`relative p-1 ${styles.container} ${
        isGrid
          ? "grid grid-cols-2 gap-1 rounded-2xl md:flex md:gap-0 md:rounded-full"
          : "flex rounded-full"
      } ${className}`}
    >
      {items.map((item, i) => {
        const isActive = item.value === value;
        const isLast = i === items.length - 1;
        return (
          <button
            type="button"
            key={item.value}
            onClick={() => onChange(item.value)}
            aria-pressed={isActive}
            className={`relative flex items-center justify-center px-2 py-2.5 text-center sm:py-3 ${
              isGrid ? "min-w-0 md:flex-1 md:px-1" : "min-w-0 flex-1"
            } ${spanLastColumn && isLast ? "col-span-2 md:col-span-1" : ""}`}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className={`absolute inset-0 rounded-full ${styles.thumb}`}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span
              className={`relative z-10 text-[10px] font-bold uppercase leading-tight tracking-widest text-balance transition-colors sm:text-xs ${
                isActive ? styles.active : styles.inactive
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
