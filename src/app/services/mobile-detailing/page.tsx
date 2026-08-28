import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getFaqs, priceLabel } from "@/data/catalog";
import ServiceHero from "@/components/ServiceHero";
import ServiceGallery from "@/components/ServiceGallery";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import FadeIn from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import SectionHeading from "@/components/SectionHeading";
import CtaCard from "@/components/CtaCard";
import MembershipCard from "@/components/MembershipCard";
import MoreServices from "@/components/MoreServices";
import DiamondDivider from "@/components/DiamondDivider";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

const category = getCategory("mobile-detailing");

export const metadata: Metadata = category
  ? {
      title: category.name,
      description: category.summary,
      openGraph: { title: category.name, description: category.summary },
    }
  : {};

/** Mobile detailing gets its own page rather than the shared service
 * template: it's the flagship service, so it leads with packages and real
 * work instead of an explainer, and carries the membership offer. */
export default function MobileDetailingPage() {
  if (!category) notFound();

  const headlinePhotos = (category.galleryImages ?? []).slice(0, 6);

  return (
    <div>
      <ServiceHero
        eyebrow={category.shortName}
        title="Detailing That Comes to You."
        tagline="Hand-washed, deep-cleaned, and finished on your driveway — booked online in about a minute."
        video={category.heroVideo}
        image={category.heroImage}
      />

      {/* Book first: packages up top, before any explanation. */}
      <section className="mx-auto max-w-6xl px-6 pt-14 sm:pt-20 pb-12 sm:pb-16">
        <FadeIn>
          <SectionHeading
            eyebrow="Book a Detail"
            title="Pick Your"
            accent="Package"
            subtitle="Real pricing for a sedan — larger vehicles priced at checkout. Pay online, no call needed."
            className="mb-8 sm:mb-12"
          />
        </FadeIn>
        <StaggerGrid className="grid md:grid-cols-3 gap-4 sm:gap-5">
          {category.packages.map((pkg) => (
            <StaggerItem key={pkg.slug}>
              <div
                className={`card-lift relative h-full flex flex-col bg-surface border rounded-2xl overflow-hidden ${
                  pkg.featured ? "border-accent" : "border-border"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute top-4 right-4 z-10 chrome-chip text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <p className="text-sm text-muted mt-2">{pkg.tagline}</p>
                  <ul className="mt-4 space-y-1.5 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="text-sm text-muted flex gap-2">
                        <span className="text-accent shrink-0">&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-border">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted">Starting From</p>
                    <p className="chrome-text text-4xl font-black leading-tight mt-1">
                      {priceLabel(pkg, "sedan").replace(/^From /, "")}
                    </p>
                    {pkg.durationMinutes && (
                      <p className="text-xs text-muted mt-2">
                        ~{Math.round(pkg.durationMinutes / 60)} hr
                        {pkg.depositPercent ? ` · ${pkg.depositPercent}% deposit at booking` : ""}
                      </p>
                    )}
                    <Link
                      href={`/booking?service=${category.slug}&package=${pkg.slug}`}
                      className="chrome-btn w-full text-center inline-block mt-5 px-5 py-3 rounded-lg font-bold"
                    >
                      Book This
                    </Link>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <DiamondDivider />

      {/* Proof: real cars, big and up front. */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading
            eyebrow="Recent Work"
            title="Cars We've"
            accent="Detailed"
            className="mb-8 sm:mb-12"
          />
        </FadeIn>
        <StaggerGrid className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {headlinePhotos.map((img) => (
            <StaggerItem key={img.src}>
              <div className="card-lift group relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-2 border border-border">
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2.5">
                  <p className="text-xs text-white/90">{img.caption}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
        <FadeIn>
          <div className="text-center mt-8">
            <Link
              href="/our-work"
              className="inline-block px-6 py-3 rounded-lg font-semibold border border-border bg-surface hover:border-muted transition-colors"
            >
              See All Our Work &rarr;
            </Link>
          </div>
        </FadeIn>
      </section>

      <DiamondDivider />

      {/* Membership — the recurring option, in front of people choosing a detail. */}
      <section className="mx-auto max-w-4xl px-6 py-12 sm:py-20">
        <FadeIn>
          <MembershipCard />
        </FadeIn>
      </section>

      <DiamondDivider />

      {/* How it works — short, three steps. */}
      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading title="How It" accent="Works" className="mb-8 sm:mb-12" />
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {category.process.slice(0, 3).map((step, i) => (
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
      </section>

      <DiamondDivider />

      {/* Why it's worth it */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading title="Why It's" accent="Worth It" className="mb-8 sm:mb-12" />
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {category.benefits.map((b, i) => {
            const image = category.benefitImages?.[i];
            return (
              <StaggerItem key={b.title}>
                <div className="card-lift h-full bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="relative aspect-[4/3] bg-surface-2">
                    {image ? (
                      <Image
                        src={image}
                        alt={b.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-xs text-muted">Photo coming soon</p>
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
      </section>

      <DiamondDivider />

      {/* What it is — deliberately far down now. */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <FadeIn>
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 items-center">
            {category.beforeAfter && (
              <BeforeAfterSlider
                before={category.beforeAfter.before}
                after={category.beforeAfter.after}
                beforeLabel={category.beforeAfter.beforeLabel}
                afterLabel={category.beforeAfter.afterLabel}
              />
            )}
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted">
                What It Is
              </span>
              <p className="text-lg sm:text-xl mt-4 leading-relaxed">{category.valueProp}</p>
            </div>
          </div>
        </FadeIn>
      </section>

      <DiamondDivider />

      {/* Cross-sell */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <FadeIn>
          <SectionHeading
            eyebrow="More Services"
            title="Beyond the"
            accent="Detail"
            className="mb-8 sm:mb-12"
          />
        </FadeIn>
        <MoreServices excludeSlug={category.slug} />
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
            accent="Detail"
            subtitle="Pick a package, choose a time, and pay online in minutes — we come to you."
            href={`/booking?service=${category.slug}`}
            cta="Book Now →"
          />
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
        <FadeIn>
          <SectionHeading title="From Recent" accent="Jobs" className="mb-8 sm:mb-12" />
          <ServiceGallery images={category.galleryImages} />
        </FadeIn>
      </section>
    </div>
  );
}
