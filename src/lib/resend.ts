import { Resend } from "resend";

/** Until a sending domain is verified in Resend, this is the only address
 * Resend will let us send from — swap to something like
 * "bookings@diamondcleandetail.com" once diamondcleandetail.com is verified. */
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? "Diamond Clean Detail <onboarding@resend.dev>";

export function resendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}
