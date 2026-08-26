import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { catalog, getCategory, priceLabel } from "@/data/catalog";
import PPFVisualizer from "@/components/PPFVisualizer";
import ServiceHero from "@/components/ServiceHero";
import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

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

  const related = category.relatedSlugs
    ?.map((s) => getCategory(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div>
      {/* Hero */}
      <ServiceHero
        eyebrow={category.shortName}
        title={category.name}
        tagline={category.tagline}
        video={category.heroVideo}
        image={category.heroImage}
      />

      {/* Media placeholder — only shown until a hero video or image exists */}
      {!category.heroVideo && !category.heroImage && (
        <section className="mx-auto max-w-6xl px-6 pt-10 sm:pt-16 pb-10 sm:pb-16">
          <FadeIn>
            <div className="aspect-video sm:aspect-[21/9] rounded-xl bg-gradient-to-br from-surface-2 to-surface border border-border flex items-center justify-center">
              <p className="text-sm text-muted">Photo/video coming soon — {category.name}</p>
            </div>
          </FadeIn>
        </section>
      )}

      {/* Value proposition */}
      {category.valuePropImage ? (
        <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
          <FadeIn>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 items-center">
              <div className="relative aspect-square w-full max-w-[320px] sm:max-w-[380px] mx-auto rounded-xl overflow-hidden bg-surface-2">
                <Image
                  src={category.valuePropImage}
                  alt={`How ${category.name} works`}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">What It Is</span>
                <p className="text-lg sm:text-xl mt-3 leading-relaxed">{category.valueProp}</p>
              </div>
            </div>
          </FadeIn>
        </section>
      ) : (
        <section className="mx-auto max-w-4xl px-6 pb-10 sm:pb-16 text-center">
          <FadeIn>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">What It Is</span>
            <p className="text-lg sm:text-xl mt-3 leading-relaxed">{category.valueProp}</p>
          </FadeIn>
        </section>
      )}

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Why It&apos;s Worth It</h2>
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {category.benefits.map((b, i) => (
            <StaggerItem key={b.title}>
              <div className="card-lift h-full bg-surface border border-border rounded-xl p-5">
                <span className="chrome-text text-3xl font-black">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-semibold mt-3">{b.title}</h3>
                <p className="text-sm text-muted mt-2">{b.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Visualizer, if applicable */}
      {category.visualizer === "ppf" && (
        <section className="w-full pb-10 sm:pb-16">
          <FadeIn>
            <PPFVisualizer packages={category.packages} categorySlug={category.slug} />
          </FadeIn>
        </section>
      )}

      {/* Process */}
      <section className="mx-auto max-w-4xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">How It Works</h2>
        </FadeIn>
        <div className="space-y-4">
          {category.process.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.06}>
              <div className="flex gap-4 bg-surface border border-border rounded-xl p-5">
                <span className="shrink-0 w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-sm font-semibold chrome-text">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted mt-1">{step.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Packages — the PPF visualizer above already covers tiers, pricing, and CTAs */}
      {category.visualizer !== "ppf" && (
      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Packages &amp; Pricing</h2>
        </FadeIn>
        <div className="grid gap-4 sm:gap-5">
          {category.packages.map((pkg) => (
            <div
              key={pkg.slug}
              className={`relative bg-surface border rounded-xl p-5 sm:p-6 ${
                pkg.featured ? "border-accent" : "border-border"
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 left-5 chrome-chip text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
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
      </section>
      )}

      {/* Related services */}
      {related && related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
          <FadeIn>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Related Services</h2>
          </FadeIn>
          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {related.map((r) => (
              <StaggerItem key={r.slug}>
                <Link
                  href={r.slug === "window-tinting" ? "/window-tinting" : `/services/${r.slug}`}
                  className="card-lift block h-full bg-surface border border-border rounded-xl p-5"
                >
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-sm text-muted mt-2">{r.summary}</p>
                  <p className="mt-3 font-semibold chrome-text text-sm">
                    {r.isQuoteOnly ? "Get a Quote" : priceLabel(r.packages[0], "sedan")}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-16 sm:pb-24 text-center">
        <FadeIn>
          <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold">Ready to Book {category.shortName}?</h2>
            <p className="text-sm sm:text-base text-muted mt-2">
              Pick your package, choose a time, and pay online in minutes.
            </p>
            <Link
              href={`/booking?service=${category.slug}`}
              className="chrome-btn inline-block mt-5 px-6 py-3 rounded-lg font-semibold"
            >
              Book Now
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
