import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCategory } from "@/data/catalog";
import { isValidIsoDate } from "@/lib/scheduling";

/** Hard cap on how many days one request may ask about. The calendar asks
 * for a handful; anything more is either a mistake or someone probing. */
const MAX_DATES = 30;

export async function GET(req: NextRequest) {
  // Two shapes: ?date=... for one day, or ?dates=a,b,c for the calendar,
  // which needs every visible day's bookings in one round trip rather than
  // one request per day.
  const multi = req.nextUrl.searchParams.get("dates");
  if (multi !== null) return handleMany(multi);

  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Missing date." }, { status: 400 });
  }
  // Anything that isn't a calendar date used to fall through to the Supabase
  // query, fail there, and come back as a 500 — a malformed request reported
  // as a server fault. It's the caller's error, so say so.
  if (!isValidIsoDate(date)) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("bookings")
    .select("service_slug, package_slug, booking_time")
    .eq("booking_date", date)
    .neq("status", "cancelled");

  if (error) {
    console.error("Failed to load availability:", error.message);
    return NextResponse.json({ error: "Could not load availability." }, { status: 500 });
  }

  const bookedRanges = (data ?? []).map((booking) => {
    const category = getCategory(booking.service_slug);
    const pkg = category?.packages.find((p) => p.slug === booking.package_slug);
    return { time: booking.booking_time, durationMinutes: pkg?.durationMinutes ?? 60 };
  });

  return NextResponse.json({ bookedRanges });
}

/** Bookings for several dates at once, keyed by date.
 *
 * Every date is validated before it reaches the query, and the list is capped,
 * so a long or malformed date list is rejected as the caller's error
 * rather than turned into an unbounded database query. */
async function handleMany(raw: string) {
  const dates = Array.from(new Set(raw.split(",").map((d) => d.trim()).filter(Boolean)));
  if (dates.length === 0 || dates.length > MAX_DATES) {
    return NextResponse.json({ error: "Invalid date list." }, { status: 400 });
  }
  if (dates.some((d) => !isValidIsoDate(d))) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("bookings")
    .select("service_slug, package_slug, booking_time, booking_date")
    .in("booking_date", dates)
    .neq("status", "cancelled");

  if (error) {
    console.error("Failed to load availability:", error.message);
    return NextResponse.json({ error: "Could not load availability." }, { status: 500 });
  }

  // Every requested date gets a key, including the empty ones — the caller
  // should not have to tell "no bookings" apart from "never asked".
  const byDate: Record<string, { time: string; durationMinutes: number }[]> = {};
  for (const d of dates) byDate[d] = [];
  for (const booking of data ?? []) {
    const category = getCategory(booking.service_slug);
    const pkg = category?.packages.find((p) => p.slug === booking.package_slug);
    byDate[booking.booking_date]?.push({
      time: booking.booking_time,
      durationMinutes: pkg?.durationMinutes ?? 60,
    });
  }

  return NextResponse.json({ byDate });
}
