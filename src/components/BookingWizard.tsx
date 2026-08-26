"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  catalog,
  getCategory,
  vehicleSizeLabels,
  VehicleSize,
  Package,
  priceForSize,
} from "@/data/catalog";
import TintVisualizer from "@/components/TintVisualizer";
import TintFilmTypeSelector from "@/components/TintFilmTypeSelector";
import PPFVisualizer from "@/components/PPFVisualizer";
import VehiclePicker from "@/components/VehiclePicker";
import { tintLevels } from "@/data/tintLevels";
import { filmTypes, type FilmType } from "@/data/filmTypes";
import { todayIso, isWeekend, availableSlotsFor, type BookedRange } from "@/lib/scheduling";

const steps = [
  "Service",
  "Package",
  "Vehicle",
  "Date & Time",
  "Details",
  "Pay",
  "Confirmation",
];

type Draft = {
  step: number;
  categorySlug: string;
  packageSlug: string;
  vehicleSize: VehicleSize;
  vehicleInfo: string;
  tintLevelValue: number;
  isTesla: boolean;
  filmSlug: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
};

const DRAFT_KEY = "dcd-booking-draft";

function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function resolvePackage(categorySlug: string, packageSlug: string): Package {
  const category = getCategory(categorySlug) ?? catalog[0];
  return category.packages.find((p) => p.slug === packageSlug) ?? category.packages[0];
}

export default function BookingWizard({
  initialCategory,
  initialPackage,
  initialTint,
  initialFilm,
  initialTesla,
}: {
  initialCategory?: string;
  initialPackage?: string;
  initialTint?: string;
  initialFilm?: string;
  initialTesla?: boolean;
}) {
  const startCategory = getCategory(initialCategory ?? "") ?? catalog[0];
  const startPackage =
    startCategory.packages.find((p) => p.slug === initialPackage) ?? startCategory.packages[0];
  const hasValidInitialSelection = Boolean(initialCategory && getCategory(initialCategory));

  // State starts from SSR-safe defaults only — sessionStorage isn't
  // available on the server, so reading it here would make the client's
  // first render diverge from the server-rendered HTML (a hydration
  // mismatch). Any saved draft is applied after mount instead, below.
  const [step, setStep] = useState(hasValidInitialSelection ? 3 : 1);
  const [categorySlug, setCategorySlug] = useState(startCategory.slug);
  const [pkg, setPkg] = useState<Package>(startPackage);
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>("sedan");
  const [tintLevel, setTintLevel] = useState(() => {
    const value = initialTint ? Number(initialTint) : 35;
    return tintLevels.find((l) => l.value === value) ?? tintLevels.find((l) => l.value === 35)!;
  });
  const [isTesla, setIsTesla] = useState(initialTesla ?? false);
  const [filmType, setFilmType] = useState<FilmType>(
    () => filmTypes.find((f) => f.slug === initialFilm) ?? filmTypes[1]
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);

  const category = getCategory(categorySlug)!;
  const hasResumedRef = useRef(false);

  // Resume an in-progress booking (e.g. after canceling out of Stripe) once
  // the component has mounted on the client, but only when the saved draft
  // matches what this page load was asked to start — otherwise a stale
  // draft for a different service could bleed into a fresh booking. This is
  // combined with the persist-on-change effect below (rather than kept as
  // two separate effects) so the very first commit can't write this
  // render's pre-resume defaults over the draft before the resume applies.
  useEffect(() => {
    if (!hasResumedRef.current) {
      hasResumedRef.current = true;
      const existingDraft = loadDraft();
      if (
        existingDraft &&
        existingDraft.categorySlug === startCategory.slug &&
        existingDraft.packageSlug === startPackage.slug
      ) {
        setStep(existingDraft.step);
        setVehicleSize(existingDraft.vehicleSize);
        setPkg(resolvePackage(existingDraft.categorySlug, existingDraft.packageSlug));
        setTintLevel(
          tintLevels.find((l) => l.value === existingDraft.tintLevelValue) ??
            tintLevels.find((l) => l.value === 35)!
        );
        setIsTesla(existingDraft.isTesla);
        setFilmType(filmTypes.find((f) => f.slug === existingDraft.filmSlug) ?? filmTypes[1]);
        setDate(existingDraft.date);
        setTime(existingDraft.time);
        setName(existingDraft.name);
        setPhone(existingDraft.phone);
        setEmail(existingDraft.email ?? "");
        setVehicleInfo(existingDraft.vehicleInfo);
        // Skip persisting this render's stale pre-resume values — the
        // setState calls above trigger another render/effect pass, which
        // will persist the correctly-resumed state instead.
        return;
      }
    }

    const draftToSave: Draft = {
      step,
      categorySlug,
      packageSlug: pkg.slug,
      vehicleSize,
      vehicleInfo,
      tintLevelValue: tintLevel.value,
      isTesla,
      filmSlug: filmType.slug,
      date,
      time,
      name,
      phone,
      email,
    };
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draftToSave));
    } catch {
      // sessionStorage unavailable (private browsing, etc.) — non-fatal.
    }
  }, [step, categorySlug, pkg, vehicleSize, vehicleInfo, tintLevel, isTesla, filmType, date, time, name, phone, email]);

  // Real availability, sourced from actual bookings for the selected date.
  useEffect(() => {
    if (!date) {
      setBookedRanges([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/booking/availability?date=${date}`)
      .then((res) => (res.ok ? res.json() : { bookedRanges: [] }))
      .then((data) => {
        if (!cancelled) setBookedRanges(data.bookedRanges ?? []);
      })
      .catch(() => {
        if (!cancelled) setBookedRanges([]);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const duration = pkg.durationMinutes ?? 60;
  const weekend = isWeekend(date);
  const availableSlots = useMemo(
    () => availableSlotsFor(duration, bookedRanges, weekend),
    [bookedRanges, duration, weekend]
  );

  const price = priceForSize(pkg, vehicleSize);
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
      const tintNote =
        category.visualizer === "tint"
          ? ` — ${tintLevel.label} tint, ${filmType.name}${isTesla ? ", Tesla (confirm pricing)" : ""}`
          : "";
      const res = await fetch("/api/booking/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: category.slug,
          packageSlug: pkg.slug,
          vehicleSize,
          vehicleInfo: `${vehicleInfo}${tintNote}`,
          name,
          phone,
          email: email || undefined,
          date,
          time,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      // Don't clear the draft here — for paid bookings this redirects to
      // Stripe first, and the customer may still cancel out of that. The
      // draft is cleared once they actually reach /booking/success instead.
      window.location.href = data.redirectUrl;
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const canGoNext = () => {
    if (step === 3) return Boolean(vehicleInfo);
    if (step === 4) return Boolean(date && time);
    if (step === 5) return Boolean(name && phone);
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
            <div className="mb-6 bg-white rounded-2xl overflow-hidden">
              <TintVisualizer
                hasTeslaVariant={category.hasTeslaVariant}
                level={tintLevel}
                setLevel={setTintLevel}
                isTesla={isTesla}
                setIsTesla={setIsTesla}
              />
              <TintFilmTypeSelector filmType={filmType} setFilmType={setFilmType} />
            </div>
          )}
          {category.visualizer === "ppf" && (
            <div className="mb-6">
              <PPFVisualizer packages={category.packages} categorySlug={category.slug} showCta={false} />
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{p.name}</h3>
                      {p.featured && (
                        <span className="chrome-chip text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
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
              ? "Tell us your vehicle and we'll figure out pricing automatically."
              : "Vehicle info helps us prepare, even though this service is priced separately."}
          </p>
          <VehiclePicker
            vehicleSize={vehicleSize}
            setVehicleSize={setVehicleSize}
            vehicleInfo={vehicleInfo}
            setVehicleInfo={setVehicleInfo}
          />
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
              min={todayIso()}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm"
            />
            {weekend && (
              <p className="text-xs text-red-400 mt-1">
                We&apos;re closed Saturdays and Sundays — please pick a weekday.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!date || weekend}
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
            {date && !weekend && availableSlots.length === 0 && (
              <p className="text-xs text-muted mt-1">
                No times left that day for this service&apos;s length — try another date.
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
              Email <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted"
            />
            <p className="text-xs text-muted mt-1">We&apos;ll send your confirmation and receipt here.</p>
          </div>
          <div className="flex items-center justify-between gap-4 bg-surface-2 border border-border rounded-lg px-3 py-2.5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Vehicle</p>
              <p className="text-sm mt-0.5">{vehicleInfo || "—"} ({vehicleSizeLabels[vehicleSize]})</p>
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs text-muted hover:text-foreground transition-colors underline underline-offset-4 shrink-0"
            >
              Change
            </button>
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
            {category.visualizer === "tint" && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                <span className="text-muted shrink-0">Tint &amp; Film</span>
                <span className="sm:text-right">
                  {tintLevel.label} &middot; {filmType.name}
                  {isTesla ? " · Tesla" : ""}
                </span>
              </div>
            )}
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
          {isTesla && category.hasTeslaVariant && (
            <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted">
              Tesla glass can require additional installation time — we&apos;ll
              confirm with you before your appointment if that changes your total.
            </div>
          )}
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
