import { getCategory } from "@/data/catalog";
import ServiceHero from "@/components/ServiceHero";
import TintVisualizer from "@/components/TintVisualizer";
import TintCoverageSelector from "@/components/TintCoverageSelector";

const category = getCategory("window-tinting")!;

export default function WindowTintingPage() {
  return (
    <div>
      <ServiceHero
        eyebrow="Window Tinting"
        title="See Your Shade Before You Book."
        tagline="Preview how each tint shade looks, then choose your coverage and book online — including dedicated pricing for Tesla glass."
        image="/services/window-tinting-hero.webp"
      />

      <div className="bg-white text-neutral-900">
        <section className="w-full pb-6 sm:pb-10">
          <TintVisualizer hasTeslaVariant={category.hasTeslaVariant} />
        </section>

        <section className="w-full pb-6 sm:pb-10">
          <TintCoverageSelector />
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-12 sm:pb-24">
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 text-sm text-neutral-500">
            Tesla vehicles require different glass and installation — Tesla
            pricing is quoted separately from standard vehicle pricing above.
            Toggle &ldquo;Tesla&rdquo; in the preview to see how it&apos;s handled.
          </div>
        </section>
      </div>
    </div>
  );
}
