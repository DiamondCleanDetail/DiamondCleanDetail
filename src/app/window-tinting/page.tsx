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

const category = getCategory("window-tinting")!;

export default function WindowTintingPage() {
  const [level, setLevel] = useState(tintLevels.find((l) => l.value === 35)!);
  const [isTesla, setIsTesla] = useState(false);
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>("sedan");
  const [pkg, setPkg] = useState<Package>(category.packages[0]);
  const [filmType, setFilmType] = useState(filmTypes[1]); // Diamond Ceramic RX, most popular

  const price = priceForSize(pkg, vehicleSize);
  const bookingHref = `/booking?service=${category.slug}&package=${pkg.slug}&tint=${level.value}&film=${filmType.slug}`;

  return (
    <div>
      <ServiceHero
        eyebrow="Window Tinting"
        title="See Your Shade Before You Book."
        tagline="Preview how each tint shade looks, then choose your coverage and book online — including dedicated pricing for Tesla glass."
        image="/services/window-tinting-hero.webp"
      />

      <div className="bg-white text-neutral-900">
        <section className="w-full pb-6 sm:pb-10">
          <TintVisualizer
            hasTeslaVariant={category.hasTeslaVariant}
            level={level}
            setLevel={setLevel}
            isTesla={isTesla}
            setIsTesla={setIsTesla}
          />
        </section>

        <section className="w-full pb-6 sm:pb-10">
          <TintCoverageSelector
            vehicleSize={vehicleSize}
            setVehicleSize={setVehicleSize}
            pkg={pkg}
            setPkg={setPkg}
          />
        </section>

        <section className="w-full pb-6 sm:pb-10">
          <TintFilmTypeSelector filmType={filmType} setFilmType={setFilmType} />
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-12 sm:pb-24">
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 sm:p-8 text-center">
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

          <div className="mt-6 bg-neutral-50 border border-neutral-200 rounded-xl p-5 text-sm text-neutral-500">
            Tesla vehicles require different glass and installation — Tesla
            pricing is quoted separately from standard vehicle pricing above.
            Toggle &ldquo;Tesla&rdquo; in the preview to see how it&apos;s handled.
          </div>
        </section>
      </div>
    </div>
  );
}
