"use client";

import { useMemo, useState } from "react";
import {
  catalog,
  getCategory,
  vehicleSizeLabels,
  VehicleSize,
  Package,
  priceForSize,
} from "@/data/catalog";
import TintVisualizer from "@/components/TintVisualizer";
import PPFVisualizer from "@/components/PPFVisualizer";

const steps = [
  "Service",
  "Package",
  "Vehicle",
  "Date & Time",
  "Details",
  "Pay",
  "Confirmation",
];

const timeSlots = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function bookedSlotsForDate(date: string): Set<string> {
  if (!date) return new Set();
  const seed = hashString(date);
  const booked = new Set<string>();
  const count = seed % 3;
  for (let i = 0; i < count; i++) {
    booked.add(timeSlots[(seed + i * 7) % timeSlots.length]);
  }
  return booked;
}

export default function BookingWizard({
  initialCategory,
  initialPackage,
}: {
  initialCategory?: string;
  initialPackage?: string;
}) {
  const startCategory = getCategory(initialCategory ?? "") ?? catalog[0];
  const startPackage =
    startCategory.packages.find((p) => p.slug === initialPackage) ?? startCategory.packages[0];

  const [step, setStep] = useState(1);
  const [categorySlug, setCategorySlug] = useState(startCategory.slug);
  const [pkg, setPkg] = useState<Package>(startPackage);
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>("sedan");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const category = getCategory(categorySlug)!;
  const booked = useMemo(() => bookedSlotsForDate(date), [date]);
  const availableSlots = timeSlots.filter((slot) => !booked.has(slot));

  const price = pkg.pricing.type === "fixed" ? priceForSize(pkg, vehicleSize) : priceForSize(pkg, vehicleSize);
  const isQuote = pkg.pricing.type === "quote";
  const deposit = price && pkg.depositPercent ? Math.round((price * pkg.depositPercent) / 100) : 0;

  function selectCategory(slug: string) {
    const c = getCategory(slug)!;
    setCategorySlug(slug);
    setPkg(c.packages[0]);
    setStep(2);
  }

  function selectPackage(p: Package) {
    setPkg(p);
    setStep(3);
  }

  async function submitBooking() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/booking/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: category.slug,
          packageSlug: pkg.slug,
          vehicleSize,
          vehicleInfo,
          name,
          phone,
          date,
          time,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      window.location.href = data.redirectUrl;
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const canGoNext = () => {
    if (step === 4) return Boolean(date && time);
    if (step === 5) return Boolean(name && phone && vehicleInfo);
    return true;
  };

  return (
    <div>
      {/* Progress — compact on mobile, full stepper from sm up */}
      <div className="sm:hidden mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm font-medium">{steps[step - 1]}</span>
          <span className="text-xs text-muted">Step {step} of {steps.length}</span>
        </div>
        <div className="h-1 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="no-scrollbar hidden sm:flex items-center gap-1 mb-8 overflow-x-auto">
        {steps.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div key={label} className="flex items-center gap-1 shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  active
                    ? "border-accent bg-accent/10 text-foreground"
                    : done
                      ? "border-border bg-surface-2 text-muted"
                      : "border-border text-muted"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    done ? "bg-accent text-accent-foreground" : "bg-surface-2"
                  }`}
                >
                  {done ? "✓" : n}
                </span>
                {label}
              </div>
              {n < steps.length && <span className="text-muted text-xs px-0.5">&rarr;</span>}
            </div>
          );
        })}
      </div>

      {/* Step 1: Service */}
      {step === 1 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {catalog.map((c) => (
            <button
              type="button"
              key={c.slug}
              onClick={() => selectCategory(c.slug)}
              className="text-left bg-surface border border-border rounded-xl p-4 sm:p-5 hover:border-muted transition-colors"
            >
              <h3 className="font-semibold text-sm sm:text-base">{c.name}</h3>
              <p className="hidden sm:block text-sm text-muted mt-1">{c.summary}</p>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Package */}
      {step === 2 && (
        <div>
          {category.visualizer === "tint" && (
            <div className="mb-6">
              <TintVisualizer hasTeslaVariant={category.hasTeslaVariant} />
            </div>
          )}
          {category.visualizer === "ppf" && (
            <div className="mb-6">
              <PPFVisualizer />
            </div>
          )}
          <div className="grid gap-3">
            {category.packages.map((p) => (
              <button
                type="button"
                key={p.slug}
                onClick={() => selectPackage(p)}
                className={`text-left bg-surface border rounded-xl p-5 transition-colors ${
                  pkg.slug === p.slug ? "border-accent" : "border-border hover:border-muted"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted mt-1">{p.tagline}</p>
                  </div>
                  <p className="chrome-text font-semibold shrink-0">
                    {p.pricing.type === "quote"
                      ? "Quote"
                      : p.pricing.type === "starting-at"
                        ? `From $${p.pricing.amount}`
                        : `$${p.pricing.byVehicleSize.sedan}+`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Vehicle */}
      {step === 3 && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-sm text-muted mb-4">
            {pkg.pricing.type === "fixed"
              ? "Pricing depends on vehicle size."
              : "Vehicle size helps us prepare, even though this service is priced separately."}
          </p>
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
      )}

      {/* Step 4: Date & Time */}
      {step === 4 && (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!date}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm disabled:text-muted disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                {date ? "Select a time" : "Pick a date first"}
              </option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {date && booked.size > 0 && (
              <p className="text-xs text-muted mt-1">
                {booked.size} slot{booked.size > 1 ? "s" : ""} already booked this day.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 5: Details */}
      {step === 5 && (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 555-5555"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Vehicle (Year / Make / Model)
            </label>
            <input
              type="text"
              value={vehicleInfo}
              onChange={(e) => setVehicleInfo(e.target.value)}
              placeholder="2020 Honda Civic"
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted"
            />
          </div>
        </div>
      )}

      {/* Step 6: Pay */}
      {step === 6 && (
        <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 space-y-4">
          <div className="bg-surface-2 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-muted shrink-0">Service</span>
              <span className="sm:text-right">{category.name} — {pkg.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-muted shrink-0">Vehicle</span>
              <span className="sm:text-right">{vehicleInfo || "—"} ({vehicleSizeLabels[vehicleSize]})</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-muted shrink-0">Date &amp; Time</span>
              <span className="sm:text-right">{date || "—"} at {time || "—"}</span>
            </div>
            <div className="flex justify-between gap-4 pt-2 border-t border-border">
              <span className="text-muted shrink-0">Total</span>
              <span className="font-semibold text-right">
                {isQuote ? "Priced after assessment" : `$${price}`}
              </span>
            </div>
            {!isQuote && deposit > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-muted shrink-0">Deposit due now</span>
                <span className="font-semibold chrome-text text-right">${deposit}</span>
              </div>
            )}
          </div>
          {isQuote ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted">
              No payment is required to request a quote — we&apos;ll follow up
              with pricing after reviewing the details.
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted">
              You&apos;ll be taken to Stripe&apos;s secure checkout to complete
              payment (test mode).
            </div>
          )}
          {submitError && (
            <p className="text-sm text-red-400">{submitError}</p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || submitting}
          className="px-5 py-2 rounded-lg font-medium text-sm border border-border text-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => (step === 6 ? submitBooking() : setStep((s) => Math.min(6, s + 1)))}
          disabled={!canGoNext() || step === 1 || step === 2 || submitting}
          className="chrome-btn px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step === 6
            ? submitting
              ? "Processing..."
              : isQuote
                ? "Request Quote"
                : `Pay $${deposit || price || 0} & Book`
            : "Continue"}
        </button>
      </div>
    </div>
  );
}
