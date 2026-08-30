"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox, { type LightboxSlide } from "@/components/Lightbox";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { workItems, workMedia, brandAnchor, type WorkItem, type WorkMedia } from "@/data/work";

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
}: {
  media: WorkMedia;
  alt: string;
  sizes: string;
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

/** Top-right, not bottom-right: a job with a review has the quote sitting
 * along the bottom edge, and the two used to land on top of each other. */
function PhotoCountBadge({ count }: { count: number }) {
  if (count < 2) return null;
  return (
    <span className="absolute right-2 top-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-medium text-white/90 tabular-nums">
      {count} photos
    </span>
  );
}

/** A customer's words, laid over the bottom of the photo rather than added
 * underneath it.
 *
 * Underneath, a review made its card taller than every card beside it, which
 * is what forced the whole gallery into a masonry layout and left the ragged
 * gaps that came with it. Over the image it costs no height at all, so one
 * job having a review can't change the shape of the grid. Clamped to three
 * lines for the same reason. */
function TestimonialOverlay({ quote, name }: { quote: string; name: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-3 pb-3 pt-10 text-left">
      <p className="text-[11px] sm:text-xs leading-snug text-white/95 italic line-clamp-3">
        &ldquo;{quote}&rdquo;
      </p>
      <p className="mt-1.5 text-[10px] text-white/70">&mdash; {name}</p>
    </div>
  );
}

/**
 * One job, one cell. Every card is the same shape: a 4:5 photo and a one-line
 * title, nothing that varies with how many photos a job has or whether it
 * carries a review.
 *
 * That uniformity is the point. The gallery used to run two different cards —
 * a stacked one, and a wide side-by-side one for any marque with a single job
 * — laid out in CSS columns. A lone Lamborghini therefore got a card three
 * times the width of its photo with the rest left empty, and the columns left
 * ragged gaps wherever a card ran short. The extra photos now live behind the
 * count badge and the lightbox, which is where people were opening them
 * anyway.
 */
function WorkCard({ item, onOpen }: { item: WorkItem; onOpen: (i: number) => void }) {
  const media = workMedia(item);
  const hasMedia = media.length > 0;

  return (
    <figure className="card-lift h-full flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      {hasMedia ? (
        <button
          type="button"
          onClick={() => onOpen(0)}
          aria-label={`View media from ${item.title}`}
          className="group relative block w-full aspect-[4/5] cursor-zoom-in overflow-hidden bg-surface-2"
        >
          <MediaTile
            media={media[0]}
            alt={item.title}
            sizes="(max-width: 640px) 50vw, 33vw"
          />
          <PhotoCountBadge count={media.length} />
          {item.testimonial && (
            <TestimonialOverlay
              quote={item.testimonial.quote}
              name={item.testimonial.name}
            />
          )}
        </button>
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
        <p className="text-xs sm:text-sm font-medium">{item.title}</p>
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
  const groups = groupByBrand(workItems.filter((w) => !w.draft));

  return (
    <>
      <div className="flex flex-col gap-8 sm:gap-12">
        {groups.map((group) => (
          // The id is what the "Trusted With" logo strip links to, and
          // scroll-mt keeps the marque heading clear of the fixed header
          // when someone lands on it rather than tucked underneath.
          <section
            key={group.brand}
            id={brandAnchor(group.brand)}
            className="scroll-mt-24 sm:scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
              <h2 className="text-[10px] sm:text-xs uppercase tracking-widest text-muted shrink-0">
                {group.brand}
              </h2>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
            </div>

            {/* A real grid, not CSS columns. items-stretch is what makes every
                card in a row the same height rather than each one ending
                wherever its own content did. Three columns rather than four:
                most marques here have one or two jobs, so a wider grid just
                buys more empty cells at the end of every marque row. */}
            <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 items-stretch">
              {group.items.map((item) => (
                <StaggerItem key={item.slug} className="h-full">
                  <WorkCard item={item} onOpen={(i) => openJob(item, i)} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </section>
        ))}
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
