import Link from "next/link";
import Hero from "@/components/Hero";
import FadeIn from "@/components/FadeIn";
import ServiceMosaic from "@/components/ServiceMosaic";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Testimonials from "@/components/Testimonials";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import DiamondDivider from "@/components/DiamondDivider";

export default function Home() {
  return (
    <div>
      <Hero />

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

      <section className="mx-auto max-w-6xl px-6 pb-12 sm:pb-24">
        <FadeIn>
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-center mb-6 sm:mb-10">
            Passion For Paint Protection <span className="chrome-text">In Denver</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <ServiceMosaic />
        </FadeIn>
      </section>

      <DiamondDivider />
      <BeforeAfterGallery />
      <DiamondDivider />
      <Testimonials />
      <ServiceAreaMap />
    </div>
  );
}
