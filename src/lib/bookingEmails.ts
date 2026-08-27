import { resendClient, EMAIL_FROM } from "@/lib/resend";
import { serviceArea } from "@/data/serviceArea";

export type ConfirmedBookingItem = {
  serviceName: string;
  packageName: string;
  priceCents: number;
  isQuote: boolean;
};

export type ConfirmedBooking = {
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  vehicleInfo: string;
  date: string;
  time: string;
  items: ConfirmedBookingItem[];
  /** Total actually charged today (deposit or full price) — 0 for quote-only bookings. */
  chargedCents: number;
};

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function itemsHtml(items: ConfirmedBookingItem[]): string {
  return items
    .map(
      (i) =>
        `<li>${i.serviceName} — ${i.packageName}${i.isQuote ? " (priced after assessment)" : ` — ${money(i.priceCents)}`}</li>`
    )
    .join("");
}

function itemsText(items: ConfirmedBookingItem[]): string {
  return items
    .map((i) => `- ${i.serviceName} — ${i.packageName}${i.isQuote ? " (priced after assessment)" : ` — ${money(i.priceCents)}`}`)
    .join("\n");
}

/** Sends the customer confirmation and the owner new-booking alert. Never
 * throws — a booking that already charged the customer's card must not
 * fail just because an email didn't go out. Errors are logged instead. */
export async function sendBookingEmails(booking: ConfirmedBooking): Promise<void> {
  const resend = resendClient();
  if (!resend) {
    console.error("RESEND_API_KEY not configured — skipping booking emails.");
    return;
  }

  const summaryHtml = `
    <p><strong>${booking.customerName}</strong> · ${booking.customerPhone}${booking.customerEmail ? ` · ${booking.customerEmail}` : ""}</p>
    <p>${booking.vehicleInfo}</p>
    <p>${booking.date} at ${booking.time}</p>
    <ul>${itemsHtml(booking.items)}</ul>
    ${booking.chargedCents > 0 ? `<p>Charged today: <strong>${money(booking.chargedCents)}</strong></p>` : "<p>No charge today — quote-only.</p>"}
  `;

  const ownerSend = resend.emails
    .send({
      from: EMAIL_FROM,
      // Until diamondcleandetail.com is verified in Resend, sends are
      // sandboxed to the Resend account's own signup address — this lets
      // the owner alert actually deliver today. Switch OWNER_NOTIFICATION_EMAIL
      // (or just drop it) to use serviceArea.email once verified.
      to: process.env.OWNER_NOTIFICATION_EMAIL || serviceArea.email,
      subject: `New booking — ${booking.customerName} — ${booking.date} ${booking.time}`,
      html: `<h2>New Booking</h2>${summaryHtml}`,
      text: `New Booking\n\n${booking.customerName} · ${booking.customerPhone}${booking.customerEmail ? ` · ${booking.customerEmail}` : ""}\n${booking.vehicleInfo}\n${booking.date} at ${booking.time}\n\n${itemsText(booking.items)}\n\n${booking.chargedCents > 0 ? `Charged today: ${money(booking.chargedCents)}` : "No charge today — quote-only."}`,
    })
    .catch((err) => console.error("Failed to send owner booking alert:", err));

  const customerSend = booking.customerEmail
    ? resend.emails
        .send({
          from: EMAIL_FROM,
          to: booking.customerEmail,
          subject: "Your Diamond Clean Detail booking is confirmed",
          html: `<h2>You're booked!</h2><p>Thanks, ${booking.customerName} — here's a summary of your appointment.</p>${summaryHtml}<p>Questions? Call or text ${serviceArea.phone}.</p>`,
          text: `You're booked!\n\nThanks, ${booking.customerName} — here's a summary of your appointment.\n\n${booking.vehicleInfo}\n${booking.date} at ${booking.time}\n\n${itemsText(booking.items)}\n\n${booking.chargedCents > 0 ? `Charged today: ${money(booking.chargedCents)}` : "No charge today — quote-only."}\n\nQuestions? Call or text ${serviceArea.phone}.`,
        })
        .catch((err) => console.error("Failed to send customer confirmation email:", err))
    : Promise.resolve();

  await Promise.all([ownerSend, customerSend]);
}
