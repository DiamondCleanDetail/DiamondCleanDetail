import { getReviews } from "@/lib/googleReviews";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { socialLinks } from "@/data/social";

/** Sourced from the social links so the listing URL lives in one place — the
 * footer icon and this block can't end up pointing at different pages. */
const googleReviewsUrl =
  socialLinks.find((s) => s.name === "Google")?.url ?? null;

/** Which listing a review came from. Small and quiet — it is provenance, not
 * a badge — but present, because the heading above these cards counts Google
 * reviews and an unlabelled Yelp quote underneath it would read as one. */
function SourceTag({ source }: { source: "Google" | "Yelp" }) {
  return (
    <span className="text-[10px] uppercase tracking-widest text-muted/70 shrink-0">
      {source}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-accent text-sm" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );
}

export default async function Testimonials() {
  // Live from the Google listing when a key is configured, the hand-entered
  // list otherwise. Either way this is a server component, so the fetch and
  // its day-long cache never reach the browser.
  const {
    testimonials,
    average: reviewsAverage,
    count: reviewsCount,
  } = await getReviews();

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <FadeIn>
        {/* items-end, not items-baseline. The heading is two lines with an
            eyebrow on top, so aligning baselines pinned the score to the
            eyebrow's line and left it floating well above the title it sits
            beside. Aligning the bottoms puts the score next to "Reviews",
            which is what it is a score of. */}
        <div className="flex items-end justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <SectionHeading align="left" eyebrow="In Their Words" title="Brilliant" accent="Reviews" />
          </div>
          {/* The whole score block is the link — someone checking a rating
              wants the source, and the number is what they are looking at. */}
          <a
            href={googleReviewsUrl ?? undefined}
            target={googleReviewsUrl ? "_blank" : undefined}
            rel={googleReviewsUrl ? "noopener noreferrer" : undefined}
            className={`shrink-0 text-right group ${
              googleReviewsUrl ? "" : "pointer-events-none"
            }`}
          >
            {/* div, not p — Stars renders a div, which is invalid inside a p. */}
            <div className="flex items-baseline justify-end gap-2">
              <span className="chrome-text text-3xl sm:text-4xl font-black leading-none tabular-nums">
                {reviewsAverage.toFixed(1)}
              </span>
              <Stars rating={Math.round(reviewsAverage)} />
            </div>
            <p className="text-xs text-muted mt-1 group-hover:text-foreground transition-colors">
              {reviewsCount} Google review{reviewsCount === 1 ? "" : "s"}
              {googleReviewsUrl && <span aria-hidden> &rarr;</span>}
            </p>
          </a>
        </div>
      </FadeIn>

      {/* Mobile: swipeable row so six reviews don't become six screens of scroll.
          sm+: normal grid. */}
        {/* Full-bleed scroller with the inset on the items (-mx-6 px-6), so the
            first card lines up with the heading and the next one still peeks
            at the right edge.

            scroll-pl-6 is what makes that actually hold: scroll snapping
            aligns a snap target to the *scrollport's* edge, which ignores
            padding, so on load the browser snapped the first card flush to
            x=0 and scrolled 24px right — exactly cancelling the padding. The
            scroll padding moves the snap edge in to match. scroll-pr-6 does
            the same at the other end so the last card can come to rest clear
            of the edge. */}
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


      <StaggerGrid className="hidden sm:grid sm:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <StaggerItem key={i}>
            <div className="card-lift h-full bg-surface border border-border rounded-xl p-5 flex flex-col">
              <Stars rating={t.rating} />
              <p className="text-sm mt-3 flex-1">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-sm text-muted mt-4 flex items-baseline justify-between gap-3">
                <span className="text-foreground font-medium">{t.name}</span>
                <SourceTag source={t.source} />
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>

      {googleReviewsUrl && (
        <FadeIn>
          <p className="text-xs sm:text-sm text-muted mt-6 text-center">
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Read all our reviews on Google &rarr;
            </a>
          </p>
        </FadeIn>
      )}
    </section>
  );
}
