import Link from "next/link";
import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

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
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">About Us</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3">Built Around the Details</h1>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            Diamond Clean Detail brings premium mobile detailing, protection, and tinting to the Denver Metro
            Area — built to feel like a dealership-level experience, wherever your car is parked.
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 items-center">
            <div className="aspect-square w-full max-w-[380px] mx-auto rounded-xl bg-gradient-to-br from-surface-2 to-surface border border-border flex items-center justify-center">
              <p className="text-sm text-muted text-center px-6">Photo coming soon — Farhan</p>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">Who We Are</span>
              <h2 className="text-xl sm:text-2xl font-semibold mt-2">Owned and operated by Farhan</h2>
              <p className="text-muted mt-3 leading-relaxed">
                Diamond Clean Detail is a Denver-based mobile detailing business, built on the idea that
                getting your car detailed shouldn&apos;t mean giving up your whole day. We bring the shop to
                you — same attention to detail, none of the drop-off hassle.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">What We Stand For</h2>
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {values.map((v, i) => (
            <StaggerItem key={v.title}>
              <div className="h-full bg-surface border border-border rounded-xl p-5">
                <span className="chrome-text text-3xl font-black">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-semibold mt-3">{v.title}</h3>
                <p className="text-sm text-muted mt-2">{v.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
        <FadeIn>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 items-center">
            <div className="sm:order-2 aspect-square w-full max-w-[380px] mx-auto rounded-xl bg-gradient-to-br from-surface-2 to-surface border border-border flex items-center justify-center">
              <p className="text-sm text-muted text-center px-6">Photo coming soon — On the job</p>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">The Goal</span>
              <h2 className="text-xl sm:text-2xl font-semibold mt-2">More than a car wash</h2>
              <p className="text-muted mt-3 leading-relaxed">
                Paint correction, ceramic coatings, PPF, and tint — done with the kind of care usually
                reserved for a handful of cars in a shop, brought to every car we work on.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 sm:pb-24 text-center">
        <FadeIn>
          <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold">See What We Can Do for Your Car</h2>
            <p className="text-sm sm:text-base text-muted mt-2">
              Compare packages, preview your options, and book online in minutes.
            </p>
            <Link href="/services" className="chrome-btn inline-block mt-5 px-6 py-3 rounded-lg font-semibold">
              View Services
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
