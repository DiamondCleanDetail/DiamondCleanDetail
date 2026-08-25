import { testimonials } from "@/data/testimonials";
import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-accent text-sm" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <FadeIn>
        <div className="flex items-baseline justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">
              Certified Brilliance
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold mt-1">Brilliant Reviews</h2>
          </div>
          <span className="text-xs sm:text-sm text-muted shrink-0">From Google</span>
        </div>
      </FadeIn>

      {/* Mobile: swipeable row so six reviews don't become six screens of scroll.
          sm+: normal grid. */}
      <div className="sm:hidden -mx-6 px-6 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[80%] bg-surface border border-border rounded-xl p-5 flex flex-col"
          >
            <Stars rating={t.rating} />
            <p className="text-sm mt-3 flex-1">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-sm text-muted mt-4">
              <span className="text-foreground font-medium">{t.name}</span>
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
              <p className="text-sm text-muted mt-4">
                <span className="text-foreground font-medium">{t.name}</span>
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
