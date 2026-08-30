export const SITE_ACCESS_COOKIE = "dcd_access";
export const ADMIN_ACCESS_COOKIE = "dcd_admin_access";
export const SITE_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // ~6 months

/** Works in both the Node.js and Edge runtimes — no `Buffer`, no `node:crypto`. */
export async function hashPassphrase(passphrase: string): Promise<string> {
  const data = new TextEncoder().encode(passphrase);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isGateEnabled(): boolean {
  return process.env.SITE_GATE_ENABLED !== "false";
}

/** Emails allowed into /admin by signing in, rather than by the passphrase.
 *
 * Defaults to the business address and can be widened with ADMIN_EMAILS
 * (comma-separated) without a deploy — e.g. to add a second owner. Lower-cased
 * and trimmed so "Info@…" or a stray space can't lock the real owner out.
 *
 * This is not a secret: the emails only grant anything paired with a signed-in
 * Clerk session whose primary email is verified, and the server checks both.
 * Publishing NEXT_PUBLIC_ADMIN_EMAILS lets the nav decide whether to show the
 * admin link; the actual gate never trusts the client. */
const OWNER_EMAIL_FALLBACK = "info@diamondcleandetail.com";

export function ownerEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? OWNER_EMAIL_FALLBACK;
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Whether an email belongs to an owner. Case-insensitive; null/undefined is
 * never an owner, so an unverified or absent email can't slip through. */
export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ownerEmails().includes(email.trim().toLowerCase());
}
