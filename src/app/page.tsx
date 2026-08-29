import Link from "next/link";
import Hero from "@/components/Hero";
import FadeIn from "@/components/FadeIn";
import ServiceMosaic from "@/components/ServiceMosaic";
import MarquesStrip from "@/components/MarquesStrip";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Testimonials from "@/components/Testimonials";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import DiamondDivider from "@/components/DiamondDivider";
import SectionHeading from "@/components/SectionHeading";
import CtaCard from "@/components/CtaCard";
import HelpNudge from "@/components/HelpNudge";

/** A whole-card link to a service you configure rather than just read about. */
function PreviewCard({
  href,
  title,
  accent,
  body,
  cta,
}: {
  href: string;
  title: string;
  accent: string;
  body: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="card-lift group relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 bg-surface border border-border rounded-2xl px-6 py-7 sm:px-8 sm:py-10"
    >
      <div>
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">
          Interactive Preview
        </span>
        <h2 className="text-xl sm:text-3xl font-bold mt-2">
          {title} — <span className="chrome-text">{accent}</span>
        </h2>
        <p className="text-sm sm:text-base text-muted mt-2 max-w-lg">{body}</p>
      </div>
      <span className="chrome-btn shrink-0 px-6 py-3 rounded-lg font-semibold whitespace-nowrap text-sm sm:text-base">
        {cta} &rarr;
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <div>
      <Hero />

      <MarquesStrip />

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
        <HelpNudge label="Not sure where to start?" className="max-w-2xl mx-auto" />
      </section>

      {/* The two services you can see before you buy. Both pages open on a
          configurator, so they earn a card apiece rather than sitting in the
          grid above with the services you simply book. */}
      <section className="mx-auto max-w-6xl px-6 pb-12 sm:pb-24 grid gap-4 sm:gap-5">
        <FadeIn>
          <PreviewCard
            href="/window-tinting"
            title="Window Tinting"
            accent="See It Before You Book"
            body="Preview real tint shades on an actual vehicle, then book the darkness that fits you. Tesla pricing handled separately."
            cta="Preview Tints"
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <PreviewCard
            href="/services/paint-protection-film"
            title="Paint Protection Film"
            accent="See What's Covered"
            body="Step through each coverage level on the car and watch the protected panels light up, so you know exactly what you're paying to cover."
            cta="Preview Coverage"
          />
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
