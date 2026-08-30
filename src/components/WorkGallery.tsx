"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox, { type LightboxSlide } from "@/components/Lightbox";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { workItems, workMedia, brandAnchor, type WorkItem, type WorkMedia } from "@/data/work";

/**
 * Every job in one list, with each marque's jobs together.
 *
 * The old version only merged runs of the same brand that happened to be
 * adjacent in the data, so adding a BMW at the end of the file produced a
 * second "BMW" heading further down the page — three of them, in the end, and
 * three "More Vehicles". Collecting by brand makes that impossible, and the
 * marque's first appearance still decides where it sits.
 */
function sortedByBrand(items: WorkItem[]): WorkItem[] {
  const byBrand = new Map<string, WorkItem[]>();
  for (const item of items) {
    const list = byBrand.get(item.brand);
    if (list) list.push(item);
    else byBrand.set(item.brand, [item]);
  }
  return [...byBrand.values()].flat();
}

/** One tile of a job's media.
 *
 * A clip shows its poster rather than the video: the grid would otherwise
 * pull down megabytes of footage nobody has asked to watch. The play badge is
 * what says it is a clip, and the video itself is only fetched when the
 * lightbox opens it. */
function MediaTile({ media, alt, sizes }: { media: WorkMedia; alt: string; sizes: string }) {
  return (
    <>
      <Image
        src={media.kind === "video" ? media.poster : media.src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {media.kind === "video" && <PlayBadge />}
    </>
  );
}

function PlayBadge() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/40 backdrop-blur-sm"
    >
      <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

/** Top-right, out of the way of the overlay along the bottom edge. */
function PhotoCountBadge({ count }: { count: number }) {
  if (count < 2) return null;
  return (
    <span className="pointer-events-none absolute right-2 top-2 z-20 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-medium text-white/90 tabular-nums">
      {count} photos
    </span>
  );
}

/** How many thumbnails fit along the bottom of a card before it reads as
 * clutter. Anything past this is surfaced as "+N" rather than dropped — the
 * lightbox always opens the whole set. */
const MAX_THUMBS = 4;

/**
 * One job, one cell.
 *
 * Everything variable — the review, the other photos — is laid over the
 * bottom of the image rather than added beneath it. That is what keeps every
 * card the same height: a job with a review and four photos occupies exactly
 * the same cell as a job with neither, so the grid can be a real grid instead
 * of a masonry layout packing mismatched heights.
 */
function WorkCard({
  item,
  anchorId,
  onOpen,
}: {
  item: WorkItem;
  /** Set on the first card of each marque, so the "Trusted With" strip's
   * links still land somewhere now that the marque headings are gone. */
  anchorId?: string;
  onOpen: (i: number) => void;
}) {
  const media = workMedia(item);
  const hasMedia = media.length > 0;
  const extras = media.slice(1, 1 + MAX_THUMBS);
  const hidden = Math.max(0, media.length - 1 - MAX_THUMBS);
  const hasOverlay = Boolean(item.testimonial) || extras.length > 0;

  return (
    <figure
      id={anchorId}
      className={`card-lift h-full flex flex-col overflow-hidden rounded-xl border border-border bg-surface ${
        anchorId ? "scroll-mt-24 sm:scroll-mt-28" : ""
      }`}
    >
      {hasMedia ? (
        <div className="group relative aspect-[4/5] overflow-hidden bg-surface-2">
          <MediaTile
            media={media[0]}
            alt={item.title}
            sizes="(max-width: 640px) 50vw, 33vw"
          />

          {/* The whole image opens the set. A plain overlay button rather than
              wrapping everything in one: the thumbnails below are buttons too,
              and a button inside a button is invalid markup that browsers
              resolve by dropping the inner one. */}
          <button
            type="button"
            onClick={() => onOpen(0)}
            aria-label={`View media from ${item.title}`}
            className="absolute inset-0 z-10 cursor-zoom-in"
          />

          <PhotoCountBadge count={media.length} />

          {hasOverlay && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-2.5 pb-2.5 pt-10">
              {item.testimonial && (
                <div className="mb-2">
                  <p className="text-[11px] leading-snug text-white/95 italic line-clamp-2">
                    &ldquo;{item.testimonial.quote}&rdquo;
                  </p>
                  <p className="mt-1 text-[10px] text-white/70">
                    &mdash; {item.testimonial.name}
                  </p>
                </div>
              )}

              {extras.length > 0 && (
                <div className="pointer-events-auto flex flex-wrap gap-1.5">
                  {extras.map((m, j) => (
                    <button
                      key={m.src}
                      type="button"
                      onClick={() => onOpen(j + 1)}
                      aria-label={`View ${m.kind === "video" ? "clip" : "photo"} ${j + 2} from ${item.title}`}
                      className="group/thumb relative h-10 w-10 cursor-zoom-in overflow-hidden rounded border border-white/30 bg-black/40"
                    >
                      <Image
                        src={m.kind === "video" ? m.poster : m.src}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover transition-transform duration-200 group-hover/thumb:scale-110"
                      />
                    </button>
                  ))}
                  {hidden > 0 && (
                    <span className="grid h-10 w-10 place-items-center rounded border border-white/25 bg-black/50 text-[10px] font-medium text-white/80 tabular-nums">
                      +{hidden}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* No photos yet. A testimonial-only entry still earns its cell — the
           review becomes the content instead of an apology for a missing
           image. */
        <div className="relative aspect-[4/5] bg-surface-2 flex items-center justify-center px-4 text-center">
          {item.testimonial ? (
            <div>
              <p className="text-sm italic text-muted line-clamp-6">
                &ldquo;{item.testimonial.quote}&rdquo;
              </p>
              <p className="mt-3 text-xs text-muted">&mdash; {item.testimonial.name}</p>
            </div>
          ) : (
            <p className="text-xs text-muted">Photo coming soon &mdash; {item.title}</p>
          )}
        </div>
      )}

      <figcaption className="px-3 py-3 sm:px-4">
        {/* The marque moves onto the card now that the page no longer breaks
            into a section per brand. Same information, no row breaks. */}
        <p className="text-[10px] uppercase tracking-widest text-muted">{item.brand}</p>
        <p className="mt-1 text-xs sm:text-sm font-medium">{item.title}</p>
      </figcaption>
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
  const items = sortedByBrand(workItems.filter((w) => !w.draft));

  // One anchor per marque, on its first card.
  const seen = new Set<string>();

  return (
    <>
      {/* One grid for every job, rather than a grid per marque. A marque with
          a single job used to get a row to itself and leave two thirds of it
          empty; here its card simply sits next to the previous marque's and
          the grid stays full. Sorting keeps each marque's work together. */}
      <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 items-stretch">
        {items.map((item) => {
          const first = !seen.has(item.brand);
          seen.add(item.brand);
          return (
            <StaggerItem key={item.slug} className="h-full">
              <WorkCard
                item={item}
                anchorId={first ? brandAnchor(item.brand) : undefined}
                onOpen={(i) => openJob(item, i)}
              />
            </StaggerItem>
          );
        })}
      </StaggerGrid>

      <Lightbox
        slides={slides}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </>
  );
}
