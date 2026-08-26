import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stripeClient } from "@/lib/stripe";
import { getCategory } from "@/data/catalog";
import ClearBookingDraft from "@/components/ClearBookingDraft";

export default async function BookingSuccessPage({
  searchParams,
}: PageProps<"/booking/success">) {
  const params = await searchParams;
  const bookingId = typeof params.booking_id === "string" ? params.booking_id : undefined;
  const groupId = typeof params.group_id === "string" ? params.group_id : undefined;
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;

  if (!bookingId && !groupId) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Booking not found</h1>
        <p className="text-muted">
          We couldn&apos;t find that booking. If you completed a payment, contact us and we&apos;ll confirm it.
        </p>
      </div>
    );
  }

  const db = supabaseAdmin();

  if (sessionId) {
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      if (groupId) {
        await db.from("bookings").update({ status: "paid" }).eq("group_id", groupId).eq("status", "pending");
      } else if (bookingId) {
        await db.from("bookings").update({ status: "paid" }).eq("id", bookingId).eq("status", "pending");
      }
    }
  }

  const bookings = groupId
    ? (await db.from("bookings").select("*").eq("group_id", groupId)).data
    : await db
        .from("bookings")
        .select("*")
        .eq("id", bookingId!)
        .single()
        .then((res) => (res.data ? [res.data] : null));

  if (!bookings || bookings.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Booking not found</h1>
        <p className="text-muted">Contact us and we&apos;ll help track it down.</p>
      </div>
    );
  }

  const enriched = bookings.map((booking) => {
    const category = getCategory(booking.service_slug);
    const pkg = category?.packages.find((p) => p.slug === booking.package_slug);
    return { booking, category, pkg, isQuote: pkg?.pricing.type === "quote" };
  });

  const first = enriched[0];
  const allPaid = enriched.every((e) => e.isQuote || e.booking.status === "paid");
  const anyPaid = enriched.some((e) => e.booking.status === "paid");
  const totalCharged = enriched.reduce(
    (sum, e) => sum + (e.booking.status === "paid" ? e.booking.deposit_cents : 0),
    0
  );
  const heading = enriched.every((e) => e.isQuote)
    ? "Quote Requested"
    : allPaid || anyPaid
      ? "Booking Confirmed"
      : "Booking Received";

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <ClearBookingDraft />
      <div className="bg-surface border border-border rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2">{heading}</h1>
        <div className="space-y-2 text-left">
          {enriched.map(({ booking, category, pkg, isQuote }) => (
            <p key={booking.id} className="text-muted text-sm">
              <span className="text-foreground font-medium">
                {category?.name} — {pkg?.name}
              </span>{" "}
              for {booking.vehicle_info} on {booking.booking_date} at {booking.booking_time}
              {!isQuote && booking.status === "paid" && (
                <> — ${(booking.deposit_cents / 100).toFixed(2)} charged</>
              )}
            </p>
          ))}
        </div>
        {enriched.length > 1 && totalCharged > 0 && (
          <p className="text-muted mt-3 font-medium">
            ${(totalCharged / 100).toFixed(2)} charged successfully across {enriched.length} services.
          </p>
        )}
        <p className="text-sm text-muted mt-6">
          A confirmation has been saved for {first.booking.customer_name}. We&apos;ll reach out at{" "}
          {first.booking.customer_phone} if we need anything else.
        </p>
        <Link
          href="/"
          className="chrome-btn inline-block mt-6 px-6 py-2 rounded-lg font-semibold text-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
