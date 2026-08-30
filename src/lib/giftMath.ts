// Crypto-free gift-card math, safe to import from client components (the
// booking wizard previews a redemption with this). The code *generators* live
// in giftCards.ts, which pulls in node:crypto and must stay server-only.

/** Codes are stored and compared upper-cased with the spaces/dashes people add
 * when typing them off a screen ignored, so "dcd abcd 2345" matches
 * "DCD-ABCD-2345". The canonical stored form keeps the dash. */
export function normalizeGiftCode(raw: string): string {
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (/^DCD[A-Z0-9]{8}$/.test(compact)) {
    return `DCD-${compact.slice(3, 7)}-${compact.slice(7)}`;
  }
  return raw.trim().toUpperCase();
}

// Stripe won't process a charge under 50 cents, so a gift card can't leave a
// remainder smaller than that on the bill.
const STRIPE_MIN_CHARGE_CENTS = 50;

/** How much of a gift card applies to a bill, and what's left to charge.
 *
 * Pure and side-effect free so it can be unit tested and so the same rule runs
 * on the server (authoritative) and in the wizard (display). With the whole-
 * dollar deposits and $50/$100/$200 cards we sell, the sub-minimum branch
 * never triggers, but it's handled so a future odd price can't produce an
 * unchargeable sub-50-cent remainder. */
export function computeGiftApplication(
  totalChargeCents: number,
  balanceCents: number
): { appliedCents: number; remainingChargeCents: number } {
  const total = Math.max(0, Math.round(totalChargeCents));
  const balance = Math.max(0, Math.round(balanceCents));
  let applied = Math.min(balance, total);
  let remaining = total - applied;

  // A non-zero remainder means the card didn't cover the whole bill (so the
  // balance is below the total). If that leftover is under Stripe's 50-cent
  // floor, use a touch less of the card and leave exactly the minimum to
  // charge — but never so much that `applied` goes negative on a tiny bill.
  if (remaining > 0 && remaining < STRIPE_MIN_CHARGE_CENTS && total >= STRIPE_MIN_CHARGE_CENTS) {
    applied = total - STRIPE_MIN_CHARGE_CENTS;
    remaining = STRIPE_MIN_CHARGE_CENTS;
  }

  return { appliedCents: applied, remainingChargeCents: remaining };
}
