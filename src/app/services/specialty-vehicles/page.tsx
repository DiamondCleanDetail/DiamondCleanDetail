import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getFaqs } from "@/data/catalog";
import { specialtyVehicleBreakdown } from "@/data/specialtyVehicles";
import ServiceGallery from "@/components/ServiceGallery";
import ServiceHero from "@/components/ServiceHero";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import CtaCard from "@/components/CtaCard";
import FaqAccordion from "@/components/FaqAccordion";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

const category = getCategory("specialty-vehicles");

export const metadata: Metadata = category
  ? {
      title: category.name,
      description: category.summary,
      openGraph: { title: category.name, description: category.summary },
    }
  : {};

export default function SpecialtyVehiclesPage() {
  if (!category) notFound();

  return (
    <div>
      <ServiceHero
        eyebrow={category.shortName}
        title={category.name}
        tagline={category.tagline}
        image={category.heroImage}
        mobileImage={category.heroImageMobile}
      />

      {/* Value proposition */}
      <section className="mx-auto max-w-4xl px-6 pt-10 sm:pt-16 pb-10 sm:pb-16 text-center">
        <FadeIn>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">What It Is</span>
          <p className="text-lg sm:text-xl mt-3 leading-relaxed">{category.valueProp}</p>
        </FadeIn>
      </section>

      {/* Why It's Worth It */}
      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <SectionHeading title="Why It's" accent="Worth It" className="mb-8 sm:mb-10" />
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

      {/* Per-vehicle-type breakdown — the core of this page */}
      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <SectionHeading
            eyebrow="What's Involved"
            title="Built for Every"
            accent="Vehicle Type"
            subtitle="RVs, boats, and aircraft each demand a different process, different products, and a different amount of time. Here's exactly what goes into each one."
            className="mb-10 sm:mb-14"
          />
        </FadeIn>

        <div className="space-y-16 sm:space-y-24">
          {specialtyVehicleBreakdown.map((v, i) => (
            <FadeIn key={v.slug}>
              <div
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[4/3] bg-white border border-border rounded-2xl overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-contain ${v.imagePosition ?? "object-center"} ${v.imagePadding ?? "p-6 sm:p-10"}`}
                  />
                </div>

                <div>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">
                    {v.eyebrow}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-2">{v.name}</h3>
                  <p className="text-muted mt-2">{v.tagline}</p>
                  <p className="inline-block text-xs font-medium text-muted mt-4 px-3 py-1.5 rounded-full bg-surface-2 border border-border">
                    &#9201; {v.timeOnSite}
                  </p>
                  <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    {v.services.map((s) => (
                      <li key={s} className="text-sm text-muted flex gap-2">
                        <span className="text-accent shrink-0">&#10003;</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/booking?service=${category.slug}&package=${v.packageSlug}`}
                    className="chrome-btn inline-block mt-6 px-6 py-3 rounded-lg font-semibold text-sm"
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* How It Works */}
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
            subtitle="Every job is quoted individually — tell us what you've got and we'll take it from there."
            href={`/booking?service=${category.slug}`}
            cta="Request a Quote →"
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
