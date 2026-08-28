"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCategory, getFaqs, priceForSize, Package, VehicleSize } from "@/data/catalog";
import { tintLevels } from "@/data/tintLevels";
import { filmTypes } from "@/data/filmTypes";
import ServiceHero from "@/components/ServiceHero";
import TintVisualizer from "@/components/TintVisualizer";
import TintCoverageSelector from "@/components/TintCoverageSelector";
import TintVehicleSelector from "@/components/TintVehicleSelector";
import TintFilmTypeSelector from "@/components/TintFilmTypeSelector";
import TintStepSection from "@/components/TintStepSection";
import FadeIn from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import StatCallouts from "@/components/StatCallouts";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import ServiceGallery from "@/components/ServiceGallery";
import SectionHeading from "@/components/SectionHeading";
import DiamondDivider from "@/components/DiamondDivider";

const category = getCategory("window-tinting")!;

// One photo per benefit card, in the same order as category.benefits
// (Heat & UV rejection, More privacy, A finished look).
const benefitImages = [
  "/services/tint-benefit-heat-uv.jpg",
  "/services/tint-benefit-privacy.jpg",
  "/services/tint-benefit-finished-look.jpg",
];

export default function WindowTintingClient() {
  const [level, setLevel] = useState(tintLevels.find((l) => l.value === 35)!);
  const [isTesla, setIsTesla] = useState(false);
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>("sedan");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [pkg, setPkg] = useState<Package>(category.packages[0]);
  const [filmType, setFilmType] = useState(filmTypes[1]); // Diamond Ceramic RX, most popular

  const price = priceForSize(pkg, vehicleSize);
  const bookingHref = `/booking?service=${category.slug}&package=${pkg.slug}&tint=${level.value}&film=${filmType.slug}&tesla=${isTesla ? "1" : "0"}&vehicleSize=${vehicleSize}&vehicleInfo=${encodeURIComponent(vehicleInfo)}`;

  return (
    <div>
      <ServiceHero
        eyebrow="Window Tinting"
        title="Cooler, Darker, Better Protected."
        tagline="Ceramic film that blocks up to 95% of infrared heat and over 99% of UV rays — precision-cut and installed to last."
        video="/video/window-tinting.mp4"
        image="/services/window-tinting-hero.webp"
      />

      {/* ---- Configurator: light block, one band per step ---- */}
      <div className="bg-white text-neutral-900">
        <section className="mx-auto max-w-3xl px-6 pt-14 sm:pt-20 pb-2 text-center">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-500">
            Build Your Tint
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 text-balance">
            Four steps to your <span className="chrome-text-dark">exact</span> tint.
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 mt-4">
            Your vehicle, your shade, your coverage, your film. The price updates as you go.
          </p>
        </section>

        <TintStepSection
          step={1}
          totalSteps={4}
          title="Tell Us Your Vehicle"
          subtitle="We use it to price your tint and show the right preview."
        >
          <TintVehicleSelector
            vehicleSize={vehicleSize}
            setVehicleSize={setVehicleSize}
            vehicleInfo={vehicleInfo}
            setVehicleInfo={setVehicleInfo}
            isTesla={isTesla}
            setIsTesla={setIsTesla}
          />
        </TintStepSection>

        <TintStepSection
          step={2}
          totalSteps={4}
          title="Choose Your Tint Level"
          subtitle="Preview how each shade looks before you book."
        >
          <TintVisualizer level={level} setLevel={setLevel} vehicleSize={vehicleSize} />
        </TintStepSection>

        <TintStepSection
          step={3}
          totalSteps={4}
          title="Choose Your Coverage"
          subtitle="Pick how much glass you want covered."
        >
          <TintCoverageSelector vehicleSize={vehicleSize} pkg={pkg} setPkg={setPkg} />
        </TintStepSection>

        <TintStepSection
          step={4}
          totalSteps={4}
          title="Choose Your Film Type"
          subtitle="Every shade above is available in each of these three films. Tap a card to see what it does."
        >
          <TintFilmTypeSelector filmType={filmType} setFilmType={setFilmType} />
        </TintStepSection>

        {/* Payoff: everything chosen above, resolved into one price */}
        <section className="border-t-2 border-neutral-300 bg-neutral-100">
          <div className="mx-auto max-w-4xl px-6 py-14 sm:py-24">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-900 px-6 py-10 sm:px-10 sm:py-12 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_-20%,rgba(236,238,240,0.16),transparent_70%)]"
              />
              <div className="relative">
                {/* This names the whole card, but it used to be set in exactly
                    the same faint eyebrow style as "Starting From" below —
                    which labels a single field. With both at the same weight
                    nothing marked one as the heading, and the card's title was
                    the easiest thing on it to miss. Promote it to a chip and
                    give it a rule to sit above, borrowing the hairline-plus-
                    brand-mark idiom from DiamondDivider so it reads as part of
                    the same system. "Starting From" deliberately stays an
                    eyebrow: the difference between them is now what tells you
                    which is the card's title and which is a field label. */}
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                    {/* Inline rather than the logo image: next/image lazy-loads,
                        and a 14px decorative mark that pops in late (or not at
                        all) is worse than no mark. This also takes its colour
                        from the chip, so it stays in the silver palette. */}
                    <svg
                      viewBox="0 0 10 10"
                      width="9"
                      height="9"
                      aria-hidden
                      className="shrink-0 fill-current opacity-80"
                    >
                      <path d="M5 0l5 5-5 5-5-5z" />
                    </svg>
                    Your Selection
                  </span>
                </div>
                <div
                  aria-hidden
                  className="mt-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <p className="text-2xl sm:text-4xl font-bold text-white mt-6 text-balance">
                  {level.label} tint &middot; {pkg.name}
                </p>
                <p className="text-sm sm:text-base text-white/60 mt-2">
                  {filmType.name} &middot; {isTesla ? "Tesla" : "Standard vehicle"}
                </p>

                <p className="text-[10px] uppercase tracking-[0.25em] text-white/55 mt-8">
                  Starting From
                </p>
                <p className="chrome-text text-5xl sm:text-6xl font-black leading-none mt-2">
                  ${price}
                </p>

                <Link
                  href={bookingHref}
                  className="chrome-btn inline-block mt-8 px-8 py-3.5 rounded-lg font-bold text-base"
                >
                  Book This &rarr;
                </Link>

                {filmType.slug !== "diamond-smoke" && (
                  <p className="text-xs text-white/55 mt-5">
                    Film upgrade priced separately — we&apos;ll confirm your exact total.
                  </p>
                )}
              </div>
            </div>

            <p className="mt-6 text-sm text-neutral-500 text-center max-w-2xl mx-auto">
              Tesla vehicles use different glass and film-application techniques. The price above
              reflects our standard install — we&apos;ll confirm with you before your appointment if
              Tesla glass changes that total.
            </p>
          </div>
        </section>
      </div>

      {/* ---- Learn more: back on dark so it reads as a separate part of the page.
           Hard edge (no gradient) so the switch from light to dark is a clean cut. ---- */}
      <section className="mx-auto max-w-4xl px-6 pt-16 sm:pt-24 pb-14 sm:pb-20 text-center">
        <FadeIn>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted">
            What It Is
          </span>
          <p className="text-lg sm:text-2xl mt-4 leading-relaxed text-balance">
            {category.valueProp}
          </p>
        </FadeIn>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-6xl px-6 pb-14 sm:pb-20">
        <FadeIn>
          <SectionHeading title="Why It's" accent="Worth It" className="mb-8 sm:mb-10" />
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {category.benefits.map((b, i) => (
            <StaggerItem key={b.title}>
              <div className="card-lift h-full bg-surface border border-border rounded-xl overflow-hidden">
                <div className="relative aspect-[4/3] bg-surface-2">
                  <Image
                    src={benefitImages[i]}
                    alt={b.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="text-sm text-muted mt-2">{b.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
        {category.stats && (
          <FadeIn>
            <div className="mt-4 sm:mt-5">
              <StatCallouts stats={category.stats} />
            </div>
          </FadeIn>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-14 sm:pb-20">
        <FadeIn>
          <SectionHeading title="How It" accent="Works" className="mb-8 sm:mb-10" />
        </FadeIn>
        <div className="space-y-4">
          {category.process.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.06}>
              <div className="flex gap-4 bg-surface border border-border rounded-xl p-5">
                <span className="shrink-0 w-9 h-9 rounded-full bg-surface-2 border border-border flex items-center justify-center text-sm font-bold chrome-text">
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

      <DiamondDivider />

      <section className="mx-auto max-w-3xl px-6 pb-14 sm:pb-20">
        <FadeIn>
          <SectionHeading title="Common" accent="Questions" className="mb-8 sm:mb-10" />
          <FaqAccordion items={getFaqs(category)} />
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
        <FadeIn>
          <SectionHeading title="From Recent" accent="Jobs" className="mb-8 sm:mb-10" />
        </FadeIn>
        <ServiceGallery images={category.galleryImages} />
      </section>
    </div>
  );
}
