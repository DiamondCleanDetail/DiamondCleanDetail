"use client";

import { motion, AnimatePresence } from "framer-motion";
import { filmTypes, type FilmType } from "@/data/filmTypes";
import SegmentedTabs from "@/components/SegmentedTabs";

export default function TintFilmTypeSelector({
  filmType,
  setFilmType,
}: {
  filmType: FilmType;
  setFilmType: (f: FilmType) => void;
}) {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-6">
        <SegmentedTabs
          items={filmTypes.map((f) => ({ value: f.slug, label: f.name }))}
          value={filmType.slug}
          onChange={(slug) => setFilmType(filmTypes.find((f) => f.slug === slug) ?? filmType)}
          layoutId="film-type-highlight"
          className="w-full"
        />

        <div className="mt-10 sm:mt-14 grid sm:grid-cols-3 gap-4 sm:gap-5 items-start">
          {filmTypes.map((f) => {
            const isActive = filmType.slug === f.slug;
            return (
              <button
                type="button"
                key={f.slug}
                onClick={() => setFilmType(f)}
                aria-expanded={isActive}
                className={`text-left rounded-xl border-2 p-5 transition-colors ${
                  isActive ? "border-neutral-900 bg-neutral-50" : "border-neutral-300 bg-white hover:border-neutral-400"
                }`}
              >
                {/* The ladder goes above the name so it reads before the
                    product does — someone who has never bought tint can see
                    which film is the step up without parsing "carbon-ceramic"
                    against "dual-ceramic". The pips carry the ranking for
                    anyone skimming past the words entirely.

                    "Most Popular" sits on the middle tier next to "Better",
                    which is deliberate and shouldn't read as a contradiction:
                    the top tier is the best film, this is the one most people
                    actually buy. Keeping them adjacent, in one row and in the
                    same visual family, says that more clearly than putting
                    them at opposite ends of the card would. It wraps rather
                    than squeezing, so a narrow card can't crush the row. */}
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
                {/* The code stays on the name's row, as it was: in the chip row
                    it pushed the pair onto two lines in the narrow three-column
                    band, which dropped the featured card's name below its
                    neighbours' for no benefit. */}
                <div className="flex items-center justify-between gap-2 mt-3">
                  <h4 className="font-semibold text-neutral-900">{f.name}</h4>
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    {f.code}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mt-1">{f.tagline}</p>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] as const }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-neutral-500 mt-3 leading-relaxed">{f.description}</p>
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

                <p className="text-xs font-medium text-neutral-400 mt-4 uppercase tracking-widest">
                  {isActive ? f.priceNote : "Tap to learn more"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
