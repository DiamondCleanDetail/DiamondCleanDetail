import Link from "next/link";
import { getCategory, priceLabel } from "@/data/catalog";
import TintVisualizer from "@/components/TintVisualizer";

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
          Preview how each tint shade looks on a real vehicle, choose the
          darkness that fits your style, and book online — including
          dedicated pricing for Tesla glass.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-10 sm:pb-16">
        <TintVisualizer hasTeslaVariant={category.hasTeslaVariant} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12 sm:pb-24">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Tinting Packages</h2>
        <div className="grid gap-5">
          {category.packages.map((pkg) => (
            <div key={pkg.slug} className="bg-surface border border-border rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{pkg.name}</h3>
                  <p className="text-sm text-muted mt-1">{pkg.tagline}</p>
                  <ul className="mt-3 space-y-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="text-sm text-muted flex gap-2">
                        <span className="text-accent">&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {pkg.durationMinutes && (
                    <p className="text-xs text-muted mt-3">~{pkg.durationMinutes} min</p>
                  )}
                </div>
                <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
                  <p className="font-semibold chrome-text text-lg">{priceLabel(pkg, "sedan")}</p>
                  <Link
                    href={`/booking?service=${category.slug}&package=${pkg.slug}`}
                    className="chrome-btn text-center px-5 py-2 rounded-lg font-semibold text-sm"
                  >
                    Book This
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-surface-2 border border-border rounded-xl p-5 text-sm text-muted">
          Tesla vehicles require different glass and installation — Tesla
          pricing is quoted separately from standard vehicle pricing above.
          Toggle &ldquo;Tesla&rdquo; in the preview to see how it&apos;s handled.
        </div>
      </section>
    </div>
  );
}
