"use client";

import Image from "next/image";
import { useState } from "react";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import Lightbox, { type LightboxSlide } from "@/components/Lightbox";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { beforeAfterHomePairs } from "@/data/beforeAfterHome";

function Tile({
  src,
  label,
  aspect,
  onOpen,
}: {
  src: string | null;
  label: "Before" | "After";
  aspect: string;
  onOpen?: () => void;
}) {
  if (!src) {
    return (
      <div className={`${aspect} bg-surface-2 flex items-center justify-center text-xs text-muted`}>
        {label} — coming soon
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${label.toLowerCase()} photo larger`}
      className={`group relative ${aspect} bg-surface-2 cursor-zoom-in overflow-hidden`}
    >
      <Image
        src={src}
        alt={label}
        fill
        sizes="(max-width: 640px) 40vw, 20vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="absolute top-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white/90">
        {label}
      </span>
    </button>
  );
}

export default function BeforeAfterGallery() {
  const [slides, setSlides] = useState<LightboxSlide[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  function openPair(pairIndex: number, startAt: 0 | 1) {
    const pair = beforeAfterHomePairs[pairIndex];
    if (!pair.before || !pair.after) return;
    setSlides([
      { src: pair.before, caption: `${pair.label} — Before` },
      { src: pair.after, caption: `${pair.label} — After` },
    ]);
    setIndex(startAt);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <FadeIn>
        <SectionHeading
          align="left"
          eyebrow="The Diamond Standard"
          title="Before &"
          accent="After"
          className="mb-8 sm:mb-10"
        />
      </FadeIn>
      {/* Mobile: swipeable row with shorter tiles so the pairs don't take
          several screens of scroll. sm+: normal grid. */}
      <div className="sm:hidden -mx-6 px-6 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {beforeAfterHomePairs.map((pair, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[80%] bg-surface border border-border rounded-xl overflow-hidden"
          >
            <div className="grid grid-cols-2">
              <Tile src={pair.before} label="Before" aspect="aspect-[4/3]" onOpen={() => openPair(i, 0)} />
              <Tile src={pair.after} label="After" aspect="aspect-[4/3]" onOpen={() => openPair(i, 1)} />
            </div>
            <p className="text-sm font-medium px-4 py-3">{pair.label}</p>
          </div>
        ))}
      </div>
      <p className="sm:hidden text-xs text-muted mt-3 text-center">Swipe for more &rarr;</p>

      <StaggerGrid className="hidden sm:grid sm:grid-cols-3 gap-5">
        {beforeAfterHomePairs.map((pair, i) => (
          <StaggerItem key={i}>
            <div className="card-lift bg-surface border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                <Tile src={pair.before} label="Before" aspect="aspect-square" onOpen={() => openPair(i, 0)} />
                <Tile src={pair.after} label="After" aspect="aspect-square" onOpen={() => openPair(i, 1)} />
              </div>
              <p className="text-sm font-medium px-4 py-3">{pair.label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>

      <Lightbox
        slides={slides}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </section>
  );
}
