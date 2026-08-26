"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export type LightboxSlide = {
  src: string;
  /** Shown under the image, e.g. "Before" or the job title. */
  caption?: string;
};

type Props = {
  slides: LightboxSlide[];
  /** Index of the open slide, or null when the lightbox is closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function Lightbox({ slides, index, onClose, onIndexChange }: Props) {
  const open = index !== null;

  // Portals need the DOM, which doesn't exist during SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const go = useCallback(
    (delta: number) => {
      if (index === null || slides.length === 0) return;
      onIndexChange((index + delta + slides.length) % slides.length);
    },
    [index, slides.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKeyDown);

    // Keep the page behind the overlay from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, go]);

  if (!mounted) return null;

  const slide = index === null ? null : slides[index];

  return createPortal(
    <AnimatePresence>
      {slide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label={slide.caption ?? "Photo"}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 rounded-full border border-border bg-surface/80 text-foreground text-xl leading-none hover:bg-surface-2 transition-colors"
          >
            &times;
          </button>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-6 h-11 w-11 rounded-full border border-border bg-surface/80 text-foreground hover:bg-surface-2 transition-colors"
              >
                &#8249;
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next photo"
                className="absolute right-2 sm:right-6 h-11 w-11 rounded-full border border-border bg-surface/80 text-foreground hover:bg-surface-2 transition-colors"
              >
                &#8250;
              </button>
            </>
          )}

          <motion.figure
            key={slide.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] as const }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center gap-3 max-h-full"
          >
            {/* A definite box, rather than an auto-sized <img>: with `w-auto`
                the layout width collapses before the browser picks from the
                srcset, so it lands on the smallest candidate. */}
            <div className="relative w-[88vw] h-[72vh] sm:w-[78vw] sm:h-[78vh]">
              <Image
                src={slide.src}
                alt={slide.caption ?? "Detailing photo"}
                fill
                sizes="90vw"
                className="rounded-lg object-contain"
                priority
              />
            </div>
            {(slide.caption || slides.length > 1) && (
              <figcaption className="text-xs sm:text-sm text-muted text-center">
                {slide.caption}
                {slides.length > 1 && (
                  <span className="ml-2 tabular-nums opacity-70">
                    {(index ?? 0) + 1} / {slides.length}
                  </span>
                )}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
