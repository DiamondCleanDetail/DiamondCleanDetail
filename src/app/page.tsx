import Link from "next/link";
import Hero from "@/components/Hero";
import FadeIn from "@/components/FadeIn";
import ServiceMosaic from "@/components/ServiceMosaic";
import PartnerStrip from "@/components/PartnerStrip";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Testimonials from "@/components/Testimonials";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import DiamondDivider from "@/components/DiamondDivider";
import SectionHeading from "@/components/SectionHeading";
import CtaCard from "@/components/CtaCard";

export default function Home() {
  return (
    <div>
      <Hero />

      <PartnerStrip />

      <section className="mx-auto max-w-6xl px-6 pt-12 sm:pt-20 pb-12 sm:pb-24">
        <FadeIn>
          <SectionHeading
            eyebrow="What We Do"
            title="Services We"
            accent="Offer"
            className="mb-8 sm:mb-12"
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <ServiceMosaic />
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12 sm:pb-24">
        <FadeIn>
          <Link
            href="/window-tinting"
            className="card-lift group relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 bg-surface border border-border rounded-2xl px-6 py-7 sm:px-8 sm:py-10"
          >
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">
                Interactive Preview
              </span>
              <h2 className="text-xl sm:text-3xl font-bold mt-2">
                Window Tinting — <span className="chrome-text">See It Before You Book</span>
              </h2>
              <p className="text-sm sm:text-base text-muted mt-2 max-w-lg">
                Preview real tint shades on an actual vehicle, then book the
                darkness that fits you. Tesla pricing handled separately.
              </p>
            </div>
            <span className="chrome-btn shrink-0 px-6 py-3 rounded-lg font-semibold whitespace-nowrap text-sm sm:text-base">
              Preview Tints &rarr;
            </span>
          </Link>
        </FadeIn>
      </section>

      <DiamondDivider />
      <BeforeAfterGallery />
      <DiamondDivider />
      <Testimonials />
      <ServiceAreaMap />

      <section className="mx-auto max-w-4xl px-6 pb-16 sm:pb-24">
        <FadeIn>
          <CtaCard
            eyebrow="Ready When You Are"
            title="Let's Get Your Car"
            accent="Looking New"
            subtitle="Compare packages, preview your options, and book online in minutes — we come to you."
            href="/services"
            cta="View Services →"
          />
        </FadeIn>
      </section>
    </div>
  );
}
