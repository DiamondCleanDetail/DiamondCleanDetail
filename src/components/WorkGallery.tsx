"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox, { type LightboxSlide } from "@/components/Lightbox";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { workItems, type WorkItem } from "@/data/work";

/** Jobs grouped by marque, preserving the order they appear in the data. */
function groupByBrand(items: WorkItem[]): { brand: string; items: WorkItem[] }[] {
  const groups: { brand: string; items: WorkItem[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.brand === item.brand) last.items.push(item);
    else groups.push({ brand: item.brand, items: [item] });
  }
  return groups;
}

function Caption({ item }: { item: WorkItem }) {
  return (
    <figcaption className="p-3 sm:p-4">
      <p className="text-xs sm:text-sm font-medium">{item.title}</p>
      {item.testimonial && (
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs sm:text-sm text-muted italic">
            &ldquo;{item.testimonial.quote}&rdquo;
          </p>
          <p className="text-[10px] sm:text-xs text-muted mt-2">— {item.testimonial.name}</p>
        </div>
      )}
    </figcaption>
  );
}

function PhotoCountBadge({ count }: { count: number }) {
  if (count < 2) return null;
  return (
    <span className="absolute bottom-2 right-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-medium text-white/90 tabular-nums">
      {count} photos
    </span>
  );
}

/** The standard tall card used when a marque has several jobs to stack. */
function StackedCard({ item, onOpen }: { item: WorkItem; onOpen: (i: number) => void }) {
  return (
    <figure className="card-lift bg-surface border border-border rounded-xl overflow-hidden">
      {item.images.length === 0 ? (
        <div className="relative aspect-square bg-surface-2 flex items-center justify-center text-xs text-muted px-4 text-center">
          Photo coming soon — {item.title}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onOpen(0)}
            aria-label={`View photos from ${item.title}`}
            className="group relative block w-full aspect-square bg-surface-2 cursor-zoom-in overflow-hidden"
          >
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <PhotoCountBadge count={item.images.length} />
          </button>

          {item.images.length > 1 && (
            <div
              className="grid gap-px bg-border"
              style={{ gridTemplateColumns: `repeat(${item.images.length - 1}, minmax(0, 1fr))` }}
            >
              {item.images.slice(1).map((src, j) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => onOpen(j + 1)}
                  aria-label={`View photo ${j + 2} from ${item.title}`}
                  className="group relative aspect-[4/3] bg-surface-2 cursor-zoom-in overflow-hidden"
                >
                  <Image
                    src={src}
                    alt={`${item.title} — photo ${j + 2}`}
                    fill
                    sizes="(max-width: 1024px) 25vw, 17vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <Caption item={item} />
    </figure>
  );
}

/** Wide side-by-side card for a marque with only one job. A lone tall card
 * left two thirds of the row empty; this fills the width and, being
 * landscape rather than square, is actually shorter than the stacked card. */
function FeatureCard({ item, onOpen }: { item: WorkItem; onOpen: (i: number) => void }) {
  // Capped at four so the strip always fills its row exactly — a fixed
  // column count left ragged empty cells whenever the count wasn't a
  // multiple of it. Any remainder is surfaced on the last tile.
  const extras = item.images.slice(1, 5);
  const hidden = Math.max(0, item.images.length - 5);

  return (
    <figure className="card-lift bg-surface border border-border rounded-xl overflow-hidden sm:grid sm:grid-cols-[3fr_2fr]">
      {item.images.length === 0 ? (
        <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[280px] bg-surface-2 flex items-center justify-center text-xs text-muted px-4 text-center">
          Photo coming soon — {item.title}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onOpen(0)}
          aria-label={`View photos from ${item.title}`}
          className="group relative block w-full aspect-[4/3] sm:aspect-auto sm:min-h-[280px] bg-surface-2 cursor-zoom-in overflow-hidden"
        >
          <Image
            src={item.images[0]}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 55vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <PhotoCountBadge count={item.images.length} />
        </button>
      )}

      <div className="flex flex-col justify-between min-w-0">
        <Caption item={item} />

        {extras.length > 0 && (
          <div
            className="grid gap-px bg-border border-t border-border"
            style={{ gridTemplateColumns: `repeat(${extras.length}, minmax(0, 1fr))` }}
          >
            {extras.map((src, j) => (
              <button
                key={src}
                type="button"
                onClick={() => onOpen(j + 1)}
                aria-label={`View photo ${j + 2} from ${item.title}`}
                // Fixed height rather than an aspect ratio: with one extra
                // photo an aspect-ratio tile ballooned to fill the column,
                // making the strip's size vary wildly between cards.
                className="group relative h-20 sm:h-24 bg-surface-2 cursor-zoom-in overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`${item.title} — photo ${j + 2}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 15vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* If the job has more shots than fit here, the last tile says so. */}
                {j === extras.length - 1 && hidden > 0 && (
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-medium text-white/90">
                    +{hidden}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}

export default function WorkGallery() {
  const [slides, setSlides] = useState<LightboxSlide[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  function openJob(item: WorkItem, photoIndex: number) {
    if (item.images.length === 0) return;
    setSlides(item.images.map((src) => ({ src, caption: item.title })));
    setIndex(photoIndex);
  }

  const groups = groupByBrand(workItems);

  return (
    <>
      {/* One block per marque. The divider is an ordinary full-width element
          here rather than a `column-span: all` inside a column item, which
          browsers fragment inconsistently and which overlapped the card
          above it. */}
      <div className="flex flex-col gap-8 sm:gap-12">
        {groups.map((group) => {
          const solo = group.items.length === 1;
          return (
            <section key={group.brand}>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
                <h2 className="text-[10px] sm:text-xs uppercase tracking-widest text-muted shrink-0">
                  {group.brand}
                </h2>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
              </div>

              {solo ? (
                <StaggerGrid>
                  <StaggerItem>
                    <FeatureCard
                      item={group.items[0]}
                      onOpen={(i) => openJob(group.items[0], i)}
                    />
                  </StaggerItem>
                </StaggerGrid>
              ) : (
                <StaggerGrid className="columns-2 lg:columns-3 gap-3 sm:gap-5">
                  {group.items.map((item) => (
                    <StaggerItem key={item.slug} className="mb-3 sm:mb-5 break-inside-avoid">
                      <StackedCard item={item} onOpen={(i) => openJob(item, i)} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              )}
            </section>
          );
        })}
      </div>

      <Lightbox
        slides={slides}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </>
  );
}
