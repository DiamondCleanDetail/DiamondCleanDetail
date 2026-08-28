import FadeIn from "@/components/FadeIn";

/** Placeholder slots for product/brand partner logos (film suppliers,
 * coating manufacturers, etc). Swap each entry's `null` for a real logo
 * path once Farhan confirms which brands to feature. */
const partners: { name: string; logo: string | null }[] = [
  { name: "Partner", logo: null },
  { name: "Partner", logo: null },
  { name: "Partner", logo: null },
  { name: "Partner", logo: null },
];

export default function PartnerStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
      <FadeIn>
        <p className="text-center text-[10px] sm:text-xs uppercase tracking-widest text-muted mb-5">
          Trusted Products We Install
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {partners.map((p, i) => (
            <div
              key={i}
              className="aspect-[3/1] rounded-lg border border-dashed border-border/60 bg-surface-2 flex items-center justify-center"
            >
              <span className="text-xs text-muted">{p.logo ? "" : p.name}</span>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
