import { getCategory } from "@/data/catalog";
import TintVisualizer from "@/components/TintVisualizer";
import TintCoverageSelector from "@/components/TintCoverageSelector";

const category = getCategory("window-tinting")!;

export default function WindowTintingPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-10 sm:pt-16 pb-6 sm:pb-10 text-center">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">
          Window Tinting
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mt-3">
          See Your Shade <span className="chrome-text">Before You Book.</span>
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted max-w-xl mx-auto">
          Preview how each tint shade looks, then choose your coverage and
          book online — including dedicated pricing for Tesla glass.
        </p>
      </section>

      <section className="w-full pb-6 sm:pb-10">
        <TintVisualizer hasTeslaVariant={category.hasTeslaVariant} />
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-12 sm:pb-24">
        <TintCoverageSelector />

        <div className="mt-8 bg-surface-2 border border-border rounded-xl p-5 text-sm text-muted">
          Tesla vehicles require different glass and installation — Tesla
          pricing is quoted separately from standard vehicle pricing above.
          Toggle &ldquo;Tesla&rdquo; in the preview to see how it&apos;s handled.
        </div>
      </section>
    </div>
  );
}
