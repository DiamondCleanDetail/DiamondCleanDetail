import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { catalog, getCategory, priceLabel } from "@/data/catalog";
import PPFVisualizer from "@/components/PPFVisualizer";

export function generateStaticParams() {
  return catalog.filter((c) => c.slug !== "window-tinting").map((c) => ({ slug: c.slug }));
}

export default async function ServiceCategoryPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  if (slug === "window-tinting") redirect("/window-tinting");
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/services" className="text-sm text-muted hover:text-foreground transition-colors">
        &larr; All Services
      </Link>

      <h1 className="text-3xl font-bold mt-3 mb-2">{category.name}</h1>
      <p className="text-muted max-w-2xl mb-10">{category.description}</p>

      {category.visualizer === "ppf" && (
        <div className="mb-10">
          <PPFVisualizer />
        </div>
      )}

      <div className="grid gap-5">
        {category.packages.map((pkg) => (
          <div key={pkg.slug} className="bg-surface border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{pkg.name}</h2>
                <p className="text-sm text-muted mt-1">{pkg.tagline}</p>
                <ul className="mt-3 space-y-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="text-sm text-muted flex gap-2">
                      <span className="text-accent">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {(pkg.durationMinutes || pkg.depositPercent) && (
                  <p className="text-xs text-muted mt-3">
                    {pkg.durationMinutes && <>~{pkg.durationMinutes} min</>}
                    {pkg.durationMinutes && pkg.depositPercent ? " · " : ""}
                    {pkg.depositPercent ? `${pkg.depositPercent}% deposit at booking` : ""}
                  </p>
                )}
              </div>
              <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
                <p className="font-semibold chrome-text text-lg">
                  {priceLabel(pkg, "sedan")}
                </p>
                <Link
                  href={`/booking?service=${category.slug}&package=${pkg.slug}`}
                  className="chrome-btn text-center px-5 py-2 rounded-lg font-semibold text-sm"
                >
                  {pkg.pricing.type === "quote" ? "Request Quote" : "Book This"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
