"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addOnPrice, getCategory, getFaqs, resolveLinePrice, Package, VehicleSize } from "@/data/catalog";
import { tintLevels } from "@/data/tintLevels";
import { filmTypes } from "@/data/filmTypes";
import { teslaPriceForPackage, teslaModelFromVehicleInfo } from "@/data/teslaTint";
import ServiceHero from "@/components/ServiceHero";
import TintVisualizer from "@/components/TintVisualizer";
import TintCoverageSelector from "@/components/TintCoverageSelector";
import TintVehicleSelector from "@/components/TintVehicleSelector";
import TintFilmTypeSelector from "@/components/TintFilmTypeSelector";
import TintStepSection from "@/components/TintStepSection";
import TintBuildBar from "@/components/TintBuildBar";
import HelpNudge from "@/components/HelpNudge";
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
  // Detected, not asked: picking Tesla in the vehicle step (or typing it in
  // the manual field) is the answer. The old checkbox asked twice.
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>("sedan");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const isTesla = /tesla/i.test(vehicleInfo);
  const [pkg, setPkg] = useState<Package>(category.packages[0]);
  const [filmType, setFilmType] = useState(filmTypes[1]); // Diamond Ceramic RX, most popular
  // Windshield work rides along with either coverage as add-ons, not as a
  // third mutually-exclusive tab — the old model made "full vehicle plus the
  // strip" literally unbookable.
  const [windshieldAddOns, setWindshieldAddOns] = useState<string[]>([]);

  // Switching from a Tesla to anything else must drop Tesla-only picks: the
  // totals already refused to charge for them, but the summary kept naming
  // "+ Panoramic Roof" on a car that cannot buy it.
  useEffect(() => {
    if (isTesla) return;
    setWindshieldAddOns((prev) =>
      prev.filter((slug) => !category.addOns?.find((x) => x.slug === slug)?.teslaOnly)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTesla]);

  // Not every coverage is sold on every Tesla — front-doors-only doesn't
  // exist for a Model 3 on the adopted price sheet. With the tab still
  // offered, the price fell back to the sedan figure and this page quoted
  // $189 for a job the checkout prices from $449. So the tabs are filtered
  // to what that model can actually buy, and the selection is *derived* onto
  // an available package rather than mutated — no effect, nothing to fight
  // the user's clicks.
  const teslaModel = isTesla ? teslaModelFromVehicleInfo(vehicleInfo) : null;
  const availablePackages = category.packages.filter(
    (p) => !isTesla || teslaPriceForPackage(p.slug, filmType.slug, teslaModel) !== null
  );
  const effectivePkg = availablePackages.some((p) => p.slug === pkg.slug)
    ? pkg
    : (availablePackages[0] ?? pkg);

  // A Tesla is priced on coverage x film, so the headline figure has to come
  // from the Tesla table too — otherwise this page quotes the size-based
  // price and the checkout charges a different one.
  const teslaPrice = isTesla
    ? teslaPriceForPackage(effectivePkg.slug, filmType.slug, teslaModel)
    : null;
  const addOnsTotal = (category.addOns ?? [])
    .filter((a) => windshieldAddOns.includes(a.slug) && (!a.teslaOnly || isTesla))
    .reduce(
      (n, a) =>
        n +
        addOnPrice(a, {
          isTesla,
          filmSlug: filmType.slug,
          teslaModel: teslaModelFromVehicleInfo(vehicleInfo),
        }),
      0
    );
  // Film-aware for every car now, through the same resolver the checkout
  // charges with — the number on this card is the number Stripe takes.
  const price =
    (teslaPrice?.price ??
      resolveLinePrice(effectivePkg, vehicleSize, { filmSlug: filmType.slug }) ??
      0) + addOnsTotal;
  const bookingHref = `/booking?service=${category.slug}&package=${effectivePkg.slug}&tint=${level.value}&film=${filmType.slug}&tesla=${isTesla ? "1" : "0"}&vehicleSize=${vehicleSize}&vehicleInfo=${encodeURIComponent(vehicleInfo)}${windshieldAddOns.length ? `&addons=${windshieldAddOns.join(",")}` : ""}`;

  // Composed once and used by both the summary card and the bar that carries
  // the total while you scroll, so the two can't describe the same build
  // differently.
  const chosenAddOnNames = (category.addOns ?? [])
    .filter((a) => windshieldAddOns.includes(a.slug))
    .map((a) => a.name);
  const buildHeadline = `${level.label} tint · ${effectivePkg.name}${
    chosenAddOnNames.length ? ` + ${chosenAddOnNames.join(" + ")}` : ""
  }`;

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
        <section
          id="tint-build-start"
          className="mx-auto max-w-3xl px-6 pt-14 sm:pt-20 pb-2 text-center"
        >
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
          />
        </TintStepSection>

        <TintStepSection
          step={2}
          totalSteps={4}
          title="Choose Your Tint Level"
          subtitle="Preview how each shade looks before you book."
        >
          <TintVisualizer
            level={level}
            setLevel={setLevel}
            vehicleSize={vehicleSize}
            isTesla={isTesla}
          />
        </TintStepSection>

        <TintStepSection
          step={3}
          totalSteps={4}
          title="Choose Your Coverage"
          subtitle="Pick how much glass you want covered."
        >
          <TintCoverageSelector
            vehicleSize={vehicleSize}
            packages={availablePackages}
            pkg={effectivePkg}
            setPkg={setPkg}
            isTesla={isTesla}
            filmSlug={filmType.slug}
            vehicleInfo={vehicleInfo}
            windshieldAddOns={windshieldAddOns}
            setWindshieldAddOns={setWindshieldAddOns}
          />
        </TintStepSection>

        <TintStepSection
          step={4}
          totalSteps={4}
          title="Choose Your Film Type"
          subtitle="Every shade above is available in each of these three films. Tap a card to choose yours."
        >
          <TintFilmTypeSelector filmType={filmType} setFilmType={setFilmType} />
        </TintStepSection>

        {/* Payoff: everything chosen above, resolved into one price. The id is
            also what tells the running-total bar to stand down — once this is
            on screen the bar would be the same figure twice. */}
        <section id="tint-summary" className="border-t-2 border-neutral-300 bg-neutral-100">
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
                {/* Clear (value 0) is the visualizer's comparison baseline,
                    not a shade anyone can buy — "Clear tint · Full Vehicle"
                    with a price and a Book button read as a product that
                    doesn't exist. With Clear up in step 2, this card turns
                    into the prompt to pick a real shade instead. */}
                {level.value === 0 ? (
                  <>
                    <p className="text-2xl sm:text-4xl font-bold text-white mt-6 text-balance">
                      That&apos;s the car with no tint
                    </p>
                    <p className="text-sm sm:text-base text-white/60 mt-2">
                      Clear is just the comparison view — pick a shade in step 2 to see your
                      price and book.
                    </p>
                    <button
                      type="button"
                      onClick={() => setLevel(tintLevels.find((l) => l.value === 35)!)}
                      className="chrome-btn inline-block mt-8 px-8 py-3.5 rounded-lg font-bold text-base"
                    >
                      Start With 35% &uarr;
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-2xl sm:text-4xl font-bold text-white mt-6 text-balance">
                      {level.label} tint &middot; {effectivePkg.name}
                      {windshieldAddOns.length > 0 &&
                        ` + ${(category.addOns ?? [])
                          .filter((a) => windshieldAddOns.includes(a.slug))
                          .map((a) => a.name)
                          .join(" + ")}`}
                    </p>
                    <p className="text-sm sm:text-base text-white/60 mt-2">
                      {filmType.name} &middot; {isTesla ? "Tesla" : "Standard vehicle"}
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/55 mt-8">
                      {/* Every path through the resolver is an exact quote
                          now — the only "from" left is a Model 3 whose
                          rear-window choice is still open. */}
                      {teslaPrice?.isFrom ? "Starting From" : "Price"}
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
                  </>
                )}


              </div>
            </div>

            <HelpNudge light label="Not sure which film or shade?" className="max-w-2xl mx-auto" />

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

      <TintBuildBar
        startId="tint-build-start"
        summaryId="tint-summary"
        headline={buildHeadline}
        sub={`${filmType.name} · ${isTesla ? "Tesla" : "Standard vehicle"}`}
        price={price}
        priceLabel={teslaPrice?.isFrom ? "From" : "Price"}
        href={bookingHref}
        disabled={level.value === 0}
      />
    </div>
  );
}
