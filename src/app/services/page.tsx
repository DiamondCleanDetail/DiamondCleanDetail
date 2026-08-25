import Link from "next/link";
import { catalog, priceLabel } from "@/data/catalog";

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Services</h1>
      <p className="text-muted mb-10 max-w-2xl">
        Every service we offer, with real packages and pricing. Pick a
        category to compare options and book online.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {catalog.map((category) => {
          const startingPackage = category.packages[0];
          return (
            <Link
              key={category.slug}
              href={category.slug === "window-tinting" ? "/window-tinting" : `/services/${category.slug}`}
              className="bg-surface border border-border rounded-xl p-6 hover:border-muted transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">{category.name}</h2>
                {category.visualizer && (
                  <span className="shrink-0 text-[10px] uppercase tracking-wide bg-surface-2 border border-border rounded-full px-2 py-1 text-muted">
                    Visualizer
                  </span>
                )}
              </div>
              <p className="text-sm text-muted mt-2 flex-1">{category.summary}</p>
              <p className="mt-4 font-semibold chrome-text">
                {category.isQuoteOnly
                  ? "Get a Quote"
                  : priceLabel(startingPackage, "sedan")}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
