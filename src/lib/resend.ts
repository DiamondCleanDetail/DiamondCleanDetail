import { Resend } from "resend";

// diamondcleandetail.com is verified in Resend — sending real,
// non-sandboxed email to any address. noreply@ doesn't need to be a real
// mailbox; it's just what customers see as the sender.
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? "Diamond Clean Detail <noreply@diamondcleandetail.com>";

export function resendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}
