/**
 * Sends a real booking confirmation through the real template, so the whole
 * Resend path can be proved rather than assumed.
 *
 *   node --import ./scripts/register-alias.mjs scripts/send-test-email.mjs you@example.com
 *
 * Both the staff alert and the customer confirmation go to the address you
 * pass, so testing never puts a fake booking in front of the business.
 */
import fs from "node:fs";
import { Resend } from "resend";

// A standalone script gets none of Next's env loading.
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const to = process.argv[2];
if (!to) {
  console.error("Usage: node scripts/send-test-email.mjs you@example.com");
  process.exit(1);
}

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error("RESEND_API_KEY is not set in .env.local");
  process.exit(1);
}

const from =
  process.env.RESEND_FROM_EMAIL ??
  "Diamond Clean Detail <noreply@diamondcleandetail.com>";

const { sendBookingEmails } = await import("../src/lib/bookingEmails.ts");

// Point the staff alert at the tester too, so this never lands in the
// business inbox looking like a real booking.
process.env.OWNER_NOTIFICATION_EMAIL = to;

console.log(`from: ${from}`);
console.log(`to:   ${to}\n`);

// A direct call first, so an API-level failure is visible. The booking helper
// currently only catches thrown errors, and Resend reports most failures in
// the response body instead.
const resend = new Resend(key);
const probe = await resend.emails.send({
  from,
  to,
  subject: "Diamond Clean Detail — Resend connectivity test",
  html: "<p>Plain connectivity check. If this arrives, the API key, the sending domain and the recipient all work.</p>",
  text: "Plain connectivity check. If this arrives, the API key, the sending domain and the recipient all work.",
});

if (probe.error) {
  console.error("PROBE FAILED:", probe.error);
  process.exit(1);
}
console.log("probe sent:", probe.data?.id);

await sendBookingEmails({
  customerName: "Ayden (test)",
  customerPhone: "(720) 703-2795",
  customerEmail: to,
  vehicleInfo: "2023 Tesla Model 3 — Deep Blue Metallic",
  date: "2026-09-05",
  time: "10:30 AM",
  chargedCents: 14900,
  items: [
    { serviceName: "Window Tinting", packageName: "Full Vehicle", priceCents: 39900, isQuote: false },
    { serviceName: "Mobile Detailing", packageName: "The Diamond Detail", priceCents: 17500, isQuote: false },
  ],
});

console.log("booking emails dispatched — check the inbox.");
