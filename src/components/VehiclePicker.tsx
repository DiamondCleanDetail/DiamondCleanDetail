"use client";

import { useState } from "react";
import { vehicleMakes, getModelsForMake, getVehicleCategory, vehicleYears } from "@/data/vehicles";
import { vehicleSizeLabels, VehicleSize } from "@/data/catalog";

const selectClass =
  "w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors";

export default function VehiclePicker({
  vehicleSize,
  setVehicleSize,
  vehicleInfo,
  setVehicleInfo,
}: {
  vehicleSize: VehicleSize;
  setVehicleSize: (v: VehicleSize) => void;
  vehicleInfo: string;
  setVehicleInfo: (v: string) => void;
}) {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [manual, setManual] = useState(false);

  const models = make ? getModelsForMake(make) : [];
  const detectedCategory = make && model ? getVehicleCategory(make, model) : null;

  function handleModelChange(nextModel: string) {
    setModel(nextModel);
    const category = getVehicleCategory(make, nextModel);
    if (category) setVehicleSize(category);
    setVehicleInfo([year, make, nextModel].filter(Boolean).join(" "));
  }

  function handleMakeChange(nextMake: string) {
    setMake(nextMake);
    setModel("");
  }

  function handleYearChange(nextYear: string) {
    setYear(nextYear);
    if (make && model) {
      setVehicleInfo([nextYear, make, model].filter(Boolean).join(" "));
    }
  }

  if (manual) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Vehicle (Year / Make / Model)</label>
          <input
            type="text"
            value={vehicleInfo}
            onChange={(e) => setVehicleInfo(e.target.value)}
            placeholder="2020 Honda Civic"
            className={selectClass + " placeholder:text-muted"}
          />
        </div>
        <div>
          <p className="text-sm text-muted mb-2">Closest vehicle size</p>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(vehicleSizeLabels) as VehicleSize[]).map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => setVehicleSize(size)}
                className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                  vehicleSize === size
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border bg-surface-2 text-muted hover:text-foreground"
                }`}
              >
                {vehicleSizeLabels[size]}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setManual(false)}
          className="text-xs text-muted hover:text-foreground transition-colors underline underline-offset-4"
        >
          Pick from the list instead
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">Year</label>
          <select value={year} onChange={(e) => handleYearChange(e.target.value)} className={selectClass}>
            <option value="">Year</option>
            {vehicleYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">Make</label>
          <select value={make} onChange={(e) => handleMakeChange(e.target.value)} className={selectClass}>
            <option value="">Make</option>
            {vehicleMakes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">Model</label>
          <select
            value={model}
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={!make}
            className={selectClass + " disabled:opacity-50"}
          >
            <option value="">{make ? "Model" : "Choose a make first"}</option>
            {models.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {detectedCategory && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-sm">
          Recognized as <span className="font-semibold">{vehicleSizeLabels[detectedCategory]}</span> pricing —
          applied automatically.
        </div>
      )}

      <button
        type="button"
        onClick={() => setManual(true)}
        className="text-xs text-muted hover:text-foreground transition-colors underline underline-offset-4"
      >
        Can&apos;t find your vehicle? Enter it manually
      </button>
    </div>
  );
}
