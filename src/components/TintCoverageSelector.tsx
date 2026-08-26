"use client";

import { motion } from "framer-motion";
import { getCategory, vehicleSizeLabels, VehicleSize, priceForSize, Package } from "@/data/catalog";

const category = getCategory("window-tinting")!;

export default function TintCoverageSelector({
  vehicleSize,
  setVehicleSize,
  pkg,
  setPkg,
}: {
  vehicleSize: VehicleSize;
  setVehicleSize: (v: VehicleSize) => void;
  pkg: Package;
  setPkg: (p: Package) => void;
}) {
  const price = priceForSize(pkg, vehicleSize);

  return (
    <div className="w-full py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center mb-10">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500">Step 2</span>
        <h3 className="font-semibold text-lg sm:text-xl text-neutral-900 mt-1">Choose Your Coverage</h3>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2">
          Pick your vehicle size and how much glass you want covered.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Vehicle size tabs */}
        <p className="text-xs text-neutral-500 mb-2">Vehicle Size</p>
        <div className="relative flex w-full rounded-full border-2 border-neutral-300 bg-neutral-100 p-1 mb-6">
          {(Object.keys(vehicleSizeLabels) as VehicleSize[]).map((size) => {
            const isActive = vehicleSize === size;
            return (
              <button
                type="button"
                key={size}
                onClick={() => setVehicleSize(size)}
                className="relative flex-1 py-2.5 sm:py-3 text-center"
              >
                {isActive && (
                  <motion.span
                    layoutId="vehicle-size-highlight"
                    className="absolute inset-0 bg-neutral-200 rounded-full"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {vehicleSizeLabels[size]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Coverage package tabs */}
        <p className="text-xs text-neutral-500 mb-2">Coverage</p>
        <div className="relative flex w-full rounded-full border-2 border-neutral-300 bg-neutral-100 p-1">
          {category.packages.map((p) => {
            const isActive = pkg.slug === p.slug;
            return (
              <button
                type="button"
                key={p.slug}
                onClick={() => setPkg(p)}
                className="relative flex-1 py-2.5 sm:py-3 text-center"
              >
                {isActive && (
                  <motion.span
                    layoutId="coverage-package-highlight"
                    className="absolute inset-0 bg-neutral-200 rounded-full"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>

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
      </div>
    </div>
  );
}
