import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import WorkGallery from "@/components/WorkGallery";
import SectionHeading from "@/components/SectionHeading";
import CtaCard from "@/components/CtaCard";
import DiamondDivider from "@/components/DiamondDivider";

export const metadata: Metadata = {
  title: "Our Work",
  description: "A look at recent detailing jobs from Diamond Clean Detail, straight from real customers.",
};

export default function OurWorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <FadeIn>
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Portfolio"
          title="Our"
          accent="Work"
          subtitle="A look at recent jobs, straight from real customers. Tap any photo to see it full size."
          className="mb-8 sm:mb-12"
        />
      </FadeIn>

      <DiamondDivider />

      <WorkGallery />

      <div className="mt-16 sm:mt-24">
        <FadeIn>
          <CtaCard
            eyebrow="Ready When You Are"
            title="Want Yours to Look"
            accent="Like This?"
            subtitle="Compare packages, preview your options, and book online in minutes."
            href="/services"
            cta="View Services →"
          />
        </FadeIn>
      </div>
    </div>
  );
}
