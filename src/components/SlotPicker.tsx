"use client";

import { useEffect, useMemo, useState } from "react";
import {
  timeSlots,
  availableSlotsFor,
  upcomingBookableDates,
  shortDateLabel,
  bookableDaysLabel,
  isAllDayJob,
  type BookedRange,
} from "@/lib/scheduling";

/** How many bookable days to show before the "show more" button. Two
 * weekends: far enough to find a slot, short enough to stay one screen. */
const INITIAL_DAYS = 4;
const MORE_DAYS = 4;

type DayAvailability = {
  date: string;
  open: string[];
  booked: BookedRange[];
};

/**
 * Dates and times as one grid, instead of a date field and a dropdown.
 *
 * The old step asked people to guess a date, then told them off for picking a
 * weekday, then revealed the times only after they had guessed right. This
 * shows the real dates the business works and every slot on them at once.
 *
 * Taken slots are shown rather than hidden. It costs nothing — the times are
 * public the moment you try them — and a column with three of six already
 * gone says something a list of free slots cannot.
 */
export default function SlotPicker({
  duration,
  date,
  time,
  onPick,
}: {
  /** Total minutes of everything being booked, so a long job correctly
   * cannot start at a slot that would run past closing. */
  duration: number;
  date: string;
  time: string;
  onPick: (date: string, time: string) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_DAYS);
  const [byDate, setByDate] = useState<Record<string, BookedRange[]> | null>(null);
  const [failed, setFailed] = useState(false);

  // Recomputed only when the count changes, not on every render: this reads
  // the clock, and a value that shifts underneath the list would let a
  // midnight rollover reshuffle the dates while someone is looking at them.
  const dates = useMemo(() => upcomingBookableDates(visibleCount), [visibleCount]);
  const key = dates.join(",");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/booking/availability?dates=${key}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad response"))))
      .then((data) => {
        if (cancelled) return;
        setByDate(data.byDate ?? {});
        // Cleared here rather than at the top of the effect: setting state
        // synchronously in an effect body cascades a render, and the flag
        // only means anything once a response has actually arrived.
        setFailed(false);
      })
      .catch(() => {
        // Show the days with every slot open rather than an empty picker: the
        // API re-checks availability at checkout, so the worst case is a
        // taken slot being refused there rather than a booking going through
        // twice. An empty picker looks like a business with no availability.
        if (!cancelled) {
          setByDate({});
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const days: DayAvailability[] = useMemo(
    () =>
      dates.map((d) => {
        const booked = byDate?.[d] ?? [];
        return { date: d, open: availableSlotsFor(duration, booked, d), booked };
      }),
    [dates, byDate, duration]
  );

  const loading = byDate === null;

  return (
    <div>
      <p className="text-sm text-muted mb-4">
        Appointments run {bookableDaysLabel()}. Pick any open time
        below &mdash; greyed-out ones are already taken.
      </p>

      {/* A job longer than a single day can only start in the morning, so the
          picker offers just that slot. Say why, rather than let it look like
          every day is nearly full. */}
      {isAllDayJob(duration) && (
        <p className="text-sm text-foreground bg-surface-2 border border-border rounded-lg p-3 mb-4">
          That&apos;s a full day&apos;s work, so it books as a morning start &mdash; we&apos;ll
          confirm the finish time with you, and larger jobs may carry into a second day.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {days.map((day) => {
          const fullyBooked = !loading && day.open.length === 0;
          return (
            <div
              key={day.date}
              className={`rounded-xl border p-4 ${
                fullyBooked ? "border-border bg-surface-2/40" : "border-border bg-surface"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <p className="text-sm font-semibold">{shortDateLabel(day.date)}</p>
                {!loading && (
                  <p className="text-[11px] text-muted tabular-nums">
                    {fullyBooked
                      ? "Fully booked"
                      : `${day.open.length} of ${timeSlots.length} open`}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot) => {
                  const isOpen = day.open.includes(slot);
                  const selected = date === day.date && time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={loading || !isOpen}
                      onClick={() => onPick(day.date, slot)}
                      aria-pressed={selected}
                      // The unavailable reason is in the label rather than
                      // only in the styling, so it survives being read out.
                      aria-label={
                        isOpen
                          ? `${shortDateLabel(day.date)} at ${slot}`
                          : `${shortDateLabel(day.date)} at ${slot} — unavailable`
                      }
                      className={`rounded-lg border px-3 py-2 text-xs font-medium tabular-nums transition-colors ${
                        selected
                          ? "border-accent bg-accent text-accent-foreground"
                          : isOpen
                            ? "border-border bg-surface-2 hover:border-muted"
                            : "border-border/50 bg-transparent text-muted/40 line-through cursor-not-allowed"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
        <button
          type="button"
          onClick={() => setVisibleCount((n) => n + MORE_DAYS)}
          className="text-sm font-medium underline underline-offset-4 text-muted hover:text-foreground transition-colors"
        >
          Show more dates
        </button>
        {failed && (
          <p className="text-xs text-muted">
            Couldn&apos;t load what&apos;s already booked &mdash; we&apos;ll confirm your
            time when you check out.
          </p>
        )}
      </div>
    </div>
  );
}
