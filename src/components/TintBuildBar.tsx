"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * The running total, pinned to the bottom while you configure.
 *
 * The configurator is four steps and the price only appears at the end of
 * them, so every change you make up top is a change to a number you cannot
 * see. This carries it with you.
 *
 * It stands down at both ends: before the configurator (there is nothing to
 * total yet) and once the summary card is on screen (it would be the same
 * figure twice, one covering the other).
 */
export default function TintBuildBar({
  startId,
  summaryId,
  headline,
  sub,
  price,
  priceLabel,
  href,
  /** Clear is the comparison view, not a product — there is nothing to book,
   * so the bar stays down rather than offering a price for it. */
  disabled = false,
}: {
  startId: string;
  summaryId: string;
  headline: string;
  sub: string;
  price: number;
  priceLabel: string;
  href: string;
  disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (disabled) {
      setVisible(false);
      return;
    }
    function update() {
      const start = document.getElementById(startId);
      const summary = document.getElementById(summaryId);
      if (!start || !summary) return;
      // Up once the first step is genuinely underway rather than merely
      // peeking into view, and down as soon as the summary card appears.
      const started = start.getBoundingClientRect().top < window.innerHeight * 0.4;
      const summaryReached = summary.getBoundingClientRect().top < window.innerHeight - 80;
      setVisible(started && !summaryReached);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [startId, summaryId, disabled]);

  return (
    <div
      // Kept mounted and moved out of the way rather than unmounted, so it
      // slides rather than blinking. aria-hidden and inert while down, or the
      // Book link stays tabbable from behind the page.
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-white/10 bg-neutral-950/95 backdrop-blur-md shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.7)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-5">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-white truncate">{headline}</p>
            {/* The film and vehicle line is the first thing to go when space
                is tight — the shade and coverage are what people are
                actually changing. */}
            <p className="hidden sm:block text-xs text-white/55 truncate">{sub}</p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 leading-none">
              {priceLabel}
            </p>
            <p className="chrome-text text-xl sm:text-2xl font-black leading-none mt-1 tabular-nums">
              ${price}
            </p>
          </div>

          <Link
            href={href}
            className="chrome-btn shrink-0 px-4 sm:px-6 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap"
          >
            Book <span className="hidden sm:inline">This </span>&rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
