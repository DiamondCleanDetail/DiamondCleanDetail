"use client";

import Image from "next/image";

export default function ServiceGallery({
  images,
  light = false,
}: {
  images?: { src: string; caption: string }[];
  /** Set true when rendering on a light-themed page (e.g. window tinting). */
  light?: boolean;
}) {
  if (!images || images.length === 0) {
    return (
      <div
        className={`rounded-xl border-2 border-dashed py-10 text-center ${
          light ? "border-neutral-300" : "border-border/60"
        }`}
      >
        <p className={`text-sm ${light ? "text-neutral-500" : "text-muted"}`}>
          Photos from past jobs coming soon.
        </p>
      </div>
    );
  }

  return (
    <div
      // scroll-pl-6/-pr-6 for the same reason as the home carousels: snapping
      // aligns to the scrollport edge and would otherwise cancel the inset.
      className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-6 px-6 scroll-pl-6 scroll-pr-6 sm:mx-0 sm:px-0 sm:scroll-pl-0 sm:scroll-pr-0 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {images.map((img, i) => (
        <div
          key={i}
          className={`relative shrink-0 w-[200px] sm:w-[260px] aspect-[4/3] rounded-xl overflow-hidden snap-start ${
            light ? "bg-neutral-100" : "bg-surface-2"
          }`}
        >
          <Image
            src={img.src}
            alt={img.caption}
            fill
            sizes="(max-width: 640px) 200px, 260px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
          <p className="absolute bottom-2.5 left-3 right-3 text-xs sm:text-sm font-medium text-white leading-snug">
            {img.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
