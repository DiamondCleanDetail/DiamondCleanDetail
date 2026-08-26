"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getCategory, priceForSize, priceLabel, VehicleSize } from "@/data/catalog";
import VehiclePicker from "@/components/VehiclePicker";
import { todayIso, isWeekend, availableSlotsFor, type BookedRange } from "@/lib/scheduling";

export default function CartPage() {
  const { items, removeItem } = useCart();
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>("sedan");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);

  const resolved = useMemo(
    () =>
      items
        .map((item) => {
          const category = getCategory(item.serviceSlug);
          const pkg = category?.packages.find((p) => p.slug === item.packageSlug);
          return category && pkg ? { ...item, category, pkg } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [items]
  );

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

  const totalDuration = resolved.reduce((sum, r) => sum + (r.pkg.durationMinutes ?? 60), 0) || 60;
  const weekend = isWeekend(date);
  const availableSlots = useMemo(
    () => availableSlotsFor(totalDuration, bookedRanges, weekend),
    [bookedRanges, totalDuration, weekend]
  );

  const subtotal = resolved.reduce((sum, r) => sum + (priceForSize(r.pkg, vehicleSize) ?? 0), 0);
  const hasQuoteItem = resolved.some((r) => r.pkg.pricing.type === "quote");

  const canSubmit =
    resolved.length > 0 && Boolean(vehicleInfo) && Boolean(date) && Boolean(time) && Boolean(name) && Boolean(phone);

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: resolved.map((r) => ({ serviceSlug: r.category.slug, packageSlug: r.pkg.slug })),
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
      window.location.href = data.redirectUrl;
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (resolved.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted mb-6">Add a package from any service page to book multiple services in one checkout.</p>
        <Link href="/services" className="chrome-btn inline-block px-6 py-2 rounded-lg font-semibold text-sm">
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Cart</h1>
      <p className="text-sm sm:text-base text-muted mb-8">
        Book multiple services for the same vehicle and appointment in one checkout.
      </p>

      <div className="space-y-3 mb-8">
        {resolved.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-4 bg-surface border border-border rounded-xl p-4"
          >
            <div>
              <p className="font-semibold text-sm">
                {r.category.name} — {r.pkg.name}
              </p>
              <p className="text-xs text-muted mt-0.5">{r.pkg.tagline}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <p className="chrome-text font-semibold text-sm">{priceLabel(r.pkg, vehicleSize)}</p>
              <button
                type="button"
                onClick={() => removeItem(r.id)}
                aria-label={`Remove ${r.category.name} — ${r.pkg.name} from cart`}
                className="text-xs text-muted hover:text-foreground transition-colors underline underline-offset-4"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Vehicle</h2>
        <VehiclePicker
          vehicleSize={vehicleSize}
          setVehicleSize={setVehicleSize}
          vehicleInfo={vehicleInfo}
          setVehicleInfo={setVehicleInfo}
        />
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-6 space-y-4">
        <h2 className="font-semibold">Date &amp; Time</h2>
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
            <p className="text-xs text-red-400 mt-1">We&apos;re closed Saturdays and Sundays — please pick a weekday.</p>
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
            <p className="text-xs text-muted mt-1">No times left that day for this combined booking — try another date.</p>
          )}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-6 space-y-4">
        <h2 className="font-semibold">Your Details</h2>
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
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-muted">Total ({resolved.length} service{resolved.length > 1 ? "s" : ""})</span>
          <span className="font-semibold">
            {hasQuoteItem ? `From $${subtotal} + quoted items` : `$${subtotal}`}
          </span>
        </div>
        {hasQuoteItem && (
          <p className="text-xs text-muted mb-4">
            One or more items in your cart are priced after assessment — we&apos;ll follow up on those separately.
          </p>
        )}
        {submitError && <p className="text-sm text-red-400 mb-4">{submitError}</p>}
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || submitting}
          className="chrome-btn w-full px-6 py-3 rounded-lg font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Processing..." : "Pay & Book All"}
        </button>
      </div>
    </div>
  );
}
