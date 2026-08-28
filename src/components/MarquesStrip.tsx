import FadeIn from "@/components/FadeIn";
import { workItems } from "@/data/work";

/** Marques actually represented in the portfolio, pulled from the work data
 * rather than hand-listed, so it can never claim a car we haven't detailed.
 * This is the high-end positioning doing real work: the client list is the
 * proof, not an adjective. */
const excluded = new Set(["More Vehicles", "Motorcycles"]);

const marques = Array.from(new Set(workItems.map((w) => w.brand))).filter(
  (b) => !excluded.has(b)
);

export default function MarquesStrip() {
  if (marques.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
      <FadeIn>
        <p className="text-center text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted mb-6">
          Trusted With
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
          {marques.map((m) => (
            <span
              key={m}
              className="text-sm sm:text-base font-semibold uppercase tracking-[0.15em] text-muted/70 transition-colors hover:text-foreground"
            >
              {m}
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
