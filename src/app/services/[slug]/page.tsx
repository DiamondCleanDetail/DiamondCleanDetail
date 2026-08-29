import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { catalog, getCategory, getFaqs, priceLabel } from "@/data/catalog";
import PPFVisualizer from "@/components/PPFVisualizer";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ProcessSlideshow from "@/components/ProcessSlideshow";
import ServiceGallery from "@/components/ServiceGallery";
import ServiceHero from "@/components/ServiceHero";
import FadeIn from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import StatCallouts from "@/components/StatCallouts";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import SectionHeading from "@/components/SectionHeading";
import CtaCard from "@/components/CtaCard";
import AddOnSelector from "@/components/AddOnSelector";
import PackagePrices from "@/components/PackagePrices";
import PackageDetails from "@/components/PackageDetails";
import DiamondDivider from "@/components/DiamondDivider";
import HelpNudge from "@/components/HelpNudge";

/** Services that have outgrown this template and ship their own route.
 * A static route wins over this dynamic one at request time regardless, but
 * leaving the slug here would still prerender a second, unreachable copy. */
const HAS_OWN_PAGE = new Set([
  "window-tinting",
  "specialty-vehicles",
  "mobile-detailing",
  "ceramic-coating",
  "maintenance-plans",
]);

export function generateStaticParams() {
  return catalog.filter((c) => !HAS_OWN_PAGE.has(c.slug)).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.summary,
    openGraph: { title: category.name, description: category.summary },
  };
}

export default async function ServiceCategoryPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  if (slug === "window-tinting") redirect("/window-tinting");
  const category = getCategory(slug);
  if (!category) notFound();

  const hasGroupedPackages = category.packages.some((p) => Boolean(p.group));

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
        mobileImage={category.heroImageMobile}
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
      {category.beforeAfter ? (
        <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
          <FadeIn>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 items-center">
              <BeforeAfterSlider
                before={category.beforeAfter.before}
                after={category.beforeAfter.after}
                beforeLabel={category.beforeAfter.beforeLabel}
                afterLabel={category.beforeAfter.afterLabel}
              />
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">What It Is</span>
                <p className="text-lg sm:text-xl mt-3 leading-relaxed">{category.valueProp}</p>
              </div>
            </div>
          </FadeIn>
        </section>
      ) : category.valuePropImage ? (
        <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
          <FadeIn>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 items-center">
              <div className="relative aspect-square w-full max-w-[320px] sm:max-w-[380px] mx-auto rounded-xl overflow-hidden bg-surface-2">
                <Image
                  src={category.valuePropImage}
                  alt={`How ${category.name} works`}
                  fill
                  sizes="(max-width: 640px) 100vw, 380px"
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
        <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
          <FadeIn>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 items-center">
              <div className="aspect-square w-full max-w-[380px] mx-auto rounded-xl bg-gradient-to-br from-surface-2 to-surface border border-border flex items-center justify-center">
                <p className="text-sm text-muted text-center px-6">Photo coming soon — {category.name}</p>
              </div>
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">What It Is</span>
                <p className="text-lg sm:text-xl mt-3 leading-relaxed">{category.valueProp}</p>
              </div>
            </div>
          </FadeIn>
        </section>
      )}

      {/* Process slideshow — application photos/video, opt-in per category */}
      {category.processMedia !== undefined && (
        <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
          <FadeIn>
            <SectionHeading title="See It" accent="Applied" className="mb-8 sm:mb-10" />
            <ProcessSlideshow items={category.processMedia} />
          </FadeIn>
        </section>
      )}

      <DiamondDivider />

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <SectionHeading title="Why It's" accent="Worth It" className="mb-8 sm:mb-10" />
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {category.benefits.map((b, i) => {
            const image = category.benefitImages?.[i];
            return (
              <StaggerItem key={b.title}>
                <div className="card-lift h-full bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="relative aspect-[4/3] bg-surface-2">
                    {image ? (
                      <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-xs text-muted text-center px-4">Photo coming soon</p>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-sm text-muted mt-2">{b.description}</p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {category.stats && (
          <FadeIn>
            <div className="mt-4 sm:mt-5">
              <StatCallouts stats={category.stats} />
            </div>
          </FadeIn>
        )}
      </section>

      {/* Visualizer, if applicable. It paints its own white ground edge to
          edge and butts straight against the dark either side — the spacing
          here sits outside that block, so the cut stays hard. */}
      {category.visualizer === "ppf" && (
        <section className="w-full pb-10 sm:pb-16">
          <FadeIn>
            <PPFVisualizer packages={category.packages} categorySlug={category.slug} />
          </FadeIn>
          {/* The package list below is suppressed for PPF, so this section
              owns the tier choice — and therefore owns the way out of it. */}
          <div className="mx-auto max-w-6xl px-6">
            <HelpNudge label="Not sure how much coverage you need?" className="max-w-2xl mx-auto" />
          </div>
        </section>
      )}

      {/* Add-ons — small extra pieces, selectable at checkout */}
      {category.addOns && category.addOns.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
          <FadeIn>
            <SectionHeading
              eyebrow="Optional Extras"
              title="Popular"
              accent="Add-Ons"
              subtitle="Small, high-wear areas most packages don't cover. Add any of these when you book."
              className="mb-8 sm:mb-10"
            />
            <AddOnSelector addOns={category.addOns} readOnly />
          </FadeIn>
        </section>
      )}

      <DiamondDivider />

      {/* Process */}
      <section className="mx-auto max-w-4xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <SectionHeading title="How It" accent="Works" className="mb-8 sm:mb-10" />
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
          <SectionHeading title="Packages &amp;" accent="Pricing" className="mb-8 sm:mb-10" />
        </FadeIn>
        {/* Tiers sit side by side so they read as a comparison. Grouped sets
            (e.g. ceramic's wheel/glass coatings) stay stacked, since their
            subheadings only make sense in a single column. */}
        <div
          className={
            !hasGroupedPackages && category.packages.length <= 3
              ? `grid gap-4 sm:gap-5 items-stretch ${
                  category.packages.length === 3
                    ? "md:grid-cols-3"
                    : category.packages.length === 2
                      ? "sm:grid-cols-2"
                      : ""
                }`
              : "grid gap-4 sm:gap-5"
          }
        >
          {/* Wrapper is a flex column, not plain h-full: it may also hold a
              group heading ("Glass Coating"), and an h-full card inside it
              overflowed past the wrapper and collided with that heading. */}
          {category.packages.map((pkg, i) => (
            <div key={pkg.slug} className="h-full flex flex-col">
              {pkg.group && pkg.group !== category.packages[i - 1]?.group && (
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted mb-3 mt-2 first:mt-0">
                  {pkg.group}
                </h3>
              )}
            <div
              className={`card-lift relative flex-1 flex flex-col bg-surface border rounded-xl p-5 sm:p-6 ${
                pkg.featured ? "border-accent" : "border-border"
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 left-5 chrome-chip text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              {/* Stacked top-to-bottom: details, then price and CTA, so the card
                  reads as one column instead of splitting left/right. */}
              <div className="flex flex-col flex-1">
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
                <PackageDetails pkg={pkg} />
                {(pkg.durationMinutes || pkg.depositPercent) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pkg.durationMinutes && (
                      <span className="text-xs font-medium text-muted bg-surface-2 border border-border rounded-full px-3 py-1.5">
                        &#9201;{" "}
                        {pkg.durationMinutes >= 120
                          ? `~${Math.round(pkg.durationMinutes / 60)} hr`
                          : `~${pkg.durationMinutes} min`}{" "}
                        on site
                      </span>
                    )}
                    {pkg.depositPercent && (
                      <span className="text-xs font-medium text-muted bg-surface-2 border border-border rounded-full px-3 py-1.5">
                        {pkg.depositPercent}% deposit
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-5 border-t border-border flex flex-col gap-3">
                  <PackagePrices pkg={pkg} />
                  <Link
                    href={`/booking?service=${category.slug}&package=${pkg.slug}`}
                    className="chrome-btn w-full text-center px-5 py-3 rounded-lg font-bold"
                  >
                    {pkg.pricing.type === "quote" ? "Request Quote" : "Book This"}
                  </Link>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
        <HelpNudge className="max-w-2xl mx-auto" />
      </section>
      )}

      {/* Related services — divider lives inside the conditional so a category
          with no related services doesn't render two dividers back to back. */}
      {related && related.length > 0 && (
        <>
          <DiamondDivider />
          <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
          <FadeIn>
            <SectionHeading title="Related" accent="Services" align="left" className="mb-8 sm:mb-10" />
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
        </>
      )}

      <DiamondDivider />

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <SectionHeading title="Common" accent="Questions" className="mb-8 sm:mb-10" />
          <FaqAccordion items={getFaqs(category)} />
        </FadeIn>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-16 sm:pb-24 text-center">
        <FadeIn>
          <CtaCard
            eyebrow="Ready When You Are"
            title="Book Your"
            accent={category.shortName}
            subtitle="Pick your package, choose a time, and pay online in minutes."
            href={`/booking?service=${category.slug}`}
            cta="Book Now →"
          />
        </FadeIn>
      </section>

      {/* Gallery — past jobs of this service type */}
      <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
        <FadeIn>
          <SectionHeading title="From Recent" accent="Jobs" className="mb-8 sm:mb-10" />
          <ServiceGallery images={category.galleryImages} />
        </FadeIn>
      </section>
    </div>
  );
}
