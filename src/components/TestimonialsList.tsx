"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type Review = {
  rating: number;
  quote: string;
  name: string;
  source: "Google" | "Yelp";
};

/** How many cards show before "Show more" — two full rows of the 3-column
 * grid, enough to establish a wall of praise without turning the homepage
 * into a page of nothing but reviews. */
const INITIAL_COUNT = 6;

// The grid's own stagger, driven by a controlled `animate` (see below) rather
// than StaggerGrid's whileInView. whileInView fires once and disconnects, so
// cards revealed by "Show more" afterwards mounted at opacity:0 and were never
// told to appear — the blank space under the first six. A controlled animate
// re-propagates "show" to every child, including the ones added on expand.
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const },
  },
};

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-accent text-sm" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );
}

/** Which listing a review came from. Small and quiet — it is provenance, not
 * a badge — but present, because the heading above these cards counts Google
 * reviews and an unlabelled Yelp quote underneath it would read as one. */
export function SourceTag({ source }: { source: "Google" | "Yelp" }) {
  return (
    <span className="text-[10px] uppercase tracking-widest text-muted/70 shrink-0">
      {source}
    </span>
  );
}

function Card({ review }: { review: Review }) {
  return (
    <div className="card-lift h-full bg-surface border border-border rounded-xl p-5 flex flex-col">
      <Stars rating={review.rating} />
      <p className="text-sm mt-3 flex-1">&ldquo;{review.quote}&rdquo;</p>
      <p className="text-sm text-muted mt-4 flex items-baseline justify-between gap-3">
        <span className="text-foreground font-medium">{review.name}</span>
        <SourceTag source={review.source} />
      </p>
    </div>
  );
}

export default function TestimonialsList({
  testimonials,
}: {
  testimonials: Review[];
}) {
  const [expanded, setExpanded] = useState(false);
  // Flips true once the grid scrolls into view, then stays true. Driving the
  // container's `animate` off this (instead of whileInView) is what lets the
  // revealed cards animate in too.
  const [entered, setEntered] = useState(false);

  // Mobile is a horizontal swiper, so it never adds vertical scroll — it can
  // keep every review. The "too much scrolling" the toggle fixes is the
  // desktop grid, which is the only place a long list piles up down the page.
  const shown = expanded ? testimonials : testimonials.slice(0, INITIAL_COUNT);
  const hasMore = testimonials.length > INITIAL_COUNT;

  return (
    <>
      {/* Mobile: swipeable row so many reviews don't become many screens of
          scroll. sm+: the limited grid below. */}
      <div className="sm:hidden -mx-6 px-6 scroll-pl-6 scroll-pr-6 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[80%] bg-surface border border-border rounded-xl p-5 flex flex-col"
          >
            <Stars rating={t.rating} />
            <p className="text-sm mt-3 flex-1">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-sm text-muted mt-4 flex items-baseline justify-between gap-3">
              <span className="text-foreground font-medium">{t.name}</span>
              <SourceTag source={t.source} />
            </p>
          </div>
        ))}
      </div>
      <p className="sm:hidden text-xs text-muted mt-3 text-center">Swipe for more &rarr;</p>

      <motion.div
        data-motion
        className="hidden sm:grid sm:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate={entered ? "show" : "hidden"}
        onViewportEnter={() => setEntered(true)}
        viewport={{ once: true, margin: "-60px" }}
      >
        {shown.map((t, i) => (
          <motion.div data-motion key={i} variants={item}>
            <Card review={t} />
          </motion.div>
        ))}
      </motion.div>

      {hasMore && (
        <div className="hidden sm:flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="rounded-full border border-border px-5 py-2 text-sm text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            {expanded
              ? "Show fewer"
              : `Show all ${testimonials.length} reviews`}
          </button>
        </div>
      )}
    </>
  );
}
