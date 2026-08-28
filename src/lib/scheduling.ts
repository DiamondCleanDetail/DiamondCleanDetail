export const timeSlots = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"];
export const CLOSING_MINUTES = 18 * 60; // 6:00 PM — matches serviceArea.ts business hours.

/**
 * Every date this business schedules against is a Mountain Time calendar date:
 * the shop is in the Denver metro, and the hours in serviceArea.ts are local
 * ones. "Today" therefore has to mean "today in Denver" no matter where the
 * code runs.
 *
 * It did not used to. `todayIso()` derived the date from the ambient process
 * timezone, so the browser answered with the customer's timezone and the
 * server answered with its own — UTC on Vercel. Those two disagree for the
 * last six hours of every Denver day (from 18:00 MDT, 17:00 MST, when UTC has
 * already rolled over), and in that window the date picker would happily offer
 * today while the API rejected it as "That date has already passed."
 */
export const BUSINESS_TIME_ZONE = "America/Denver";

const businessDateParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: BUSINESS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function parseTimeToMinutes(time: string): number {
  const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const meridiem = m[3].toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

export function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

/** True only for a zero-padded `YYYY-MM-DD` naming a real calendar day.
 *
 * Booking dates are compared as strings, which is only meaningful while every
 * value is in this one format — "08/31/2026" sorts before every ISO date and
 * would be rejected as being in the past rather than as being malformed. */
export function isValidIsoDate(dateStr: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return false;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const asUtc = new Date(Date.UTC(year, month - 1, day));
  // Round-trip catches 2026-02-30 and friends, which Date would roll forward.
  return (
    asUtc.getUTCFullYear() === year &&
    asUtc.getUTCMonth() === month - 1 &&
    asUtc.getUTCDate() === day
  );
}

/** Today's date in the shop's timezone, as `YYYY-MM-DD`.
 *
 * Takes `now` so tests can pin an instant; callers pass nothing. */
export function todayIso(now: Date = new Date()): string {
  const parts = businessDateParts.formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** Whether `dateStr` is in the past relative to the shop's current date. */
export function isPastDate(dateStr: string, now: Date = new Date()): boolean {
  return dateStr < todayIso(now);
}

export function isWeekend(dateStr: string): boolean {
  if (!isValidIsoDate(dateStr)) return false;
  // Read the day off the calendar date itself rather than parsing it into an
  // instant, so the answer can't shift with whatever timezone is running this.
  const [year, month, day] = dateStr.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return weekday === 0 || weekday === 6;
}

export type BookedRange = { time: string; durationMinutes: number };

/** Time slots that fit a service of `duration` minutes without running past
 * closing or overlapping an existing booking. */
export function availableSlotsFor(
  duration: number,
  bookedRanges: BookedRange[],
  weekend: boolean
): string[] {
  if (weekend) return [];
  return timeSlots.filter((slot) => {
    const start = parseTimeToMinutes(slot);
    const end = start + duration;
    if (end > CLOSING_MINUTES) return false;
    return !bookedRanges.some((b) => {
      const bStart = parseTimeToMinutes(b.time);
      const bEnd = bStart + b.durationMinutes;
      return rangesOverlap(start, end, bStart, bEnd);
    });
  });
}
