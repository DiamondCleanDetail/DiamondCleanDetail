"use client";

import { useState } from "react";
import Image from "next/image";

type Shade = {
  label: string;
  vlt: number; // visible light transmission %, lower = darker
};

const shades: Shade[] = [
  { label: "5%", vlt: 5 },
  { label: "15%", vlt: 15 },
  { label: "20%", vlt: 20 },
  { label: "35%", vlt: 35 },
  { label: "50%", vlt: 50 },
];

// Positioned as % of the image box, tuned to the side-profile BMW E30 photo.
const windowZones = [
  { clipPath: "polygon(29.5% 51.6%, 32.5% 44%, 44% 42.4%, 44% 51.6%)" }, // rear quarter + door window
  { clipPath: "polygon(44% 42.4%, 56.5% 42.4%, 56.5% 51.6%, 44% 51.6%)" }, // front door window
  { clipPath: "polygon(56.5% 39.6%, 60.5% 51.6%, 56.5% 51.6%)" }, // windshield
];

export default function TintVisualizer({ hasTeslaVariant }: { hasTeslaVariant?: boolean }) {
  const [shade, setShade] = useState<Shade>(shades[2]);
  const [isTesla, setIsTesla] = useState(false);

  // Darker glass = higher overlay opacity.
  const overlayOpacity = 0.08 + (1 - shade.vlt / 100) * 0.72;

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="font-semibold">Preview Your Tint</h3>
        {hasTeslaVariant && (
          <div className="flex bg-surface-2 border border-border rounded-full p-1 text-xs">
            <button
              type="button"
              onClick={() => setIsTesla(false)}
              className={`px-3 py-1 rounded-full transition-colors ${
                !isTesla ? "bg-accent text-accent-foreground" : "text-muted"
              }`}
            >
              Standard Vehicle
            </button>
            <button
              type="button"
              onClick={() => setIsTesla(true)}
              className={`px-3 py-1 rounded-full transition-colors ${
                isTesla ? "bg-accent text-accent-foreground" : "text-muted"
              }`}
            >
              Tesla
            </button>
          </div>
        )}
      </div>

      <div className="relative rounded-lg overflow-hidden bg-surface-2">
        {isTesla ? (
          <div className="aspect-video flex items-center justify-center text-sm text-muted px-6 text-center">
            Tesla reference photo coming soon — pricing/booking already
            account for Tesla glass.
          </div>
        ) : (
          <div className="relative aspect-video">
            <Image
              src="/vehicles/bmw-e30.jpg"
              alt="BMW E30 tint preview"
              fill
              className="object-cover"
              priority
            />
            {windowZones.map((zone, i) => (
              <div
                key={i}
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: zone.clipPath,
                  backgroundColor: "#000000",
                  opacity: overlayOpacity,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="text-xs text-muted mb-2">
          Shade (VLT — lower % is darker)
        </p>
        <div className="grid grid-cols-5 gap-2">
          {shades.map((s) => (
            <button
              type="button"
              key={s.label}
              onClick={() => setShade(s)}
              className={`rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                shade.label === s.label
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface-2 text-muted hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
