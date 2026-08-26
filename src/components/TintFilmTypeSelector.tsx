"use client";

import { motion } from "framer-motion";
import { filmTypes, type FilmType } from "@/data/filmTypes";

export default function TintFilmTypeSelector({
  filmType,
  setFilmType,
}: {
  filmType: FilmType;
  setFilmType: (f: FilmType) => void;
}) {
  return (
    <div className="w-full py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center mb-10">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500">Step 3</span>
        <h3 className="font-semibold text-lg sm:text-xl text-neutral-900 mt-1">Choose Your Film Type</h3>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2">
          Every shade above is available in each of these three films.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="relative flex w-full rounded-full border-2 border-neutral-300 bg-neutral-100 p-1">
          {filmTypes.map((f) => {
            const isActive = filmType.slug === f.slug;
            return (
              <button
                type="button"
                key={f.slug}
                onClick={() => setFilmType(f)}
                className="relative flex-1 py-2.5 sm:py-3 text-center"
              >
                {isActive && (
                  <motion.span
                    layoutId="film-type-highlight"
                    className="absolute inset-0 bg-neutral-200 rounded-full"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {f.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-14 grid sm:grid-cols-3 gap-4 sm:gap-5">
          {filmTypes.map((f) => {
            const isActive = filmType.slug === f.slug;
            return (
              <button
                type="button"
                key={f.slug}
                onClick={() => setFilmType(f)}
                className={`text-left rounded-xl border p-5 transition-colors ${
                  isActive ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-neutral-900">{f.name}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{f.code}</span>
                </div>
                <p className="text-sm text-neutral-500 mt-2">{f.tagline}</p>
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">{f.description}</p>
                <p className="text-xs font-medium text-neutral-400 mt-4 uppercase tracking-widest">{f.priceNote}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
