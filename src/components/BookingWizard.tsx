"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  catalog,
  getCategory,
  vehicleSizeLabels,
  VehicleSize,
  priceLabel,
  formatPrice,
  resolveLinePrice,
} from "@/data/catalog";
import Image from "next/image";
import TintVisualizer from "@/components/TintVisualizer";
import TintFilmTypeSelector from "@/components/TintFilmTypeSelector";
import PPFVisualizer from "@/components/PPFVisualizer";
import VehiclePicker from "@/components/VehiclePicker";
import AddOnSelector from "@/components/AddOnSelector";
import { tintLevels } from "@/data/tintLevels";
import { filmTypes } from "@/data/filmTypes";
import { teslaCoverages, teslaCoveragesFor, teslaModelFromVehicleInfo } from "@/data/teslaTint";
import {
  todayIso,
  isBookableDay,
  bookableDaysLabel,
  availableSlotsFor,
  leadTimeLabel,
  type BookedRange,
} from "@/lib/scheduling";
import { serviceArea } from "@/data/serviceArea";
import { guarantee, policies } from "@/data/policies";

type Phase = "select" | "configure" | "vehicle" | "datetime" | "details" | "pay";

const phaseLabels: Record<Phase, string> = {
  select: "Services",
  configure: "Options",
  vehicle: "Vehicle",
  datetime: "Date & Time",
  details: "Details",
  pay: "Pay",
};
const phaseOrder: Phase[] = ["select", "configure", "vehicle", "datetime", "details", "pay"];

type ServiceSelection = {
  serviceSlug: string;
  packageSlug: string;
  addOnSlugs?: string[];
  tintLevelValue?: number;
  filmSlug?: string;
  isTesla?: boolean;
  /** Which Tesla coverage option, when isTesla is set — Teslas price on
   * coverage x film rather than on vehicle size. */
  teslaCoverageSlug?: string;
};

type Draft = {
  phase: Phase;
  configureIndex: number;
  selections: ServiceSelection[];
  vehicleSize: VehicleSize;
  vehicleInfo: string;
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
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate the shape before trusting it — an older version of this
    // wizard (or a future one) may have written a differently-shaped
    // draft under the same key, which would otherwise crash the page.
    if (!parsed || !Array.isArray(parsed.selections)) return null;
    return parsed as Draft;
  } catch {
    return null;
  }
}

export default function BookingWizard({
  initialCategory,
  initialPackage,
  initialTint,
  initialFilm,
  initialTesla,
  initialVehicleSize,
  initialVehicleInfo,
}: {
  initialCategory?: string;
  initialPackage?: string;
  initialTint?: string;
  initialFilm?: string;
  initialTesla?: boolean;
  initialVehicleSize?: VehicleSize;
  initialVehicleInfo?: string;
}) {
  const hasValidInitialSelection = Boolean(initialCategory && getCategory(initialCategory));
  const startCategory = getCategory(initialCategory ?? "");
  const startPackage = startCategory?.packages.find((p) => p.slug === initialPackage) ?? startCategory?.packages[0];

  // State starts from SSR-safe defaults only — sessionStorage isn't
  // available on the server, so reading it here would make the client's
  // first render diverge from the server-rendered HTML (a hydration
  // mismatch). Any saved draft is applied after mount instead, below.
  const [phase, setPhase] = useState<Phase>("select");
  const [configureIndex, setConfigureIndex] = useState(0);
  const [selections, setSelections] = useState<ServiceSelection[]>(() =>
    hasValidInitialSelection && startCategory && startPackage
      ? [
          {
            serviceSlug: startCategory.slug,
            packageSlug: startPackage.slug,
            tintLevelValue: initialTint ? Number(initialTint) : undefined,
            filmSlug: initialFilm,
            isTesla: initialTesla,
          },
        ]
      : []
  );
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>(initialVehicleSize ?? "sedan");
  const [vehicleInfo, setVehicleInfo] = useState(initialVehicleInfo ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);

  const hasResumedRef = useRef(false);

  // Scroll back to the top of the wizard whenever the step changes — on
  // mobile, a long step otherwise leaves the next one opening mid-scroll,
  // which reads as "nothing happened". Skipped on first render so landing
  // on /booking doesn't yank the page. scroll-mt on the root keeps the top
  // clear of the sticky navbar.
  const wizardTopRef = useRef<HTMLDivElement>(null);
  const hasRenderedRef = useRef(false);

  // Resume an in-progress booking (e.g. after canceling out of Stripe or an
  // accidental reload) once mounted on the client. Any saved draft wins over
  // a fresh URL's pre-selection — it reflects more progress than a bare link
  // ever could.
  useEffect(() => {
    if (!hasResumedRef.current) {
      hasResumedRef.current = true;
      const existingDraft = loadDraft();
      if (existingDraft && existingDraft.selections.length > 0) {
        setPhase(existingDraft.phase);
        setConfigureIndex(existingDraft.configureIndex);
        setSelections(existingDraft.selections);
        setVehicleSize(existingDraft.vehicleSize);
        setVehicleInfo(existingDraft.vehicleInfo);
        setDate(existingDraft.date);
        setTime(existingDraft.time);
        setName(existingDraft.name);
        setPhone(existingDraft.phone);
        setEmail(existingDraft.email ?? "");
        // Skip persisting this render's stale pre-resume values — the
        // setState calls above trigger another render/effect pass, which
        // will persist the correctly-resumed state instead.
        return;
      }
    }

    const draftToSave: Draft = {
      phase,
      configureIndex,
      selections,
      vehicleSize,
      vehicleInfo,
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
  }, [phase, configureIndex, selections, vehicleSize, vehicleInfo, date, time, name, phone, email]);

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

  const resolved = useMemo(
    () =>
      selections.map((s) => {
        const category = getCategory(s.serviceSlug)!;
        const pkg = category.packages.find((p) => p.slug === s.packageSlug) ?? category.packages[0];
        // Drop any add-on the chosen package already covers, so switching to a
        // fuller tier can't leave a duplicate charge behind.
        const addOns = (category.addOns ?? []).filter(
          (a) => (s.addOnSlugs ?? []).includes(a.slug) && !a.includedIn?.includes(pkg.slug)
        );
        // The film selector shows a default without necessarily having
        // written it to state, and for a Tesla the film is half the price
        // lookup — so settle it here rather than letting each caller pick its
        // own fallback.
        const filmSlug =
          category.visualizer === "tint" ? (s.filmSlug ?? filmTypes[1].slug) : s.filmSlug;
        return { ...s, filmSlug, category, pkg, addOns };
      }),
    [selections]
  );

  const addOnsTotalFor = (addOns: { price: number }[]) =>
    addOns.reduce((n, a) => n + a.price, 0);

  // Which of today's slots are still reachable depends on the time of day, so
  // this has to keep up while the customer sits on the step — otherwise the
  // form goes on offering a slot the API has already started refusing, which
  // is the same picker/validator disagreement the date check used to have.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (phase !== "datetime") return;
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, [phase]);

  const current = resolved[configureIndex];
  const totalDuration = resolved.reduce((sum, r) => sum + (r.pkg.durationMinutes ?? 60), 0) || 60;
  // Named for what it means to the customer, not for the calendar: the
  // closed days are a fact of Farhan's current availability, not of
  // weekends. See BOOKABLE_DAYS in scheduling.ts.
  const unavailableDay = Boolean(date) && !isBookableDay(date);
  const availableSlots = useMemo(
    () => availableSlotsFor(totalDuration, bookedRanges, date, now),
    [bookedRanges, totalDuration, date, now]
  );

  // One helper for every price shown in this form, so the summary, the
  // deposit and the per-line figures can't diverge from each other — or from
  // what the API recomputes before charging.
  const linePrice = (r: (typeof resolved)[number]) =>
    resolveLinePrice(r.pkg, vehicleSize, {
      isTesla: r.isTesla,
      filmSlug: r.filmSlug,
      teslaCoverageSlug: r.teslaCoverageSlug,
    }) ?? 0;

  const subtotal = resolved.reduce((sum, r) => sum + linePrice(r) + addOnsTotalFor(r.addOns), 0);
  const totalDeposit = resolved.reduce((sum, r) => {
    const price = linePrice(r);
    const deposit = r.pkg.depositPercent ? Math.round((price * r.pkg.depositPercent) / 100) : 0;
    // Quote-only packages stay at $0 — their add-ons get quoted with the job
    // rather than charged against a price we haven't given yet.
    if (r.pkg.pricing.type === "quote") return sum;
    return sum + (deposit > 0 ? deposit : price) + addOnsTotalFor(r.addOns);
  }, 0);
  const hasQuoteItem = resolved.some((r) => r.pkg.pricing.type === "quote");
  const allQuoteItems = resolved.length > 0 && resolved.every((r) => r.pkg.pricing.type === "quote");

  function toggleService(slug: string) {
    setSelections((prev) => {
      if (prev.some((s) => s.serviceSlug === slug)) {
        return prev.filter((s) => s.serviceSlug !== slug);
      }
      const category = getCategory(slug)!;
      return [...prev, { serviceSlug: slug, packageSlug: category.packages[0].slug }];
    });
  }

  function toggleAddOn(slug: string) {
    setSelections((prev) =>
      prev.map((s, i) => {
        if (i !== configureIndex) return s;
        const current = s.addOnSlugs ?? [];
        return {
          ...s,
          addOnSlugs: current.includes(slug)
            ? current.filter((x) => x !== slug)
            : [...current, slug],
        };
      })
    );
  }

  function updateCurrentSelection(patch: Partial<ServiceSelection>) {
    setSelections((prev) => prev.map((s, i) => (i === configureIndex ? { ...s, ...patch } : s)));
  }

  function handleBack() {
    if (phase === "configure") {
      if (configureIndex > 0) setConfigureIndex((i) => i - 1);
      else setPhase("select");
    } else if (phase === "vehicle") {
      setConfigureIndex(Math.max(0, selections.length - 1));
      setPhase("configure");
    } else if (phase === "datetime") setPhase("vehicle");
    else if (phase === "details") setPhase("datetime");
    else if (phase === "pay") setPhase("details");
  }

  function handleContinue() {
    if (phase === "select") {
      setConfigureIndex(0);
      setPhase("configure");
    } else if (phase === "configure") {
      if (configureIndex < selections.length - 1) setConfigureIndex((i) => i + 1);
      else setPhase("vehicle");
    } else if (phase === "vehicle") setPhase("datetime");
    else if (phase === "datetime") setPhase("details");
    else if (phase === "details") setPhase("pay");
    else if (phase === "pay") submitBooking();
  }

  const canContinue = (() => {
    if (phase === "select") return selections.length > 0;
    // A Tesla with no coverage picked has no price, and the step it is chosen
    // on is the one being left — so it is checked here rather than discovered
    // as a $0 line on the payment step.
    if (phase === "configure") {
      return !(current?.isTesla && current.category.hasTeslaVariant && !current.teslaCoverageSlug);
    }
    if (phase === "vehicle") return Boolean(vehicleInfo);
    if (phase === "datetime") return Boolean(date && time && availableSlots.includes(time));
    if (phase === "details") return Boolean(name && phone);
    return true;
  })();

  async function submitBooking() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const items = resolved.map((r) => {
        const tintNote =
          r.category.visualizer === "tint"
            ? ` — ${(tintLevels.find((l) => l.value === (r.tintLevelValue ?? 35)) ?? tintLevels.find((l) => l.value === 35)!).label} tint, ${(filmTypes.find((f) => f.slug === r.filmSlug) ?? filmTypes[1]).name}${r.isTesla ? `, Tesla — ${teslaCoverages.find((c) => c.slug === r.teslaCoverageSlug)?.name ?? "coverage to confirm"}` : ""}`
            : "";
        return {
          serviceSlug: r.category.slug,
          packageSlug: r.pkg.slug,
          addOnSlugs: r.addOnSlugs ?? [],
          note: tintNote,
          // Sent as the customer's choices, not as a price. The server looks
          // the figure up from the same table this form did.
          isTesla: r.isTesla,
          filmSlug: r.filmSlug,
          teslaCoverageSlug: r.teslaCoverageSlug,
        };
      });
      const res = await fetch("/api/booking/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          vehicleSize,
          vehicleInfo,
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

  const phaseIndex = phaseOrder.indexOf(phase);

  useEffect(() => {
    if (!hasRenderedRef.current) {
      hasRenderedRef.current = true;
      return;
    }
    wizardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase, configureIndex]);

  return (
    <div ref={wizardTopRef} className="scroll-mt-24">
      {/* Progress — compact on mobile, full stepper from sm up */}
      <div className="sm:hidden mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm font-medium">
            {phaseLabels[phase]}
            {phase === "configure" && selections.length > 1 ? ` (${configureIndex + 1}/${selections.length})` : ""}
          </span>
          <span className="text-xs text-muted">
            Step {phaseIndex + 1} of {phaseOrder.length}
          </span>
        </div>
        <div className="h-1 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((phaseIndex + 1) / phaseOrder.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="no-scrollbar hidden sm:flex items-center gap-1 mb-8 overflow-x-auto">
        {phaseOrder.map((p, i) => {
          const active = i === phaseIndex;
          const done = i < phaseIndex;
          return (
            <div key={p} className="flex items-center gap-1 shrink-0">
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
                  {done ? "✓" : i + 1}
                </span>
                {phaseLabels[p]}
                {p === "configure" && selections.length > 1 && active ? ` (${configureIndex + 1}/${selections.length})` : ""}
              </div>
              {i < phaseOrder.length - 1 && <span className="text-muted text-xs px-0.5">&rarr;</span>}
            </div>
          );
        })}
      </div>

      {/* Select services */}
      {phase === "select" && (
        <div>
          <p className="text-sm text-muted mb-4">
            {selections.length > 0
              ? "Would you like to add any additional services to this booking?"
              : "Choose one or more services to book together."}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {catalog.map((c) => {
              const checked = selections.some((s) => s.serviceSlug === c.slug);
              return (
                <button
                  type="button"
                  key={c.slug}
                  onClick={() => toggleService(c.slug)}
                  aria-pressed={checked}
                  className={`text-left rounded-xl overflow-hidden transition-colors border ${
                    checked ? "border-accent bg-accent/10" : "bg-surface border-border hover:border-muted"
                  }`}
                >
                  <div className="relative aspect-[16/10] bg-surface-2">
                    {c.cardImage ? (
                      <Image
                        src={c.cardImage}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className={`object-cover transition-opacity ${checked ? "opacity-100" : "opacity-80"}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-[11px] text-muted text-center px-3">Photo coming soon</p>
                      </div>
                    )}
                    <span
                      className={`absolute top-2 right-2 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                        checked
                          ? "bg-accent border-accent text-accent-foreground"
                          : "bg-background/80 backdrop-blur-sm border-border"
                      }`}
                    >
                      {checked && "✓"}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-sm sm:text-base">{c.name}</h3>
                    <p className="hidden sm:block text-sm text-muted mt-1">{c.summary}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Configure each selected service */}
      {phase === "configure" && current && (
        <div>
          <h2 className="font-semibold text-lg mb-1">{current.category.name}</h2>
          <p className="text-sm text-muted mb-6">{current.category.summary}</p>
          {current.category.visualizer === "tint" && (
            <div className="mb-6 bg-white rounded-2xl overflow-hidden">
              <TintVisualizer
                level={
                  tintLevels.find((l) => l.value === (current.tintLevelValue ?? 35)) ??
                  tintLevels.find((l) => l.value === 35)!
                }
                setLevel={(l) => updateCurrentSelection({ tintLevelValue: l.value })}
                vehicleSize={vehicleSize}
              />
              <TintFilmTypeSelector
                filmType={filmTypes.find((f) => f.slug === current.filmSlug) ?? filmTypes[1]}
                setFilmType={(f) => updateCurrentSelection({ filmSlug: f.slug })}
              />
              {current.category.hasTeslaVariant && (
                <div className="px-5 sm:px-8 pb-8">
                  <label className="flex items-center gap-2.5 text-sm text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={current.isTesla ?? false}
                      onChange={(e) => updateCurrentSelection({ isTesla: e.target.checked })}
                      className="h-4 w-4 rounded border-2 border-neutral-300 accent-neutral-900"
                    />
                    This is a Tesla
                  </label>
                  {/* A Tesla prices on coverage x film rather than on vehicle
                      size, so picking the Tesla box swaps in its own coverage
                      options. Model 3 and the rest genuinely differ: the
                      rear-window choice exists only on a Model 3, and it is a
                      real price difference, not a detail. Where we already
                      know the model from the vehicle field we only offer that
                      model's options. */}
                  {current.isTesla && (
                    <div className="mt-4">
                      <p className="text-xs text-neutral-500 mb-2">
                        Tesla glass is priced per coverage and film. Pick the coverage you want:
                      </p>
                      <div className="space-y-2">
                        {teslaCoveragesFor(teslaModelFromVehicleInfo(vehicleInfo)).map((c) => {
                          const film = current.filmSlug ?? filmTypes[1].slug;
                          const price = c.prices[film as keyof typeof c.prices];
                          const selected = current.teslaCoverageSlug === c.slug;
                          return (
                            <label
                              key={c.slug}
                              className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-colors ${
                                selected
                                  ? "border-neutral-900 bg-neutral-50"
                                  : "border-neutral-200 hover:border-neutral-400"
                              }`}
                            >
                              <input
                                type="radio"
                                name="tesla-coverage"
                                checked={selected}
                                onChange={() => updateCurrentSelection({ teslaCoverageSlug: c.slug })}
                                className="h-4 w-4 accent-neutral-900"
                              />
                              <span className="flex-1 min-w-0">
                                <span className="block text-sm font-medium text-neutral-900">{c.name}</span>
                                <span className="block text-xs text-neutral-500">{c.models}</span>
                              </span>
                              <span className="text-sm font-bold text-neutral-900 tabular-nums shrink-0">
                                {formatPrice(price)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {!current.teslaCoverageSlug && (
                        <p className="mt-2 text-xs text-neutral-500">
                          Choose one to see your total — Tesla pricing replaces the standard coverage price.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {current.category.visualizer === "ppf" && (
            <div className="mb-6">
              <PPFVisualizer packages={current.category.packages} categorySlug={current.category.slug} showCta={false} />
            </div>
          )}
          <div className="grid gap-3">
            {current.category.packages.map((p) => (
              <button
                type="button"
                key={p.slug}
                onClick={() => updateCurrentSelection({ packageSlug: p.slug })}
                className={`text-left bg-surface border rounded-xl p-5 transition-colors ${
                  current.pkg.slug === p.slug ? "border-accent" : "border-border hover:border-muted"
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
                  <p className="chrome-text font-semibold shrink-0">{priceLabel(p, "sedan")}</p>
                </div>
              </button>
            ))}
          </div>

          {current.category.addOns && current.category.addOns.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold">Add-Ons</h3>
              <p className="text-sm text-muted mt-1 mb-4">
                Optional extras for high-wear areas. Anything your package already covers is
                marked as included.
              </p>
              <AddOnSelector
                addOns={current.category.addOns}
                selected={current.addOnSlugs ?? []}
                onToggle={toggleAddOn}
                packageSlug={current.pkg.slug}
              />
            </div>
          )}
        </div>
      )}

      {/* Vehicle */}
      {phase === "vehicle" && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-sm text-muted mb-4">
            One vehicle for this whole booking — we&apos;ll figure out pricing for each service automatically.
          </p>
          <VehiclePicker
            vehicleSize={vehicleSize}
            setVehicleSize={setVehicleSize}
            vehicleInfo={vehicleInfo}
            setVehicleInfo={setVehicleInfo}
          />
        </div>
      )}

      {/* Date & Time */}
      {phase === "datetime" && (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            {/* Stated up front rather than as an error after picking a
                closed day — nobody should discover the restriction four
                steps into the funnel. */}
            <p className="text-xs text-muted mb-2">
              Appointments run {bookableDaysLabel()} — weekdays are fully booked.
            </p>
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
            {unavailableDay && (
              <p className="text-xs text-red-400 mt-1">
                We&apos;re fully booked that day — appointments are {bookableDaysLabel()}.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!date || unavailableDay}
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
            {date && !unavailableDay && availableSlots.length === 0 && (
              <p className="text-xs text-muted mt-1">
                {date === todayIso()
                  ? `We need at least ${leadTimeLabel()}' notice to get to you, so there's nothing left today — please pick another date.`
                  : `No times left that day for ${selections.length > 1 ? "this combined booking" : "this service"} — try another date.`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Details */}
      {phase === "details" && (
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
              <p className="text-sm mt-0.5">
                {vehicleInfo || "—"} ({vehicleSizeLabels[vehicleSize]})
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPhase("vehicle")}
              className="text-xs text-muted hover:text-foreground transition-colors underline underline-offset-4 shrink-0"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Pay / Summary */}
      {phase === "pay" && (
        <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 space-y-4">
          <div className="bg-surface-2 rounded-lg p-4 space-y-3 text-sm">
            {resolved.map((r) => (
              <div key={r.serviceSlug} className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 pb-3 border-b border-border last:border-b-0 last:pb-0">
                <div>
                  <p>
                    {r.category.name} — {r.pkg.name}
                  </p>
                  {r.category.visualizer === "tint" && (
                    <p className="text-muted text-xs mt-0.5">
                      {(tintLevels.find((l) => l.value === (r.tintLevelValue ?? 35)) ?? tintLevels.find((l) => l.value === 35)!).label}{" "}
                      tint &middot; {(filmTypes.find((f) => f.slug === r.filmSlug) ?? filmTypes[1]).name}
                      {r.isTesla ? " · Tesla" : ""}
                    </p>
                  )}
                  {/* Add-ons are part of the charge, so they must be itemized
                      here — otherwise the listed prices don't sum to the total. */}
                  {r.addOns.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {r.addOns.map((a) => (
                        <li key={a.slug} className="text-muted text-xs">
                          + {a.name} · ${a.price}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <span className="sm:text-right shrink-0">
                  {r.pkg.pricing.type === "quote" ? "Priced after assessment" : formatPrice(linePrice(r))}
                </span>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 pt-1">
              <span className="text-muted shrink-0">Vehicle</span>
              <span className="sm:text-right">
                {vehicleInfo || "—"} ({vehicleSizeLabels[vehicleSize]})
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-muted shrink-0">Date &amp; Time</span>
              <span className="sm:text-right">
                {date || "—"} at {time || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-2 border-t border-border">
              <span className="text-muted shrink-0">Total</span>
              <span className="font-semibold text-right">
                {allQuoteItems ? "Priced after assessment" : hasQuoteItem ? `${formatPrice(subtotal)} + quoted items` : formatPrice(subtotal)}
              </span>
            </div>
            {!allQuoteItems && totalDeposit > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-muted shrink-0">Due now</span>
                <span className="font-semibold chrome-text text-right">{formatPrice(totalDeposit)}</span>
              </div>
            )}
          </div>
          {resolved.some((r) => r.isTesla && r.category.hasTeslaVariant) && (
            <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted">
              Tesla glass can require additional installation time — we&apos;ll confirm with you before your
              appointment if that changes your total.
            </div>
          )}
          {allQuoteItems ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted">
              No payment is required to request a quote — we&apos;ll follow up with pricing after reviewing the
              details.
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted">
              You&apos;ll be taken to Stripe&apos;s secure checkout to complete payment.
              {hasQuoteItem && " Quote-only services above won't be charged."}
            </div>
          )}
          {/* The guarantee sits at the payment step rather than only on a
              marketing page, because this is the moment it answers a question
              someone is actually asking — what happens if this goes wrong. */}
          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              {guarantee.name}
            </p>
            <p className="text-xs text-muted mt-2 leading-relaxed">{guarantee.promise}</p>
            <p className="text-xs text-muted mt-2 leading-relaxed">{policies.weather.a}</p>
          </div>
          {submitError && <p className="text-sm text-red-400">{submitError}</p>}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={phase === "select" || submitting}
          className="px-5 py-2 rounded-lg font-medium text-sm border border-border text-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue || submitting}
          className="chrome-btn px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {phase === "pay"
            ? submitting
              ? "Processing..."
              : allQuoteItems
                ? "Request Quote"
                : `Pay ${formatPrice(totalDeposit || subtotal || 0)} & Book`
            : "Continue"}
        </button>
      </div>

      {/* Escape hatch for anyone who'd rather not book or pay online. */}
      <p className="text-center text-xs text-muted mt-6">
        Prefer to talk it through?{" "}
        <a
          href={`tel:${serviceArea.phoneHref}`}
          className="text-foreground underline underline-offset-4 hover:text-accent transition-colors"
        >
          Call {serviceArea.phone.replace(/^\+1 /, "")}
        </a>{" "}
        — Monday to Friday, 8:00 AM to 7:00 PM.
      </p>
    </div>
  );
}
