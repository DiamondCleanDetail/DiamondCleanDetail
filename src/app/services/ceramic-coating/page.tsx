import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getFaqs, type Package } from "@/data/catalog";
import ServiceHero from "@/components/ServiceHero";
import ServiceGallery from "@/components/ServiceGallery";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ProcessSlideshow from "@/components/ProcessSlideshow";
import FadeIn from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import SectionHeading from "@/components/SectionHeading";
import CtaCard from "@/components/CtaCard";
import PackagePrices from "@/components/PackagePrices";
import PackageDetails from "@/components/PackageDetails";
import DiamondDivider from "@/components/DiamondDivider";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

const category = getCategory("ceramic-coating");

export const metadata: Metadata = category
  ? {
      title: category.name,
      description: category.summary,
      openGraph: { title: category.name, description: category.summary },
    }
  : {};

/** The headline number on each coating tier. Pulled off the slug rather than
 * parsed out of the name, so a rename can't silently blank the card. */
const tierYears: Record<string, string> = {
  "1-year-coating": "1",
  "3-year-coating": "3",
  "5-year-coating": "5",
};

/** Ceramic gets its own page rather than the shared service template.
 *
 * On the template its six packages rendered as one stacked column — the
 * grouped wheel and glass coatings force that path — which made the pricing
 * block alone 2,600px, more than a third of a page already nine screens long.
 * Here the three paint tiers are a row you can compare at a glance, the
 * add-on coatings are their own labelled row, and the beading clips get the
 * room they deserve: they are the one thing that shows what a coating does. */
export default function CeramicCoatingPage() {
  if (!category) notFound();

  const tiers = category.packages.filter((p) => !p.group);
  const extras = category.packages.filter((p) => p.group);

  return (
    <div>
      <ServiceHero
        eyebrow={category.shortName}
        title="Gloss That Lasts Years, Not Weeks."
        tagline={category.tagline}
        image={category.heroImage}
      />

      {/* Tiers first: this is a considered purchase and the question people
          arrive with is "how long, and how much". */}
      <section className="mx-auto max-w-6xl px-6 pt-14 sm:pt-20 pb-12 sm:pb-16">
        <FadeIn>
          <SectionHeading
            eyebrow="Coat Your Paint"
            title="Choose Your"
            accent="Protection"
            subtitle="Every coating includes full decontamination and prep. The 3- and 5-year packages include machine paint correction first, so the coating locks in corrected paint rather than sealing in swirls."
            className="mb-8 sm:mb-12"
          />
        </FadeIn>
        <StaggerGrid className="grid md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          {tiers.map((pkg) => (
            <StaggerItem key={pkg.slug}>
              <TierCard pkg={pkg} categorySlug={category.slug} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <DiamondDivider />

      {/* The proof. A coating is an invisible product, so this is the section
          that has to do the convincing — the clips show water behaving
          differently, and the slider shows the gloss it leaves behind. */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading
            eyebrow="What It Actually Does"
            title="Water Doesn't"
            accent="Stick"
            className="mb-8 sm:mb-12"
          />
        </FadeIn>
        {/* Both tiles run 16:9 and fill their column, so they read as a pair.
            The copy spans underneath rather than stacking under one of them —
            hung off the right column it left the shorter left one sitting
            above 166px of nothing. */}
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
          <FadeIn>
            <ProcessSlideshow items={category.processMedia} />
          </FadeIn>
          <FadeIn delay={0.1}>
            {category.beforeAfter && (
              <BeforeAfterSlider
                before={category.beforeAfter.before}
                after={category.beforeAfter.after}
                beforeLabel="Uncoated"
                afterLabel="Coated"
                aspect="video"
              />
            )}
          </FadeIn>
        </div>
        <FadeIn delay={0.15}>
          <p className="text-sm sm:text-base text-muted mt-6 sm:mt-8 max-w-3xl mx-auto text-center leading-relaxed">
            {category.valueProp}
          </p>
        </FadeIn>

        {/* The three benefits, compressed into one row of real photos. On the
            template these were three tall cards with "photo coming soon" in
            each — a screen of page spent on placeholders. */}
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5 mt-10 sm:mt-14">
          {category.benefits.map((b, i) => {
            const image = category.benefitImages?.[i];
            return (
              <StaggerItem key={b.title}>
                <div className="card-lift h-full bg-surface border border-border rounded-xl overflow-hidden">
                  {image && (
                    <div className="relative aspect-[16/10] bg-surface-2">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-sm text-muted mt-2">{b.description}</p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </section>

      <DiamondDivider />

      {/* Wheel and glass, kept apart from the paint tiers. They are add-ons,
          not a fourth and fifth tier, and stacking all six in one column was
          what made that read as a wall. */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading
            eyebrow="Beyond The Paint"
            title="Wheels &amp;"
            accent="Glass"
            subtitle="Book alongside a paint coating or on their own — the wheels take the worst of the brake dust and heat, and coated glass sheds rain instead of smearing it."
            className="mb-8 sm:mb-12"
          />
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          {extras.map((pkg) => (
            <StaggerItem key={pkg.slug}>
              <TierCard pkg={pkg} categorySlug={category.slug} compact />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading title="How It" accent="Works" className="mb-8 sm:mb-12" />
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {category.process.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="h-full bg-surface border border-border rounded-xl p-5">
                <span className="chrome-text text-3xl font-black">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold mt-3">{step.title}</h3>
                <p className="text-sm text-muted mt-2">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading
            eyebrow="Recent Work"
            title="Cars We've"
            accent="Coated"
            subtitle="Every car here was booked as The Diamond Detail Pro — the package that includes a professional-grade ceramic coating."
            className="mb-8 sm:mb-12"
          />
          <ServiceGallery images={category.galleryImages} />
        </FadeIn>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading title="Common" accent="Questions" className="mb-8 sm:mb-12" />
          <FaqAccordion items={getFaqs(category)} />
        </FadeIn>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 sm:pb-24">
        <FadeIn>
          <CtaCard
            eyebrow="Ready When You Are"
            title="Book Your"
            accent="Ceramic Coating"
            subtitle="Pick a package, choose a time, and pay online — we come to you."
            href={`/booking?service=${category.slug}`}
            cta="Book Now →"
          />
        </FadeIn>
      </section>
    </div>
  );
}

/** One package as a column.
 *
 * `compact` drops the big year numeral, which only means something for the
 * paint tiers — a wheel coating is not "0 years". */
function TierCard({
  pkg,
  categorySlug,
  compact = false,
}: {
  pkg: Package;
  categorySlug: string;
  compact?: boolean;
}) {
  const years = tierYears[pkg.slug];

  return (
    <div
      className={`card-lift relative h-full flex flex-col bg-surface border rounded-2xl overflow-hidden ${
        pkg.featured ? "border-accent" : "border-border"
      }`}
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Year and badge share one row. The badge used to be pinned to the
            card corner with the title padded to clear it, which squeezed
            "3-Year Ceramic Coating" onto three lines and left the featured
            card's content sitting lower than its neighbours'. */}
        {((!compact && years) || pkg.featured) && (
          <div className="flex items-start justify-between gap-3 mb-4">
            {!compact && years ? (
              <div className="flex items-baseline gap-2">
                <span className="chrome-text text-5xl sm:text-6xl font-black leading-none">
                  {years}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted">
                  {years === "1" ? "Year" : "Years"}
                </span>
              </div>
            ) : (
              <span />
            )}
            {pkg.featured && (
              <span className="chrome-chip shrink-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
          </div>
        )}
        <h3 className="text-lg font-semibold">{pkg.name}</h3>
        <p className="text-sm text-muted mt-1.5">{pkg.tagline}</p>

        <ul className="mt-4 space-y-1.5 flex-1">
          {pkg.features.map((f) => (
            <li key={f} className="text-sm text-muted flex gap-2">
              <span className="text-accent shrink-0">&#10003;</span>
              {f}
            </li>
          ))}
        </ul>

        <PackageDetails pkg={pkg} />

        <div className="mt-6 pt-5 border-t border-border">
          <PackagePrices pkg={pkg} />
          <div className="mt-3 flex flex-wrap gap-2">
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
          <Link
            href={`/booking?service=${categorySlug}&package=${pkg.slug}`}
            className="chrome-btn w-full text-center inline-block mt-5 px-5 py-3 rounded-lg font-bold"
          >
            Book This
          </Link>
        </div>
      </div>
    </div>
  );
}
