export const timeSlots = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"];
export const CLOSING_MINUTES = 18 * 60; // 6:00 PM — matches serviceArea.ts business hours.

/**
 * How much warning the crew needs before a job starts, in minutes.
 *
 * This is a mobile service: the van has to be loaded and driven across the
 * Denver metro, so a slot that starts shortly from now can't actually be
 * honoured. Two hours still leaves same-day booking genuinely useful — at
 * 10am you can take the noon slot — while ruling out the ones nobody can
 * make. Change this one number to change the rule everywhere; the booking
 * form and the API both read it.
 */
export const MIN_LEAD_TIME_MINUTES = 120;

/** The lead time as a short phrase for customer-facing copy ("2 hours"). */
export function leadTimeLabel(minutes: number = MIN_LEAD_TIME_MINUTES): string {
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }
  return `${minutes} minutes`;
}

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

const businessClockParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: BUSINESS_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Minutes since midnight *in Denver* — the same axis slot times live on.
 *
 * Read from the shop's clock rather than the running process's, for the same
 * reason todayIso() is: the browser and the server are in different places. */
export function minutesIntoBusinessDay(now: Date = new Date()): number {
  const parts = businessClockParts.formatToParts(now);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return part("hour") * 60 + part("minute");
}

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

/** Whether a slot starts too soon to be worth offering.
 *
 * Only today's slots can be: any later date is a whole day away, and an
 * earlier one is already caught by isPastDate. Without this, today's
 * 9:00 AM stayed bookable at 4:00 PM. */
export function isSlotTooSoon(
  dateStr: string,
  time: string,
  now: Date = new Date()
): boolean {
  if (dateStr !== todayIso(now)) return false;
  return parseTimeToMinutes(time) < minutesIntoBusinessDay(now) + MIN_LEAD_TIME_MINUTES;
}

/** Day of the week for a calendar date, 0 = Sunday, or null if unparseable.
 *
 * Read off the calendar date itself rather than parsing it into an instant,
 * so the answer can't shift with whatever timezone is running this. */
export function dayOfWeek(dateStr: string): number | null {
  if (!isValidIsoDate(dateStr)) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function isWeekend(dateStr: string): boolean {
  const d = dayOfWeek(dateStr);
  return d === 0 || d === 6;
}

/**
 * Which days take online appointments, as day-of-week indices (0 = Sunday).
 *
 * Deliberately a list rather than a "weekends only" flag: Farhan works a
 * weekday job right now, so Saturday and Sunday are the only days he can
 * actually detail — but that is a fact about this month, not about the
 * business. When his availability changes this is the one line to edit, and
 * the date picker, the API's re-check and the customer-facing copy all
 * follow, because all three read from here rather than each hard-coding a
 * rule of their own.
 */
export const BOOKABLE_DAYS: readonly number[] = [0, 6]; // Sunday, Saturday

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function isBookableDay(dateStr: string): boolean {
  const d = dayOfWeek(dateStr);
  return d !== null && BOOKABLE_DAYS.includes(d);
}

/** The bookable days as a phrase for customer copy — "Saturdays and Sundays".
 * Generated from BOOKABLE_DAYS so the copy can never contradict the rule. */
export function bookableDaysLabel(): string {
  // Monday-first so a working week reads in the order people expect.
  const ordered = [1, 2, 3, 4, 5, 6, 0].filter((d) => BOOKABLE_DAYS.includes(d));
  const names = ordered.map((d) => `${DAY_NAMES[d]}s`);
  if (names.length === 0) return "no days";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export type BookedRange = { time: string; durationMinutes: number };

/** Which start slots a job of `duration` minutes can begin at, before existing
 * bookings are considered.
 *
 * Normally that's every slot the job finishes by closing from. But the premium
 * services take most of — or more than — a day: a full PPF is 10 hours, and a
 * combined PPF + tint + coating is longer than the day is. Those can never
 * "finish by 6 PM", and the old rule quietly dropped every slot and rendered
 * the day "fully booked" when nothing was booked at all. So when no slot fits,
 * the job is treated as an all-day booking that starts at opening — one real,
 * honest option — and the business confirms any overflow into another day. */
export function startSlotsForDuration(duration: number): string[] {
  const fitting = timeSlots.filter(
    (slot) => parseTimeToMinutes(slot) + duration <= CLOSING_MINUTES
  );
  return fitting.length > 0 ? fitting : [timeSlots[0]];
}

/** Whether a job of `duration` minutes is too long to finish in a single day
 * from any slot — i.e. it books as a full day. Used to explain the single
 * morning option the picker offers for those. */
export function isAllDayJob(duration: number): boolean {
  return parseTimeToMinutes(timeSlots[0]) + duration > CLOSING_MINUTES;
}

/** Time slots on `date` that fit a service of `duration` minutes without
 * running past closing, overlapping an existing booking, or starting sooner
 * than the crew can get there.
 *
 * This is the single definition of "bookable": the form offers exactly what
 * it returns and the API re-checks the same conditions, so the two can't
 * drift apart. It takes the date rather than a `weekend` flag precisely so a
 * caller can't hand it a flag that disagrees with the date. */
export function availableSlotsFor(
  duration: number,
  bookedRanges: BookedRange[],
  date: string,
  now: Date = new Date()
): string[] {
  if (!isValidIsoDate(date) || !isBookableDay(date) || isPastDate(date, now)) return [];
  // startSlotsForDuration decides which slots the job can *begin* at (every
  // slot it fits before closing, or just the opening slot for an all-day job).
  // Overlap with real bookings and the lead-time rule are applied on top.
  return startSlotsForDuration(duration).filter((slot) => {
    const start = parseTimeToMinutes(slot);
    const end = start + duration;
    if (isSlotTooSoon(date, slot, now)) return false;
    return !bookedRanges.some((b) => {
      const bStart = parseTimeToMinutes(b.time);
      const bEnd = bStart + b.durationMinutes;
      return rangesOverlap(start, end, bStart, bEnd);
    });
  });
}

/** The next `count` dates the business actually takes appointments on,
 * starting from today.
 *
 * The booking form used to hand people a bare date input and let them
 * discover, one guess at a time, that weekdays are unavailable. Listing the
 * real dates removes the guessing — and it can only ever offer days that pass
 * `isBookableDay`, so the picker and the API cannot disagree about which days
 * exist. */
export function upcomingBookableDates(
  count: number,
  now: Date = new Date()
): string[] {
  const dates: string[] = [];
  const start = todayIso(now);
  const cursor = new Date(
    Date.UTC(+start.slice(0, 4), +start.slice(5, 7) - 1, +start.slice(8, 10), 12)
  );

  // A hard ceiling on iterations rather than trusting the loop to terminate:
  // if BOOKABLE_DAYS were ever emptied by mistake this would otherwise spin
  // forever, and it would do it inside a render.
  for (let i = 0; i < count * 14 + 60 && dates.length < count; i++) {
    const iso = cursor.toISOString().slice(0, 10);
    if (isBookableDay(iso)) dates.push(iso);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

/** "Sat 6 Sep" — enough to place a date without the year getting in the way. */
export function shortDateLabel(iso: string): string {
  const d = new Date(
    Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10), 12)
  );
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
