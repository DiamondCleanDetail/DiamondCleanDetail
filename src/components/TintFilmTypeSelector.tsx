"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, type KeyboardEvent } from "react";
import { filmTypes, type FilmType } from "@/data/filmTypes";

/**
 * Choosing a film.
 *
 * There used to be a segmented pill selector above these cards, which meant
 * two controls for one choice — and the cards already selected, so the pill
 * was only ever a second way to do the same thing. The cards are the control
 * now and the pill is gone.
 *
 * One tap does both jobs: it selects the film and opens that card's detail,
 * closing whichever was open. Those two never fight because they are the same
 * state — the open card *is* the chosen one — so there is nothing to
 * disambiguate and no second control to hunt for. Tap-to-select then
 * tap-again-to-expand would have made the common case (pick one, read about
 * it) take two taps instead of one.
 *
 * Radio semantics rather than a row of buttons: this is one choice out of
 * three and a screen reader should say so. Arrow keys move between films as
 * in any radio group, and the roving tabindex keeps the group a single tab
 * stop rather than three.
 */
export default function TintFilmTypeSelector({
  filmType,
  setFilmType,
}: {
  filmType: FilmType;
  setFilmType: (f: FilmType) => void;
}) {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + filmTypes.length) % filmTypes.length;
    setFilmType(filmTypes[next]);
    cardRefs.current[next]?.focus();
  }

  return (
    <div className="w-full @container">
      <div className="mx-auto max-w-6xl px-6">
        {/* Three across only when the container is genuinely wide enough.
            A viewport breakpoint was the wrong measure: this also renders in
            the booking wizard, which is 720px inside a 1400px window, so
            `sm:` was true while each card had barely 200px — enough to turn
            the selected card's detail into a narrow ribbon of text. */}
        <div
          role="radiogroup"
          aria-label="Film type"
          className="grid @3xl:grid-cols-3 gap-4 sm:gap-5 items-start"
        >
          {filmTypes.map((f, i) => {
            const isSelected = filmType.slug === f.slug;
            return (
              <button
                type="button"
                key={f.slug}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setFilmType(f)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`relative text-left rounded-xl border-2 p-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900"
                    : "border-neutral-300 bg-white hover:border-neutral-400"
                }`}
              >
                {/* The ladder goes above the name so it reads before the
                    product does — someone who has never bought tint can see
                    which film is the step up without parsing "carbon-ceramic"
                    against "dual-ceramic". The pips carry the ranking for
                    anyone skimming past the words entirely.

                    "Popular" sits on the middle tier next to "Better", which
                    is deliberate and shouldn't read as a contradiction: the
                    top tier is the best film, this is the one most people
                    actually buy. */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                    <span aria-hidden className="flex items-center gap-0.5">
                      {[1, 2, 3].map((pip) => (
                        <span
                          key={pip}
                          className={`h-1 w-1 rounded-full ${
                            pip <= f.tierRank ? "bg-neutral-800" : "bg-neutral-300"
                          }`}
                        />
                      ))}
                    </span>
                    {f.tier}
                  </span>
                  {f.featured && (
                    <span className="rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Popular
                    </span>
                  )}
                </div>

                {/* The code stays on the name's row: in the chip row it pushed
                    the pair onto two lines in the narrow three-column band,
                    dropping the featured card's name below its neighbours'. */}
                <div className="flex items-center justify-between gap-2 mt-3">
                  <h4 className="font-semibold text-neutral-900">{f.name}</h4>
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    {f.code}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mt-1">{f.tagline}</p>

                <AnimatePresence initial={false}>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] as const }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                        {f.description}
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {f.benefits.map((b) => (
                          <li key={b} className="text-xs text-neutral-600 flex gap-2">
                            <span className="text-neutral-900">&#10003;</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* The state line carries the tick rather than a corner badge.
                    A badge in the top-right meant reserving padding across the
                    whole card, which pushed the tier and Popular chips onto a
                    second line in the three-column band and dropped that
                    card's name below its neighbours'. Down here it competes
                    with nothing, and the heavy lifting is done by the ring and
                    the filled border anyway. */}
                <p
                  className={`flex items-center gap-1.5 text-xs font-medium mt-4 uppercase tracking-widest ${
                    isSelected ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {isSelected && (
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      width="13"
                      height="13"
                      className="shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                  {isSelected ? `Selected · ${f.priceNote}` : "Tap to choose"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
