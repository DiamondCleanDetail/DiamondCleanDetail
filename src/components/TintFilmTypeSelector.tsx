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
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-neutral-900">{f.name}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{f.code}</span>
                </div>
                <p className="text-sm text-neutral-500 mt-2">{f.tagline}</p>

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
