"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { tintLevels, type TintLevel } from "@/data/tintLevels";
import { vehicleSizeLabels, type VehicleSize } from "@/data/catalog";
import SegmentedTabs from "@/components/SegmentedTabs";

/** 80% is a windshield-visor-only shade, so it never appears in this bar. */
const selectableLevels = tintLevels.filter((l) => !l.windshieldOnly);

export default function TintVisualizer({
  level,
  setLevel,
  vehicleSize,
}: {
  level: TintLevel;
  setLevel: (l: TintLevel) => void;
  /** Which example vehicle to preview — defaults to Sedan/Coupe if omitted. */
  vehicleSize?: VehicleSize;
}) {
  const size = vehicleSize ?? "sedan";
  const image = level.images[size];
  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="mx-auto max-w-6xl px-6">
          {/* Level tabs — every shade label is short ("Clear", "35%"), so this
              one keeps the single capsule row at phone widths too. */}
          <SegmentedTabs
            items={selectableLevels.map((l) => ({ value: String(l.value), label: l.label }))}
            value={String(level.value)}
            onChange={(v) => setLevel(selectableLevels.find((l) => String(l.value) === v) ?? level)}
            layoutId="tint-tab-highlight"
            mobileLayout="row"
            className="w-full"
          />

          {/* Preview.
              The box is cut for the tallest vehicle, not the sedan. Every
              vehicle render runs bumper to bumper across its own full width,
              so they all draw at the same scale as each other — which means a
              G-Wagen needs the extra height, and an M3 simply leaves air above
              itself. Sizing the box to the sedan instead would force the taller
              vehicles to shrink to fit, and a G63 would end up drawn smaller
              than an M3 it is actually the same length as. */}
          <div className="relative mt-10 sm:mt-14 aspect-[3054/1357] w-full">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={level.value}
                aria-hidden
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const }}
                className="pointer-events-none select-none absolute bottom-[68%] right-[3%] z-0 text-6xl sm:text-8xl font-black text-neutral-900/25 leading-none"
              >
                {level.label}
              </motion.span>
            </AnimatePresence>

            <div className="absolute inset-0">
              {image ? (
                <Image
                  src={image}
                  alt={`${level.label} tint preview on a ${vehicleSizeLabels[size]}`}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 1152px"
                  // Bottom-aligned so every vehicle stands on the same ground
                  // line. Centred, a shorter vehicle would float in the middle
                  // of a box sized for a taller one.
                  className="object-contain object-bottom"
                />
              ) : (
                <div className="absolute inset-0 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center">
                  <p className="text-sm text-neutral-500 text-center px-6">
                    {vehicleSizeLabels[size]} preview at{" "}
                    <span className="text-neutral-900 font-medium">{level.label}</span> coming soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
