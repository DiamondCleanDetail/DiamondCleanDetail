"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { swipeDirection } from "@/lib/swipe";

export type LightboxSlide = {
  src: string;
  /** Shown under the image, e.g. "Before" or the job title. */
  caption?: string;
  /** Video slides play inline here rather than opening anything. */
  kind?: "image" | "video";
  /** First frame, so a video slide has something to show before it decodes. */
  poster?: string;
};

type Props = {
  slides: LightboxSlide[];
  /** Index of the open slide, or null when the lightbox is closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/** 48px hit area, above the photo, legible over a photo of any brightness. */
const controlClass =
  "z-20 grid h-12 w-12 place-items-center rounded-full bg-black/55 text-white leading-none " +
  "ring-1 ring-white/30 backdrop-blur-md shadow-lg transition-colors hover:bg-black/75";

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
  // Unmount the moment it closes, rather than leaving it to AnimatePresence.
  //
  // AnimatePresence in framer-motion 13.1.1 runs the exit animation but never
  // removes the node — verified in a production build, not just dev. For a
  // fixed inset-0 overlay at z-100 that is not cosmetic: the closed lightbox
  // stayed in the DOM at opacity 0 with pointer-events auto, so it sat over
  // the page swallowing every click until the next navigation.
  //
  // Closing is instant now, which costs a 180ms fade-out and buys a page that
  // still works afterwards. The fade-in is unaffected. The same library
  // behaviour affects the other AnimatePresence call sites, which is its own
  // piece of work.
  if (!slide) return null;
  const canPage = slides.length > 1;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      role="dialog"
      aria-modal="true"
      aria-label={slide.caption ?? "Photo"}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
    >
        {/* The controls sit above the image and carry their own scrim.
            They used to do neither: absolutely positioned with no z-index,
            they were painted before the figure that follows them in the DOM
            (which framer-motion gives a transform, and so its own stacking
            context), leaving them behind the photo and untappable on any
            screen narrow enough for the image to reach the edges. And a
            bare glyph over an unknown photo is only legible by luck — the
            blurred dark disc and light ring give it a floor no matter what
            is behind it. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`${controlClass} absolute top-3 right-3 sm:top-6 sm:right-6 text-2xl`}
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
              className={`${controlClass} absolute left-3 sm:left-6 text-3xl`}
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
              className={`${controlClass} absolute right-3 sm:right-6 text-3xl`}
            >
              &#8250;
            </button>
          </>
        )}

        {/* Swiping is what anyone opening this on a phone reaches for
            first. drag="x" also sets touch-action: pan-y, so a vertical
            gesture is still the page's rather than being swallowed here. */}
        <motion.figure
          key={slide.src}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] as const }}
          onClick={(e) => e.stopPropagation()}
          drag={canPage ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            const direction = swipeDirection(info.offset.x, info.velocity.x);
            if (direction !== 0) go(direction);
          }}
          className={`relative z-0 flex flex-col items-center gap-3 max-h-full select-none ${
            canPage ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          {/* A definite box, rather than an auto-sized <img>: with `w-auto`
              the layout width collapses before the browser picks from the
              srcset, so it lands on the smallest candidate. */}
          <div className="relative w-[88vw] h-[72vh] sm:w-[78vw] sm:h-[78vh]">
            {slide.kind === "video" ? (
              // Muted and looping so it can start by itself — a clip that made
              // noise the moment a gallery opened would be hostile — with
              // controls so the sound is there if it is wanted.
              <video
                key={slide.src}
                src={slide.src}
                poster={slide.poster}
                className="h-full w-full rounded-lg object-contain"
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            ) : (
              <Image
                src={slide.src}
                alt={slide.caption ?? "Detailing photo"}
                fill
                sizes="90vw"
                className="rounded-lg object-contain"
                priority
              />
            )}
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
    </motion.div>,
    document.body,
  );
}
