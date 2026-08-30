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

const siteUrl = "https://diamondcleandetail.com";

// Inline hex values matching src/app/globals.css — email clients don't
// load stylesheets or resolve CSS variables, so the palette is duplicated
// here rather than imported.
const colors = {
  background: "#08090a",
  surface: "#121315",
  surface2: "#1a1c1f",
  foreground: "#f5f6f7",
  muted: "#9a9ca2",
  border: "#26282c",
  accent: "#d8dbe0",
};

function money(cents: number): string {
  // Grouped, not just fixed to 2dp — a Stage 3 correction deposit is four
  // figures, and "$1349.00" reads as a typo.
  return `${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function itemsText(items: ConfirmedBookingItem[]): string {
  return items
    .map((i) => `- ${i.serviceName} — ${i.packageName}${i.isQuote ? " (priced after assessment)" : ` — ${money(i.priceCents)}`}`)
    .join("\n");
}

function itemRowsHtml(items: ConfirmedBookingItem[]): string {
  return items
    .map(
      (i, idx) => `
        <tr>
          <td style="padding:12px 0; border-top:${idx === 0 ? "none" : `1px solid ${colors.border}`}; font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0; font-size:14px; color:${colors.foreground};">${escapeHtml(i.serviceName)}</p>
            <p style="margin:2px 0 0; font-size:13px; color:${colors.muted};">${escapeHtml(i.packageName)}</p>
          </td>
          <td style="padding:12px 0; border-top:${idx === 0 ? "none" : `1px solid ${colors.border}`}; font-family:Arial,Helvetica,sans-serif; text-align:right; white-space:nowrap; vertical-align:top;">
            <span style="font-size:14px; color:${i.isQuote ? colors.muted : colors.foreground};">
              ${i.isQuote ? "Quote after assessment" : money(i.priceCents)}
            </span>
          </td>
        </tr>`
    )
    .join("");
}

function detailRowHtml(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:4px 0; font-family:Arial,Helvetica,sans-serif; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:${colors.muted}; width:110px; vertical-align:top;">${label}</td>
      <td style="padding:4px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:${colors.foreground};">${escapeHtml(value)}</td>
    </tr>`;
}

/** Shared branded shell — a dark card matching the site's chrome/diamond
 * aesthetic, built with table markup and inline styles for email-client
 * compatibility (no external stylesheet, no CSS variables). */
function renderEmailHtml(opts: {
  eyebrow: string;
  title: string;
  intro: string;
  booking: ConfirmedBooking;
  footNote: string;
}): string {
  const { eyebrow, title, intro, booking, footNote } = opts;

  return `<!doctype html>
<html>
  <body style="margin:0; padding:0; background:${colors.background};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.background}; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%; background:${colors.surface}; border:1px solid ${colors.border}; border-radius:16px; overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 24px; text-align:center; border-bottom:1px solid ${colors.border};">
                <img src="${siteUrl}/brand/logo.png" width="36" height="36" alt="" style="display:block; margin:0 auto 14px;" />
                <img src="${siteUrl}/brand/wordmark.png" width="206" height="21" alt="Diamond Clean Detail" style="display:block; margin:0 auto; max-width:206px;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 6px; font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${colors.muted};">
                  ${escapeHtml(eyebrow)}
                </p>
                <h1 style="margin:0 0 16px; font-family:Arial,Helvetica,sans-serif; font-size:24px; font-weight:700; color:${colors.foreground};">
                  ${escapeHtml(title)}
                </h1>
                <p style="margin:0 0 24px; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:${colors.muted};">
                  ${escapeHtml(intro)}
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.surface2}; border:1px solid ${colors.border}; border-radius:12px; padding:20px;">
                  <tr>
                    <td style="padding:0 0 14px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${detailRowHtml("Customer", booking.customerName)}
                        ${detailRowHtml("Phone", booking.customerPhone)}
                        ${booking.customerEmail ? detailRowHtml("Email", booking.customerEmail) : ""}
                        ${detailRowHtml("Vehicle", booking.vehicleInfo)}
                        ${detailRowHtml("When", `${booking.date} at ${booking.time}`)}
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="border-top:1px solid ${colors.border}; padding-top:4px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${itemRowsHtml(booking.items)}
                      </table>
                    </td>
                  </tr>
                  ${
                    booking.chargedCents > 0
                      ? `<tr><td style="border-top:1px solid ${colors.border}; padding-top:14px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${colors.muted};">Charged today</td>
                              <td style="font-family:Arial,Helvetica,sans-serif; font-size:16px; font-weight:700; color:${colors.accent}; text-align:right;">${money(booking.chargedCents)}</td>
                            </tr>
                          </table>
                        </td></tr>`
                      : `<tr><td style="border-top:1px solid ${colors.border}; padding-top:14px;">
                          <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${colors.muted};">${
                            booking.items.every((i) => i.isQuote)
                              ? "No charge today — priced after assessment."
                              : "No charge due today."
                          }</p>
                        </td></tr>`
                  }
                </table>

                <p style="margin:24px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:1.6; color:${colors.muted};">
                  ${footNote}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px; border-top:1px solid ${colors.border}; text-align:center;">
                <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:${colors.muted};">
                  Diamond Clean Detail · ${serviceArea.region}<br />
                  <a href="tel:${serviceArea.phoneHref}" style="color:${colors.accent}; text-decoration:none;">${serviceArea.phone}</a>
                  &nbsp;·&nbsp;
                  <a href="mailto:${serviceArea.email}" style="color:${colors.accent}; text-decoration:none;">${serviceArea.email}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Sends the customer confirmation and the owner new-booking alert. Never
 * throws — a booking that already charged the customer's card must not
 * fail just because an email didn't go out. Errors are logged instead. */
/**
 * Resend reports most failures — an unverified domain, a rejected recipient,
 * a revoked key — in the response body rather than by throwing, so the bare
 * `.catch()` these sends used to rely on saw none of them. Without this a
 * booking could confirm on screen, take the deposit, and send nothing to
 * anyone, with the logs staying perfectly clean.
 */
function report(
  label: string,
  res: { error?: unknown; data?: { id?: string } | null } | void
) {
  if (!res) return;
  if (res.error) {
    console.error(`Resend rejected the ${label}:`, res.error);
    return;
  }
  console.log(`Sent ${label} (${res.data?.id ?? "no id"})`);
}

export async function sendBookingEmails(booking: ConfirmedBooking): Promise<void> {
  const resend = resendClient();
  if (!resend) {
    console.error("RESEND_API_KEY not configured — skipping booking emails.");
    return;
  }

  const plainSummary = `${booking.customerName} · ${booking.customerPhone}${booking.customerEmail ? ` · ${booking.customerEmail}` : ""}\n${booking.vehicleInfo}\n${booking.date} at ${booking.time}\n\n${itemsText(booking.items)}\n\n${booking.chargedCents > 0 ? `Charged today: ${money(booking.chargedCents)}` : "No charge today — priced after assessment."}`;

  const ownerSend = resend.emails
    .send({
      from: EMAIL_FROM,
      // info@diamondcleandetail.com is now a confirmed, monitored mailbox, so
      // the fallback here is the right destination and the override is no
      // longer doing necessary work. It stays because it is still the way to
      // point alerts somewhere else — a phone during a busy weekend, say —
      // without a deploy. Unset OWNER_NOTIFICATION_EMAIL to use info@.
      to: process.env.OWNER_NOTIFICATION_EMAIL || serviceArea.email,
      subject: `New booking — ${booking.customerName} — ${booking.date} ${booking.time}`,
      html: renderEmailHtml({
        eyebrow: "Staff Alert",
        title: "New Booking",
        intro: "A new booking just came in through the website.",
        booking,
        footNote: "This booking is also visible in the admin dashboard.",
      }),
      text: `New Booking\n\n${plainSummary}`,
    })
    .then((res) => report("owner booking alert", res))
    .catch((err) => console.error("Failed to send owner booking alert:", err));

  const customerSend = booking.customerEmail
    ? resend.emails
        .send({
          from: EMAIL_FROM,
          to: booking.customerEmail,
          subject: "Your Diamond Clean Detail booking is confirmed",
          html: renderEmailHtml({
            eyebrow: "Booking Confirmation",
            title: "You're Booked!",
            intro: `Thanks, ${booking.customerName} — here's a summary of your appointment.`,
            booking,
            footNote: `Questions? Call or text ${serviceArea.phone} any time.`,
          }),
          text: `You're booked!\n\nThanks, ${booking.customerName} — here's a summary of your appointment.\n\n${plainSummary}\n\nQuestions? Call or text ${serviceArea.phone}.`,
        })
        .then((res) => report("customer confirmation", res))
        .catch((err) => console.error("Failed to send customer confirmation email:", err))
    : Promise.resolve();

  await Promise.all([ownerSend, customerSend]);
}
