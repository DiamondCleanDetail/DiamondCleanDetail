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
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;

  if (!bookingId) {
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
      await db.from("bookings").update({ status: "paid" }).eq("id", bookingId).eq("status", "pending");
    }
  }

  const { data: booking } = await db.from("bookings").select("*").eq("id", bookingId).single();

  if (!booking) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Booking not found</h1>
        <p className="text-muted">Contact us and we&apos;ll help track it down.</p>
      </div>
    );
  }

  const category = getCategory(booking.service_slug);
  const pkg = category?.packages.find((p) => p.slug === booking.package_slug);
  const isQuote = pkg?.pricing.type === "quote";

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <ClearBookingDraft />
      <div className="bg-surface border border-border rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2">
          {isQuote ? "Quote Requested" : booking.status === "paid" ? "Booking Confirmed" : "Booking Received"}
        </h1>
        <p className="text-muted">
          {category?.name} — {pkg?.name} for{" "}
          <span className="text-foreground font-medium">{booking.vehicle_info}</span> on{" "}
          <span className="text-foreground font-medium">{booking.booking_date}</span> at{" "}
          <span className="text-foreground font-medium">{booking.booking_time}</span>.
        </p>
        {!isQuote && (
          <p className="text-muted mt-3">
            {booking.status === "paid"
              ? `$${(booking.deposit_cents / 100).toFixed(2)} charged successfully.`
              : "Payment is still processing — we'll follow up shortly."}
          </p>
        )}
        <p className="text-sm text-muted mt-6">
          A confirmation has been saved for {booking.customer_name}. We&apos;ll reach out at{" "}
          {booking.customer_phone} if we need anything else.
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
