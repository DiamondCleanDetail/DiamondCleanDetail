import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCategory } from "@/data/catalog";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Missing date." }, { status: 400 });
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
