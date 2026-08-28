import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BUSINESS_TIME_ZONE,
  isPastDate,
  isValidIsoDate,
  isSlotTooSoon,
  leadTimeLabel,
  minutesIntoBusinessDay,
  availableSlotsFor,
  timeSlots,
  MIN_LEAD_TIME_MINUTES,
  isWeekend,
  todayIso,
} from "./scheduling.ts";

/** The shop's calendar date for an instant, derived independently of the code
 * under test so these assertions don't just restate the implementation. */
function denverDate(instant: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

test("the shop's timezone is Mountain Time", () => {
  assert.equal(BUSINESS_TIME_ZONE, "America/Denver");
});

// ---------------------------------------------------------------------------
// The regression this file exists for.
//
// `todayIso()` used to read the date off the ambient process timezone. In the
// browser that meant the customer's timezone and on Vercel it meant UTC, and
// for the last six hours of every Denver day those are different dates. The
// picker offered today, the API called today "already passed", and the booking
// could not be completed until after midnight UTC.
//
// These instants are all inside that window, expressed in UTC so the test
// gives the same answer wherever it runs.
// ---------------------------------------------------------------------------

test("evening in Denver is still today, not tomorrow (MDT, UTC-6)", () => {
  // 2026-08-28 18:00 MDT is already 2026-08-29 in UTC.
  assert.equal(todayIso(new Date("2026-08-29T00:00:00Z")), "2026-08-28");
  assert.equal(todayIso(new Date("2026-08-29T03:30:00Z")), "2026-08-28");
  // 23:59:59 MDT — the last second of the Denver day.
  assert.equal(todayIso(new Date("2026-08-29T05:59:59Z")), "2026-08-28");
  // One second later it really is a new day in Denver.
  assert.equal(todayIso(new Date("2026-08-29T06:00:00Z")), "2026-08-29");
});

test("evening in Denver is still today, not tomorrow (MST, UTC-7)", () => {
  // Winter: the rollover moves an hour, to 17:00 local.
  assert.equal(todayIso(new Date("2026-01-16T00:00:00Z")), "2026-01-15");
  assert.equal(todayIso(new Date("2026-01-16T06:59:59Z")), "2026-01-15");
  assert.equal(todayIso(new Date("2026-01-16T07:00:00Z")), "2026-01-16");
});

test("a same-day booking is bookable at every hour of the Denver day", () => {
  // The original bug: from 18:00 MDT onwards this rejected today's date.
  for (let hour = 0; hour < 24; hour++) {
    const instant = new Date(Date.UTC(2026, 7, 28, 6 + hour, 30)); // 00:30–23:30 MDT
    const today = denverDate(instant);
    assert.equal(
      isPastDate(today, instant),
      false,
      `booking ${today} was rejected as past at ${instant.toISOString()}`
    );
  }
});

test("the guard still rejects dates that really have passed", () => {
  const evening = new Date("2026-08-29T03:00:00Z"); // 21:00 MDT on the 28th
  assert.equal(isPastDate("2026-08-27", evening), true);
  assert.equal(isPastDate("2026-08-01", evening), true);
  assert.equal(isPastDate("2025-08-28", evening), true);
  // ...and lets today and the future through.
  assert.equal(isPastDate("2026-08-28", evening), false);
  assert.equal(isPastDate("2026-08-31", evening), false);
  assert.equal(isPastDate("2027-01-01", evening), false);
});

test("yesterday stays rejected right up to the Denver midnight boundary", () => {
  // 05:59:59Z is 23:59:59 MDT on the 28th — the 27th is still past.
  assert.equal(isPastDate("2026-08-27", new Date("2026-08-29T05:59:59Z")), true);
  // 06:00:00Z is 00:00 MDT on the 29th — now the 28th is past too.
  assert.equal(isPastDate("2026-08-28", new Date("2026-08-29T06:00:00Z")), true);
  assert.equal(isPastDate("2026-08-29", new Date("2026-08-29T06:00:00Z")), false);
});

test("todayIso matches the shop's calendar date across a full year", () => {
  // Sweeps both DST transitions at an interval that doesn't align to the hour.
  const start = Date.UTC(2026, 0, 1);
  for (let ms = start; ms < start + 365 * 864e5; ms += 37 * 60000) {
    const instant = new Date(ms);
    assert.equal(todayIso(instant), denverDate(instant), `at ${instant.toISOString()}`);
  }
});

test("todayIso ignores the timezone the code happens to run in", () => {
  // Same instant, and the answer is a Denver date either way — this is what
  // broke when the browser and the server each used their own timezone.
  const instant = new Date("2026-08-29T02:00:00Z");
  assert.equal(todayIso(instant), "2026-08-28"); // Denver
  assert.notEqual(todayIso(instant), instant.toISOString().slice(0, 10)); // UTC would say the 29th
});

// ---------------------------------------------------------------------------
// Format validation — dates are compared as strings, so a non-ISO value would
// sort below every real date and be reported as "already passed".
// ---------------------------------------------------------------------------

test("only zero-padded YYYY-MM-DD counts as a date", () => {
  assert.equal(isValidIsoDate("2026-08-31"), true);
  assert.equal(isValidIsoDate("2028-02-29"), true); // real leap day

  assert.equal(isValidIsoDate("08/31/2026"), false); // US format
  assert.equal(isValidIsoDate("31-08-2026"), false); // day-first
  assert.equal(isValidIsoDate("2026-8-31"), false); // unpadded
  assert.equal(isValidIsoDate("2026-13-01"), false); // no 13th month
  assert.equal(isValidIsoDate("2026-02-30"), false); // rolls forward if parsed
  assert.equal(isValidIsoDate("2026-02-29"), false); // 2026 is not a leap year
  assert.equal(isValidIsoDate(""), false);
  assert.equal(isValidIsoDate("tomorrow"), false);
});

test("a US-formatted date would have sorted below today", () => {
  // Documents why the format check has to run first: this string compares as
  // "past" against any ISO date, which is how a formatting slip would surface
  // as "That date has already passed."
  assert.ok("08/31/2026" < "2026-08-28");
});

// ---------------------------------------------------------------------------
// Weekend detection must not shift with the running timezone either.
// ---------------------------------------------------------------------------

test("weekends are read off the calendar date itself", () => {
  assert.equal(isWeekend("2026-08-29"), true); // Saturday
  assert.equal(isWeekend("2026-08-30"), true); // Sunday
  assert.equal(isWeekend("2026-08-28"), false); // Friday
  assert.equal(isWeekend("2026-08-31"), false); // Monday
});

test("weekend detection rejects malformed input rather than guessing", () => {
  assert.equal(isWeekend(""), false);
  assert.equal(isWeekend("08/29/2026"), false);
});

// ---------------------------------------------------------------------------
// Same-day lead time.
//
// Today's 9:00 AM used to stay bookable at 4:00 PM: nothing compared a slot
// against the current time of day, only against the calendar date. These
// instants are given in UTC so the assertions hold in any timezone.
// ---------------------------------------------------------------------------

/** 2026-08-28 is a Friday. MDT is UTC-6, so 20:00Z is 14:00 in Denver. */
const denverOn28th = (hour: number, minute = 0) =>
  new Date(Date.UTC(2026, 7, 28, hour + 6, minute));

test("a slot earlier today is no longer bookable", () => {
  const fourPm = denverOn28th(16);
  assert.equal(isSlotTooSoon("2026-08-28", "9:00 AM", fourPm), true);
  assert.equal(isSlotTooSoon("2026-08-28", "12:00 PM", fourPm), true);
  assert.equal(isSlotTooSoon("2026-08-28", "3:00 PM", fourPm), true);
});

test("the lead time is enforced, not just 'later than right now'", () => {
  const twoPm = denverOn28th(14); // cutoff is 16:00 with a 120-minute rule
  assert.equal(MIN_LEAD_TIME_MINUTES, 120, "these boundaries assume a 2 hour rule");
  assert.equal(isSlotTooSoon("2026-08-28", "3:00 PM", twoPm), true, "only an hour out");
  assert.equal(isSlotTooSoon("2026-08-28", "4:30 PM", twoPm), false, "two and a half hours out");
});

test("a slot exactly one lead time away is still bookable", () => {
  // 14:30 + 120 = 16:30, which is exactly the 4:30 PM slot.
  const boundary = denverOn28th(14, 30);
  assert.equal(isSlotTooSoon("2026-08-28", "4:30 PM", boundary), false);
  // One minute later and it has slipped out of reach.
  assert.equal(isSlotTooSoon("2026-08-28", "4:30 PM", denverOn28th(14, 31)), true);
});

test("the lead time only applies to today", () => {
  const lateToday = denverOn28th(17);
  // Monday the 31st is a whole day away, so every slot stands.
  for (const slot of timeSlots) {
    assert.equal(isSlotTooSoon("2026-08-31", slot, lateToday), false, slot);
  }
});

test("the lead time is measured on Denver's clock, not the server's", () => {
  // 2026-08-29T02:00Z is 20:00 MDT on the 28th. Read as UTC it would look
  // like 02:00 on the 29th, which would wrongly reopen the whole day.
  const evening = new Date("2026-08-29T02:00:00Z");
  assert.equal(isSlotTooSoon("2026-08-28", "9:00 AM", evening), true);
  assert.equal(minutesIntoBusinessDay(evening), 20 * 60);
});

test("minutesIntoBusinessDay reads midnight as 0, not 24:00", () => {
  assert.equal(minutesIntoBusinessDay(new Date("2026-08-28T06:00:00Z")), 0); // 00:00 MDT
  assert.equal(minutesIntoBusinessDay(new Date("2026-01-15T07:00:00Z")), 0); // 00:00 MST
});

test("lead time holds across the winter offset too", () => {
  // 2026-01-15 is a Thursday; MST is UTC-7, so 21:00Z is 14:00 in Denver.
  const twoPmMst = new Date("2026-01-15T21:00:00Z");
  assert.equal(isSlotTooSoon("2026-01-15", "3:00 PM", twoPmMst), true);
  assert.equal(isSlotTooSoon("2026-01-15", "4:30 PM", twoPmMst), false);
});

// ---------------------------------------------------------------------------
// The picker and the validator have to agree — that is the whole point.
// ---------------------------------------------------------------------------

test("every slot the form offers is one the API would accept", () => {
  // Walk the working day; at each moment, everything offered must clear the
  // same checks the route applies.
  for (let hour = 6; hour <= 20; hour++) {
    for (const minute of [0, 17, 44]) {
      const now = denverOn28th(hour, minute);
      const offered = availableSlotsFor(90, [], "2026-08-28", now);
      for (const slot of offered) {
        assert.equal(
          isSlotTooSoon("2026-08-28", slot, now),
          false,
          `form offered ${slot} at ${hour}:${String(minute).padStart(2, "0")} but the API refuses it`
        );
        assert.ok(timeSlots.includes(slot), `${slot} is not a real appointment time`);
      }
    }
  }
});

test("the form stops offering today's slots as the day runs out", () => {
  assert.deepEqual(availableSlotsFor(90, [], "2026-08-28", denverOn28th(6)), [
    "9:00 AM",
    "10:30 AM",
    "12:00 PM",
    "1:30 PM",
    "3:00 PM",
    "4:30 PM",
  ]);
  assert.deepEqual(availableSlotsFor(90, [], "2026-08-28", denverOn28th(14)), ["4:30 PM"]);
  assert.deepEqual(availableSlotsFor(90, [], "2026-08-28", denverOn28th(17)), []);
});

test("availableSlotsFor still respects closing, weekends and bookings", () => {
  const earlyOn31st = new Date("2026-08-31T13:00:00Z"); // 07:00 MDT Monday
  // A 6 hour job can start at noon and finish exactly at the 6pm close, but
  // not at 1:30pm.
  assert.deepEqual(availableSlotsFor(360, [], "2026-08-31", earlyOn31st), [
    "9:00 AM",
    "10:30 AM",
    "12:00 PM",
  ]);
  // Saturday.
  assert.deepEqual(availableSlotsFor(90, [], "2026-08-29", earlyOn31st), []);
  // Already booked.
  assert.deepEqual(
    availableSlotsFor(90, [{ time: "9:00 AM", durationMinutes: 180 }], "2026-08-31", earlyOn31st),
    ["12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"]
  );
});

test("availableSlotsFor rejects malformed and past dates outright", () => {
  const now = denverOn28th(8);
  assert.deepEqual(availableSlotsFor(90, [], "", now), []);
  assert.deepEqual(availableSlotsFor(90, [], "08/31/2026", now), []);
  assert.deepEqual(availableSlotsFor(90, [], "2026-08-27", now), []);
});

test("leadTimeLabel reads naturally for whole and partial hours", () => {
  assert.equal(leadTimeLabel(120), "2 hours");
  assert.equal(leadTimeLabel(60), "1 hour");
  assert.equal(leadTimeLabel(90), "90 minutes");
});
