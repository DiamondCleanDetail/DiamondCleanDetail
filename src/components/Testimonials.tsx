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
    <section className="mx-auto max-w-6xl px-6 py-16">
      <FadeIn>
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-muted">
              Certified Brilliance
            </span>
            <h2 className="text-2xl font-semibold mt-1">Brilliant Reviews</h2>
          </div>
          <span className="text-sm text-muted">Real reviews from Google</span>
        </div>
      </FadeIn>
      <StaggerGrid className="grid sm:grid-cols-3 gap-4">
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
