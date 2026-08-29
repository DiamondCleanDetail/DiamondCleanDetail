"use client";

import { AnimatePresence, motion } from "framer-motion";
import StackedImage from "@/components/StackedImage";
import { previewAspect, teslaPreviewAspect, tintLevels, type TintLevel } from "@/data/tintLevels";
import { vehicleSizeLabels, type VehicleSize } from "@/data/catalog";
import SegmentedTabs from "@/components/SegmentedTabs";

/** 80% is a windshield-visor-only shade, so it never appears in this bar. */
const previewLevels = tintLevels.filter((l) => !l.windshieldOnly);
/** Clear is a comparison baseline, not a product — you cannot buy "no tint".
 * The service page keeps it so people can flick between clear and a shade to
 * see the difference; the booking wizard hides it, because there the selected
 * level IS the order. */
const purchasableLevels = previewLevels.filter((l) => l.value !== 0);

export default function TintVisualizer({
  level,
  setLevel,
  vehicleSize,
  allowClear = true,
  isTesla = false,
}: {
  level: TintLevel;
  setLevel: (l: TintLevel) => void;
  /** Which example vehicle to preview — defaults to Sedan/Coupe if omitted. */
  vehicleSize?: VehicleSize;
  /** False in purchase contexts, where Clear must not be selectable. */
  allowClear?: boolean;
  /** Detected from the chosen vehicle. Teslas preview on a Model 3 instead of
   * the generic car for their size bucket. */
  isTesla?: boolean;
}) {
  const selectableLevels = allowClear ? previewLevels : purchasableLevels;
  const size = vehicleSize ?? "sedan";
  // Decided across the whole set, not per shade, so the frame keeps one shape
  // however you step through it.
  const useTeslaSet = isTesla && selectableLevels.every((l) => l.teslaImage);
  const srcFor = (l: TintLevel) => (useTeslaSet ? l.teslaImage : l.images[size]);
  const image = srcFor(level);
  const aspect = useTeslaSet ? teslaPreviewAspect : previewAspect[size];
  // Every shade for this vehicle, held in the DOM together so picking one is
  // instant. Only this vehicle's set — loading all three sizes up front would
  // be three times the bytes to save a switch most people never make.
  const shadeVariants = selectableLevels
    .filter((l) => srcFor(l))
    .map((l) => ({ key: String(l.value), src: srcFor(l)! }));
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
              The frame takes the current vehicle's own shape rather than the
              tallest vehicle's. Every render runs bumper to bumper across its
              full width, so drawing each at full width keeps them all at the
              same scale — a fixed frame isn't what holds that, and cutting it
              for the G-Wagen just left a third of the box as dead air above
              the far flatter sedan. */}
          <div
            className="relative mt-6 sm:mt-8 w-full"
            // A container so the watermark below can be sized as a share of
            // the frame. At a fixed pixel size it was a quarter of the frame's
            // height on a wide screen but nearly half of it on a small laptop.
            style={{ aspectRatio: String(aspect), containerType: "inline-size" }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={level.value}
                aria-hidden
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const }}
                // Pinned to the top rather than measured up from the floor:
                // the frame is much shorter for a sedan than for a G-Wagen, so
                // the same offset from the bottom sat at a different height on
                // each, and a large numeral could run off the top of the
                // flattest one. Behind the car (z-0) so it reads as a
                // watermark rather than a label sitting on the paint.
                className="pointer-events-none select-none absolute top-[1%] right-[2%] z-0 font-black text-neutral-900/25 leading-none"
                style={{ fontSize: "12cqw" }}
              >
                {level.label}
              </motion.span>
            </AnimatePresence>

            <div className="absolute inset-0">
              {image ? (
                <StackedImage
                  variants={shadeVariants}
                  active={String(level.value)}
                  priorityKey={String(level.value)}
                  alt={`${level.label} tint preview on a ${useTeslaSet ? "Tesla" : vehicleSizeLabels[size]}`}
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
