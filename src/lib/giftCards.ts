import { randomBytes, createHash } from "node:crypto";

// A human-readable, unambiguous gift-card code: DCD-XXXX-XXXX, drawn from an
// alphabet with no 0/O/1/I so it survives being read off a phone screen.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function encode(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
    if (i === 3) out += "-";
  }
  return `DCD-${out}`;
}

export function generateGiftCode(): string {
  return encode(randomBytes(8));
}

/** Deterministic code from a seed. The webhook derives its codes from the
 * Stripe session id so that if Stripe redelivers the event, fulfilment mints
 * the *same* code rather than a second one — the closest we get to idempotency
 * without a database. */
export function giftCodeFromSeed(seed: string): string {
  return encode(createHash("sha256").update(seed).digest());
}
