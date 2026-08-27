"use client";

import { useState } from "react";
import Link from "next/link";
import { getCategory, priceForSize, Package, VehicleSize } from "@/data/catalog";
import { tintLevels } from "@/data/tintLevels";
import { filmTypes } from "@/data/filmTypes";
import ServiceHero from "@/components/ServiceHero";
import TintVisualizer from "@/components/TintVisualizer";
import TintCoverageSelector from "@/components/TintCoverageSelector";
import TintFilmTypeSelector from "@/components/TintFilmTypeSelector";
import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import ServiceGallery from "@/components/ServiceGallery";

const category = getCategory("window-tinting")!;

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
        title="See Your Shade Before You Book."
        tagline="Preview how each tint shade looks, then choose your coverage and book online."
        image="/services/window-tinting-hero.webp"
      />

      <div className="bg-white text-neutral-900">
        {/* What It Is */}
        <section className="mx-auto max-w-4xl px-6 pt-10 sm:pt-16 pb-10 sm:pb-16 text-center">
          <FadeIn>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500">What It Is</span>
            <p className="text-lg sm:text-xl mt-3 leading-relaxed">{category.valueProp}</p>
          </FadeIn>
        </section>

        {/* Why It's Worth It */}
        <section className="mx-auto max-w-6xl px-6 pb-10 sm:pb-16">
          <FadeIn>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Why It&apos;s Worth It</h2>
          </FadeIn>
          <StaggerGrid className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {category.benefits.map((b, i) => (
              <StaggerItem key={b.title}>
                <div className="h-full bg-neutral-50 border-2 border-neutral-300 rounded-xl p-5">
                  <span className="chrome-text-dark text-3xl font-black">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-semibold mt-3 text-neutral-900">{b.title}</h3>
                  <p className="text-sm text-neutral-500 mt-2">{b.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>

        {/* How It Works */}
        <section className="mx-auto max-w-4xl px-6 pb-10 sm:pb-16">
          <FadeIn>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">How It Works</h2>
          </FadeIn>
          <div className="space-y-4">
            {category.process.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.06}>
                <div className="flex gap-4 bg-neutral-50 border-2 border-neutral-300 rounded-xl p-5">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-white border-2 border-neutral-300 flex items-center justify-center text-sm font-semibold chrome-text-dark">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{step.title}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{step.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="w-full pb-6 sm:pb-10">
          <TintVisualizer level={level} setLevel={setLevel} vehicleSize={vehicleSize} />
        </section>

        <section className="w-full pb-6 sm:pb-10">
          <TintCoverageSelector
            vehicleSize={vehicleSize}
            setVehicleSize={setVehicleSize}
            vehicleInfo={vehicleInfo}
            setVehicleInfo={setVehicleInfo}
            isTesla={isTesla}
            setIsTesla={setIsTesla}
            pkg={pkg}
            setPkg={setPkg}
          />
        </section>

        <section className="w-full pb-6 sm:pb-10">
          <TintFilmTypeSelector filmType={filmType} setFilmType={setFilmType} />
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-12 sm:pb-24">
          <div className="bg-neutral-50 border-2 border-neutral-300 rounded-xl p-6 sm:p-8 text-center">
            <p className="text-xs uppercase tracking-widest text-neutral-500">Your Selection</p>
            <p className="text-lg font-semibold text-neutral-900 mt-2">
              {level.label} tint &middot; {pkg.name} &middot; {filmType.name}
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              {isTesla ? "Tesla" : "Standard vehicle"} — from{" "}
              <span className="font-semibold text-neutral-900">${price}</span>
              {filmType.slug !== "diamond-smoke" && " (film upgrade priced separately — we'll confirm exact total)"}
            </p>
            <Link
              href={bookingHref}
              className="inline-block mt-5 px-6 py-2.5 rounded-lg font-semibold text-sm bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
            >
              Book This
            </Link>
          </div>

          <div className="mt-6 bg-neutral-50 border-2 border-neutral-300 rounded-xl p-5 text-sm text-neutral-500">
            Tesla vehicles use different glass and film-application techniques.
            The price above reflects our standard install — we&apos;ll confirm
            with you before your appointment if Tesla glass changes that total.
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-neutral-900">From Recent Jobs</h2>
          <ServiceGallery images={category.galleryImages} light />
        </section>
      </div>
    </div>
  );
}
