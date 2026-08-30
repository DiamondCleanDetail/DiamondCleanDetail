/**
 * Sends every campaign email to one address for review.
 *
 *   node --import ./scripts/register-alias.mjs scripts/send-marketing-preview.mjs you@example.com
 *
 * Subjects are prefixed so a review run can never be mistaken for a real
 * send, and each one is checked for a Resend error rather than assumed to
 * have worked — the SDK reports failures in the response, not by throwing.
 */
import fs from "node:fs";
import { Resend } from "resend";

for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const to = process.argv[2];
if (!to) {
  console.error("Usage: node scripts/send-marketing-preview.mjs you@example.com");
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

const { marketingEmails, renderMarketingEmail, renderMarketingText } = await import(
  "../src/lib/marketingEmails.ts"
);

const resend = new Resend(key);
let failures = 0;

for (const email of marketingEmails) {
  const res = await resend.emails.send({
    from,
    to,
    subject: `[Preview ${email.week}/5] ${email.subject}`,
    html: renderMarketingEmail(email),
    text: renderMarketingText(email),
  });

  if (res.error) {
    failures++;
    console.error(`FAILED  week ${email.week} (${email.slug}):`, res.error);
  } else {
    console.log(`sent    week ${email.week} (${email.slug}) — ${res.data?.id}`);
  }

  // Resend's default rate limit is 2 requests a second; a burst of five
  // otherwise gets some of them rejected for no reason worth debugging.
  await new Promise((r) => setTimeout(r, 600));
}

console.log(
  failures ? `\n${failures} of ${marketingEmails.length} failed.` : `\nAll ${marketingEmails.length} sent.`
);
process.exit(failures ? 1 : 0);
