import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import SectionHeading from "@/components/SectionHeading";
import CtaCard from "@/components/CtaCard";
import DiamondDivider from "@/components/DiamondDivider";

export const metadata: Metadata = {
  title: "About Us",
  description: "Who's behind Diamond Clean Detail, and what we're building it around.",
};

const values = [
  {
    title: "Every panel, done right",
    description: "No shortcuts on prep, no rushing a job just to move to the next one.",
  },
  {
    title: "Real availability, real pricing",
    description: "What you see online is what you get — no surprise upsells at your door.",
  },
  {
    title: "We come to you",
    description: "A fully equipped mobile setup, wherever your car is parked.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-6 pt-10 sm:pt-16 pb-10 sm:pb-16 text-center">
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="About Us"
            title="Built Around the"
            accent="Details"
            subtitle="Diamond Clean Detail brings premium mobile detailing, protection, and tinting to the Denver Metro Area — built to feel like a dealership-level experience, wherever your car is parked."
          />
        </FadeIn>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          {/* No portrait, by request — the section is carried by the words and
              the signature instead, kept to a letter's width so it still reads
              as a note from a person rather than a stretched block of copy. */}
          <div className="mx-auto max-w-2xl">
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">Who We Are</span>
              <h2 className="text-xl sm:text-2xl font-semibold mt-2">Owned and operated by Farhan</h2>
              <p className="text-muted mt-3 leading-relaxed max-w-[52ch]">
                Diamond Clean Detail is a Denver-based mobile detailing business, built on the idea that
                getting your car detailed shouldn&apos;t mean giving up your whole day. We bring the shop to
                you — same attention to detail, none of the drop-off hassle.
              </p>

              {/* Signed, the way a letter is. It is set in the wordmark's own
                  script rather than a second handwriting face, so it reads as
                  the same hand that signs the logo. */}
              <div className="mt-8 pt-6 border-t border-border">
                {/* Scales with the viewport rather than stepping at a
                    breakpoint: a script face is wide, and at a fixed 30px the
                    name measured 327px against 327px of usable width — exact
                    on a 375px phone and over the edge on anything narrower. */}
                <p className="font-wordmark text-[clamp(20px,6.4vw,36px)] leading-[1.35] pb-1">
                  Farhan Yackub
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted mt-1">
                  Owner · Diamond Clean Detail
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <SectionHeading title="What We" accent="Stand For" className="mb-8 sm:mb-10" />
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {values.map((v) => (
            <StaggerItem key={v.title}>
              <div className="h-full bg-surface border border-border rounded-xl p-5">
                <h3 className="font-semibold">{v.title}</h3>
                <p className="text-sm text-muted mt-2">{v.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          {/* Landscape here, portrait above. A working shot is a wide subject
              and a person is a tall one, so forcing both into one square made
              each of them wrong and stacked two near-identical mirrored blocks
              on the same page. The column steps up with the viewport rather
              than sitting at one fixed width: 440px ate two thirds of the row
              on a small laptop and squeezed the paragraph into three-word
              lines. */}
          <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-8 sm:gap-12 items-center">
            <div className="sm:order-2 relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-border">
              <Image
                src="/services/our-fleet.webp"
                alt="The Diamond Clean Detail fleet — three fully stocked mobile detailing vans at dusk"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 300px, 100vw"
              />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">The Goal</span>
              <h2 className="text-xl sm:text-2xl font-semibold mt-2">More than a car wash</h2>
              <p className="text-muted mt-3 leading-relaxed max-w-[46ch]">
                Paint correction, ceramic coatings, PPF, and tint — done with the kind of care usually
                reserved for a handful of cars in a shop, brought to every car we work on.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 sm:pb-24 text-center">
        <FadeIn>
          <CtaCard
            eyebrow="Ready When You Are"
            title="See What We Can Do for"
            accent="Your Car"
            subtitle="Compare packages, preview your options, and book online in minutes."
            href="/services"
            cta="View Services →"
          />
        </FadeIn>
      </section>
    </div>
  );
}
