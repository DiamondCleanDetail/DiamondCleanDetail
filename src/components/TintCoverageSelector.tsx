"use client";

import { useState } from "react";
import Link from "next/link";
import { getCategory, vehicleSizeLabels, VehicleSize, priceForSize } from "@/data/catalog";

const category = getCategory("window-tinting")!;

const windowZonesByPackage: Record<string, string[]> = {
  "front-two": ["frontDoor"],
  "full-vehicle": ["rearQuarter", "rearDoor", "frontDoor", "windshieldStrip"],
  "windshield-strip": ["windshieldStrip"],
};

export default function TintCoverageSelector() {
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>("sedan");
  const [pkg, setPkg] = useState(category.packages[0]);

  const activeZones = new Set(windowZonesByPackage[pkg.slug] ?? []);
  const price = priceForSize(pkg, vehicleSize);

  const fill = (zone: string) => (activeZones.has(zone) ? "#3a3d42" : "#d4d6d9");
  const opacity = (zone: string) => (activeZones.has(zone) ? 0.9 : 1);

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500">Step 2</span>
      <h3 className="font-semibold mb-5 text-neutral-900">Choose Your Coverage</h3>

      {/* Vehicle size */}
      <p className="text-xs text-neutral-500 mb-2">Vehicle Size</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {(Object.keys(vehicleSizeLabels) as VehicleSize[]).map((size) => (
          <button
            type="button"
            key={size}
            onClick={() => setVehicleSize(size)}
            className={`rounded-lg border px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
              vehicleSize === size
                ? "border-neutral-900 bg-neutral-900/5 text-neutral-900"
                : "border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {vehicleSizeLabels[size]}
          </button>
        ))}
      </div>

      {/* Package tabs */}
      <p className="text-xs text-neutral-500 mb-2">Coverage</p>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {category.packages.map((p) => (
          <button
            type="button"
            key={p.slug}
            onClick={() => setPkg(p)}
            className={`rounded-lg border px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
              pkg.slug === p.slug
                ? "border-neutral-900 bg-neutral-900/5 text-neutral-900"
                : "border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 items-center">
        {/* Highlighted coverage diagram */}
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <svg viewBox="0 0 400 160" className="w-full h-auto">
            <path
              d="M20 120 Q25 75 80 65 Q120 30 210 32 Q270 34 320 65 Q375 75 385 105 L385 120 Z"
              fill="#e5e7ea"
              stroke="#c4c7cb"
              strokeWidth="2"
            />
            <path
              d="M116 82.5 L130 70.5 L176 68 L176 82.5 Z"
              fill={fill("rearQuarter")}
              opacity={opacity("rearQuarter")}
              stroke="#c4c7cb"
              strokeWidth="1"
            />
            <path
              d="M130 70.5 L176 68 L176 82.5 L130 82.5 Z"
              fill={fill("rearDoor")}
              opacity={opacity("rearDoor")}
              stroke="#c4c7cb"
              strokeWidth="1"
            />
            <path
              d="M176 68 L228 68 L228 82.5 L176 82.5 Z"
              fill={fill("frontDoor")}
              opacity={opacity("frontDoor")}
              stroke="#c4c7cb"
              strokeWidth="1"
            />
            <path
              d="M228 68 L246 76 L246 82.5 L228 82.5 Z"
              fill={fill("windshieldStrip")}
              opacity={opacity("windshieldStrip")}
              stroke="#c4c7cb"
              strokeWidth="1"
            />
            <circle cx="95" cy="122" r="18" fill="#f2f3f4" stroke="#c4c7cb" strokeWidth="2" />
            <circle cx="320" cy="122" r="18" fill="#f2f3f4" stroke="#c4c7cb" strokeWidth="2" />
          </svg>
          <p className="text-xs text-neutral-500 text-center mt-2">
            Highlighted glass shows what&apos;s covered by {pkg.name}.
          </p>
        </div>

        {/* Package details */}
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
          <Link
            href={`/booking?service=${category.slug}&package=${pkg.slug}`}
            className="chrome-btn inline-block mt-4 px-6 py-2.5 rounded-lg font-semibold text-sm border border-neutral-300"
          >
            Book This
          </Link>
        </div>
      </div>
    </div>
  );
}
