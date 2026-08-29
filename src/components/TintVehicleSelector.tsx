"use client";

import { VehicleSize } from "@/data/catalog";
import VehiclePicker from "@/components/VehiclePicker";

/** Step 1 of the tint configurator: which vehicle we're working on. Kept
 * deliberately plain — no card chrome — so the first step feels like a quick
 * question rather than a form.
 *
 * There is deliberately no "This is a Tesla" checkbox: picking Tesla in the
 * make dropdown (or typing it in the manual field) already says so, and the
 * page detects it from there. Asking again was asking the customer to
 * volunteer something their own selection had answered. */
export default function TintVehicleSelector({
  vehicleSize,
  setVehicleSize,
  vehicleInfo,
  setVehicleInfo,
  isTesla,
}: {
  vehicleSize: VehicleSize;
  setVehicleSize: (v: VehicleSize) => void;
  vehicleInfo: string;
  setVehicleInfo: (v: string) => void;
  /** Detected by the parent from the vehicle itself. */
  isTesla: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6">
      <VehiclePicker
        vehicleSize={vehicleSize}
        setVehicleSize={setVehicleSize}
        vehicleInfo={vehicleInfo}
        setVehicleInfo={setVehicleInfo}
        light
      />

      {isTesla && (
        <p className="mt-4 text-sm text-neutral-700">
          <span className="font-semibold">Tesla detected</span>
          <span className="text-neutral-500">
            {" "}
            — Tesla glass is priced per coverage and film; you&apos;ll see those options in the
            coverage step.
          </span>
        </p>
      )}
    </div>
  );
}
