"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox, { type LightboxSlide } from "@/components/Lightbox";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { workItems, workMedia, type WorkItem, type WorkMedia } from "@/data/work";

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

/** One tile of a job's media.
 *
 * A clip shows its poster rather than the video: the grid would otherwise
 * pull down megabytes of footage nobody has asked to watch. The play badge is
 * what says it is a clip, and the video itself is only fetched when the
 * lightbox opens it. */
function MediaTile({
  media,
  alt,
  sizes,
  badge,
}: {
  media: WorkMedia;
  alt: string;
  sizes: string;
  badge?: "large" | "small";
}) {
  return (
    <>
      <Image
        src={media.kind === "video" ? media.poster : media.src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {media.kind === "video" && <PlayBadge size={badge ?? "large"} />}
    </>
  );
}

function PlayBadge({ size }: { size: "large" | "small" }) {
  const large = size === "large";
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/40 backdrop-blur-sm ${
        large ? "h-14 w-14" : "h-8 w-8"
      }`}
    >
      <svg viewBox="0 0 24 24" width={large ? 22 : 13} height={large ? 22 : 13} fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
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
  const media = workMedia(item);
  return (
    <figure className="card-lift bg-surface border border-border rounded-xl overflow-hidden">
      {media.length === 0 ? (
        <div className="relative aspect-square bg-surface-2 flex items-center justify-center text-xs text-muted px-4 text-center">
          Photo coming soon — {item.title}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onOpen(0)}
            aria-label={`View media from ${item.title}`}
            className="group relative block w-full aspect-square bg-surface-2 cursor-zoom-in overflow-hidden"
          >
            <MediaTile media={media[0]} alt={item.title} sizes="(max-width: 1024px) 50vw, 33vw" />
            <PhotoCountBadge count={media.length} />
          </button>

          {media.length > 1 && (
            <div
              className="grid gap-px bg-border"
              style={{ gridTemplateColumns: `repeat(${media.length - 1}, minmax(0, 1fr))` }}
            >
              {media.slice(1).map((m, j) => (
                <button
                  key={m.src}
                  type="button"
                  onClick={() => onOpen(j + 1)}
                  aria-label={`View ${m.kind === "video" ? "clip" : "photo"} ${j + 2} from ${item.title}`}
                  className="group relative aspect-[4/3] bg-surface-2 cursor-zoom-in overflow-hidden"
                >
                  <MediaTile
                    media={m}
                    alt={`${item.title} — ${m.kind === "video" ? "clip" : "photo"} ${j + 2}`}
                    sizes="(max-width: 1024px) 25vw, 17vw"
                    badge="small"
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
  const media = workMedia(item);
  const extras = media.slice(1, 5);
  const hidden = Math.max(0, media.length - 5);

  return (
    <figure className="card-lift bg-surface border border-border rounded-xl overflow-hidden sm:grid sm:grid-cols-[3fr_2fr]">
      {media.length === 0 ? (
        <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[280px] bg-surface-2 flex items-center justify-center text-xs text-muted px-4 text-center">
          Photo coming soon — {item.title}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onOpen(0)}
          aria-label={`View media from ${item.title}`}
          className="group relative block w-full aspect-[4/3] sm:aspect-auto sm:min-h-[280px] bg-surface-2 cursor-zoom-in overflow-hidden"
        >
          <MediaTile media={media[0]} alt={item.title} sizes="(max-width: 640px) 100vw, 55vw" />
          <PhotoCountBadge count={media.length} />
        </button>
      )}

      <div className="flex flex-col justify-between min-w-0">
        <Caption item={item} />

        {extras.length > 0 && (
          <div
            className="grid gap-px bg-border border-t border-border"
            style={{ gridTemplateColumns: `repeat(${extras.length}, minmax(0, 1fr))` }}
          >
            {extras.map((m, j) => (
              <button
                key={m.src}
                type="button"
                onClick={() => onOpen(j + 1)}
                aria-label={`View ${m.kind === "video" ? "clip" : "photo"} ${j + 2} from ${item.title}`}
                // Fixed height rather than an aspect ratio: with one extra
                // photo an aspect-ratio tile ballooned to fill the column,
                // making the strip's size vary wildly between cards.
                className="group relative h-20 sm:h-24 bg-surface-2 cursor-zoom-in overflow-hidden"
              >
                <MediaTile
                  media={m}
                  alt={`${item.title} — ${m.kind === "video" ? "clip" : "photo"} ${j + 2}`}
                  sizes="(max-width: 640px) 33vw, 15vw"
                  badge="small"
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

  function openJob(item: WorkItem, mediaIndex: number) {
    const media = workMedia(item);
    if (media.length === 0) return;
    setSlides(
      media.map((m) => ({
        src: m.src,
        caption: item.title,
        kind: m.kind,
        poster: m.kind === "video" ? m.poster : undefined,
      }))
    );
    setIndex(mediaIndex);
  }

  // Entries still awaiting confirmation of what the job actually was stay out
  // of the published grid rather than going live with a guessed title.
  const groups = groupByBrand(workItems.filter((w) => !w.draft));

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
