import { getReviews } from "@/lib/googleReviews";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import TestimonialsList, { Stars } from "@/components/TestimonialsList";
import { socialLinks } from "@/data/social";

/** Sourced from the social links so the listing URL lives in one place — the
 * footer icon and this block can't end up pointing at different pages. */
const googleReviewsUrl =
  socialLinks.find((s) => s.name === "Google")?.url ?? null;

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

      {/* The list — mobile swiper plus a desktop grid capped with a "show
          more" toggle — lives in a client island so the page stays server
          rendered around it. */}
      <TestimonialsList testimonials={testimonials} />

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
