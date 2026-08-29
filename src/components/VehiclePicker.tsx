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

  // Native select arrows render inconsistently across browsers/OS themes, so the
  // control is stripped and given a chevron that matches the surrounding theme.
  const chevron = (hex: string) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23${hex}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;
  const selectStyle = {
    backgroundImage: chevron(light ? "737373" : "9a9ca2"),
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1rem",
  } as const;

  const selectClass = light
    ? "w-full appearance-none bg-white border border-neutral-300 rounded-lg pl-3 pr-10 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
    : "w-full appearance-none bg-surface-2 border border-border rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors";
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
          {/* The one rule people get wrong when choosing for themselves. Row
              count is something anyone can check from the driveway, where
              "full-size" is a judgement call — and getting it wrong here is
              what leads to a price changing on arrival. */}
          <p className={light ? "text-xs text-neutral-500 mb-3" : "text-xs text-muted mb-3"}>
            Three rows of seats? That&apos;s Truck / Full-size SUV.
          </p>
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
      {/* No visible labels — each select's placeholder already names it. */}
      <div className="grid sm:grid-cols-3 gap-3">
        <select
          aria-label="Year"
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">Year</option>
          {vehicleYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          aria-label="Make"
          value={make}
          onChange={(e) => handleMakeChange(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">Make</option>
          {vehicleMakes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          aria-label="Model"
          value={model}
          onChange={(e) => handleModelChange(e.target.value)}
          disabled={!make}
          className={selectClass + " disabled:opacity-50"}
          style={selectStyle}
        >
          <option value="">{make ? "Model" : "Choose a make first"}</option>
          {models.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
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
