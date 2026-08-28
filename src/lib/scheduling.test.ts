import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BUSINESS_TIME_ZONE,
  isPastDate,
  isValidIsoDate,
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
