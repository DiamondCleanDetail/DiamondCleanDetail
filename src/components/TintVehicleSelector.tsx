"use client";

import { VehicleSize } from "@/data/catalog";
import VehiclePicker from "@/components/VehiclePicker";

/** Step 1 of the tint configurator: which vehicle we're working on. Kept
 * deliberately plain — no card chrome — so the first step feels like a quick
 * question rather than a form. */
export default function TintVehicleSelector({
  vehicleSize,
  setVehicleSize,
  vehicleInfo,
  setVehicleInfo,
  isTesla,
  setIsTesla,
}: {
  vehicleSize: VehicleSize;
  setVehicleSize: (v: VehicleSize) => void;
  vehicleInfo: string;
  setVehicleInfo: (v: string) => void;
  isTesla: boolean;
  setIsTesla: (v: boolean) => void;
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

      <label className="mt-4 flex items-center gap-2.5 text-sm text-neutral-700 cursor-pointer">
        <input
          type="checkbox"
          checked={isTesla}
          onChange={(e) => setIsTesla(e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
        />
        This is a Tesla
      </label>
      {isTesla && (
        <p className="mt-2 text-xs text-neutral-500">
          Tesla glass uses a different installation process — we&apos;ll confirm exact pricing
          before your appointment.
        </p>
      )}
    </div>
  );
}
