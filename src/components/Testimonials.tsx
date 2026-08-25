import { testimonials } from "@/data/testimonials";

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
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-semibold">What Customers Say</h2>
        <span className="text-sm text-muted">Real reviews from Google</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-xl p-5 flex flex-col"
          >
            <Stars rating={t.rating} />
            <p className="text-sm mt-3 flex-1">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-sm text-muted mt-4">
              <span className="text-foreground font-medium">{t.name}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
