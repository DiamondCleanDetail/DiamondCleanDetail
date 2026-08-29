import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getFaqs, priceForSize, formatPrice, type Package } from "@/data/catalog";
import ServiceHero from "@/components/ServiceHero";
import FadeIn from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import SectionHeading from "@/components/SectionHeading";
import CtaCard from "@/components/CtaCard";
import PackagePrices from "@/components/PackagePrices";
import DiamondDivider from "@/components/DiamondDivider";
import { serviceArea } from "@/data/serviceArea";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

const category = getCategory("maintenance-plans");

export const metadata: Metadata = category
  ? {
      title: category.name,
      description: category.summary,
      openGraph: { title: category.name, description: category.summary },
    }
  : {};

/** Visits per month, per plan. Used only to show what a month costs at each
 * cadence — the site charges per visit, so this is arithmetic for the reader,
 * not a billing plan. Bi-weekly is counted as two, not 2.17: a defensible
 * round number beats a precise one nobody can check against their card. */
const visitsPerMonth: Record<string, number> = {
  "monthly-maintenance": 1,
  "biweekly-maintenance": 2,
};

const whoItsFor = [
  {
    title: "You drive it every day",
    description:
      "A commuter picks up road film, brake dust and interior crumbs faster than anything else. Little and often keeps ahead of it.",
  },
  {
    title: "You've had the big job done",
    description:
      "A coating or a correction is worth protecting. Regular, careful washing is what keeps that finish looking the way it did on day one.",
  },
  {
    title: "You'd rather not think about it",
    description:
      "The car gets looked after on a rhythm you set, at a rate you already know, without deciding all over again each time.",
  },
];

export default function MaintenancePlansPage() {
  if (!category) notFound();

  return (
    <div>
      <ServiceHero
        eyebrow={category.shortName}
        title="Clean On A Rhythm, Not A Whim."
        tagline={category.tagline}
        video={category.heroVideo}
        image={category.heroImage}
      />

      <section className="mx-auto max-w-5xl px-6 pt-14 sm:pt-20 pb-12 sm:pb-16">
        <FadeIn>
          <SectionHeading
            eyebrow="Two Cadences"
            title="Pick How Often We"
            accent="Come Out"
            subtitle="Both run the same visit — a proper hand wash and a full vacuum, at your place. The only difference is how often, and the rate you pay per visit."
            className="mb-8 sm:mb-12"
          />
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {category.packages.map((pkg) => (
            <StaggerItem key={pkg.slug}>
              <PlanCard pkg={pkg} categorySlug={category.slug} />
            </StaggerItem>
          ))}
        </StaggerGrid>
        {/* Said plainly, because the alternative is someone expecting a full
            detail for $35 and being disappointed on the driveway. */}
        <FadeIn>
          <p className="text-sm text-muted text-center mt-8 max-w-2xl mx-auto">
            A member visit is upkeep, not a full detail. It keeps a clean car clean — it
            isn&apos;t the deep interior clean or the paint correction, and those stay available
            as one-off bookings whenever you want one.
          </p>
        </FadeIn>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading
            eyebrow="Every Visit"
            title="What You"
            accent="Get"
            className="mb-8 sm:mb-12"
          />
        </FadeIn>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          <FadeIn>
            <div className="h-full bg-surface border border-border rounded-xl p-6">
              <h3 className="font-semibold">Included every time</h3>
              <ul className="mt-4 space-y-2">
                {category.packages[0]?.features.map((f) => (
                  <li key={f} className="text-sm text-muted flex gap-2">
                    <span className="text-accent shrink-0">&#10003;</span>
                    {f}
                  </li>
                ))}
                <li className="text-sm text-muted flex gap-2">
                  <span className="text-accent shrink-0">&#10003;</span>
                  We bring water, power and everything else — nothing needed from you
                </li>
              </ul>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="h-full bg-surface border border-border rounded-xl p-6">
              <h3 className="font-semibold">Not included</h3>
              <ul className="mt-4 space-y-2">
                {category.packages[0]?.excludes?.map((f) => (
                  <li key={f} className="text-sm text-muted flex gap-2">
                    <span className="text-muted/60 shrink-0">&times;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted/80 mt-4">
                Book any of these as a one-off whenever you need it — members get their
                add-on discount on top.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading title="Who It's" accent="For" className="mb-8 sm:mb-12" />
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {whoItsFor.map((w) => (
            <StaggerItem key={w.title}>
              <div className="h-full bg-surface border border-border rounded-xl p-5">
                <h3 className="font-semibold">{w.title}</h3>
                <p className="text-sm text-muted mt-2">{w.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading title="How It" accent="Works" className="mb-8 sm:mb-12" />
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {category.process.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="h-full bg-surface border border-border rounded-xl p-6">
                <span className="chrome-text text-3xl font-black">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold mt-3">{step.title}</h3>
                <p className="text-sm text-muted mt-2">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
        <FadeIn>
          <p className="text-sm text-muted text-center mt-8">
            We work weekends across the {serviceArea.region}, and members get first pick of the
            slots.
          </p>
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
            title="Start Your"
            accent="Plan"
            subtitle="Book your first visit at the member rate and set the rhythm from there."
            href={`/booking?service=${category.slug}`}
            cta="Book Now →"
          />
        </FadeIn>
      </section>
    </div>
  );
}

function PlanCard({ pkg, categorySlug }: { pkg: Package; categorySlug: string }) {
  const perVisit = priceForSize(pkg, "sedan");
  const perMonth = perVisit ? perVisit * (visitsPerMonth[pkg.slug] ?? 1) : null;

  return (
    <div className="card-lift h-full flex flex-col bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-xl font-bold">{pkg.name}</h3>
      <p className="text-sm text-muted mt-1.5">{pkg.tagline}</p>

      {/* The monthly figure is the honest headline for a plan, but the site
          charges per visit, so the per-visit price stays the one in the price
          table below and this is explicitly "about". */}
      {perMonth !== null && (
        <p className="text-sm text-muted mt-4">
          Around{" "}
          <span className="chrome-text text-2xl font-black align-middle">
            {formatPrice(perMonth)}
          </span>{" "}
          a month for a sedan, paid per visit.
        </p>
      )}

      <ul className="mt-5 space-y-1.5 flex-1">
        {pkg.features.map((f) => (
          <li key={f} className="text-sm text-muted flex gap-2">
            <span className="text-accent shrink-0">&#10003;</span>
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-5 border-t border-border">
        <PackagePrices pkg={pkg} />
        {pkg.durationMinutes && (
          <p className="text-xs text-muted mt-3">&#9201; About {pkg.durationMinutes} minutes on site</p>
        )}
        <Link
          href={`/booking?service=${categorySlug}&package=${pkg.slug}`}
          className="chrome-btn w-full text-center inline-block mt-5 px-5 py-3 rounded-lg font-bold"
        >
          Book This
        </Link>
      </div>
    </div>
  );
}
