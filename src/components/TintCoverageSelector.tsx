"use client";

import { getCategory, vehicleSizeLabels, VehicleSize, priceForSize, Package } from "@/data/catalog";
import SegmentedTabs from "@/components/SegmentedTabs";
import WindshieldTintPreview from "@/components/WindshieldTintPreview";

const category = getCategory("window-tinting")!;

export default function TintCoverageSelector({
  vehicleSize,
  pkg,
  setPkg,
}: {
  vehicleSize: VehicleSize;
  pkg: Package;
  setPkg: (p: Package) => void;
}) {
  const price = priceForSize(pkg, vehicleSize);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-6">
        {/* Coverage package tabs */}
        <SegmentedTabs
          items={category.packages.map((p) => ({ value: p.slug, label: p.name }))}
          value={pkg.slug}
          onChange={(slug) => setPkg(category.packages.find((p) => p.slug === slug) ?? pkg)}
          layoutId="coverage-package-highlight"
          className="w-full"
        />

        {/* Preview + details */}
        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="aspect-[3054/955] w-full rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center">
            <p className="text-sm text-neutral-500">Coverage diagram coming soon</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-neutral-900">{pkg.name}</h4>
            <p className="text-sm text-neutral-500 mt-1">{pkg.tagline}</p>
            <ul className="mt-3 space-y-1">
              {pkg.features.map((f) => (
                <li key={f} className="text-sm text-neutral-500 flex gap-2">
                  <span className="text-neutral-900">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-neutral-500 mt-4 uppercase tracking-widest">Price for {vehicleSizeLabels[vehicleSize]}</p>
            <p className="text-2xl font-semibold chrome-text-dark">${price}</p>
          </div>
        </div>

        {pkg.slug === "windshield-strip" && <WindshieldTintPreview />}
      </div>
    </div>
  );
}
