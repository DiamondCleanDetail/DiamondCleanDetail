"use client";

import { useState } from "react";
import { vehicleMakes, getModelsForMake, getVehicleCategory, vehicleYears } from "@/data/vehicles";
import { vehicleSizeLabels, VehicleSize } from "@/data/catalog";

export default function VehiclePicker({
  vehicleSize,
  setVehicleSize,
  vehicleInfo,
  setVehicleInfo,
  light = false,
}: {
  vehicleSize: VehicleSize;
  setVehicleSize: (v: VehicleSize) => void;
  vehicleInfo: string;
  setVehicleInfo: (v: string) => void;
  /** Set true when rendering on a light-themed page (e.g. window tinting). */
  light?: boolean;
}) {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [manual, setManual] = useState(false);

  const selectClass = light
    ? "w-full bg-white border-2 border-neutral-300 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-500 transition-colors"
    : "w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors";
  const labelClass = light
    ? "block text-xs uppercase tracking-widest text-neutral-500 mb-1.5"
    : "block text-xs uppercase tracking-widest text-muted mb-1.5";
  const linkClass = light
    ? "text-xs text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4"
    : "text-xs text-muted hover:text-foreground transition-colors underline underline-offset-4";

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
    // Clear the derived vehicle info so a stale make/model can't reach
    // checkout while a new model is still being chosen.
    setVehicleInfo("");
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
          <label className={light ? "block text-sm font-medium mb-1 text-neutral-900" : "block text-sm font-medium mb-1"}>
            Vehicle (Year / Make / Model)
          </label>
          <input
            type="text"
            value={vehicleInfo}
            onChange={(e) => setVehicleInfo(e.target.value)}
            placeholder="2020 Honda Civic"
            className={selectClass + (light ? " placeholder:text-neutral-400" : " placeholder:text-muted")}
          />
        </div>
        <div>
          <p className={light ? "text-sm text-neutral-500 mb-2" : "text-sm text-muted mb-2"}>Closest vehicle size</p>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(vehicleSizeLabels) as VehicleSize[]).map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => setVehicleSize(size)}
                className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                  vehicleSize === size
                    ? light
                      ? "border-neutral-900 bg-neutral-100 text-neutral-900"
                      : "border-accent bg-accent/10 text-foreground"
                    : light
                      ? "border-neutral-300 bg-white text-neutral-500 hover:text-neutral-900"
                      : "border-border bg-surface-2 text-muted hover:text-foreground"
                }`}
              >
                {vehicleSizeLabels[size]}
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={() => setManual(false)} className={linkClass}>
          Pick from the list instead
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Year</label>
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
          <label className={labelClass}>Make</label>
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
          <label className={labelClass}>Model</label>
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
        <div
          className={
            light
              ? "bg-neutral-100 border-2 border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-700"
              : "bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-sm"
          }
        >
          Recognized as <span className="font-semibold">{vehicleSizeLabels[detectedCategory]}</span> pricing —
          applied automatically.
        </div>
      )}

      <button type="button" onClick={() => setManual(true)} className={linkClass}>
        Can&apos;t find your vehicle? Enter it manually
      </button>
    </div>
  );
}
