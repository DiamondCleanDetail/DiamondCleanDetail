import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeGiftCode } from "@/lib/giftMath";

// Server-only gift-card balance store. Every function here fails *closed* for
// redemption and *open* for booking: if the gift_cards table or its RPC isn't
// there yet, or Supabase errors, a lookup returns null and a redeem returns
// false, so the worst case is "no discount applied" — never a wrong charge and
// never a broken booking. See supabase/gift_cards.sql.

export type GiftBalance = { code: string; balanceCents: number };

/** Read a card's remaining balance. Returns null for unknown, inactive,
 * empty, or any error. */
export async function lookupGiftBalance(rawCode: string): Promise<GiftBalance | null> {
  const code = normalizeGiftCode(rawCode);
  if (!code) return null;
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("gift_cards")
      .select("code, balance_cents, status")
      .eq("code", code)
      .eq("status", "active")
      .gt("balance_cents", 0)
      .maybeSingle();
    if (error || !data) return null;
    return { code: data.code, balanceCents: data.balance_cents };
  } catch (err) {
    console.error("Gift-card lookup failed (treating as no card):", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Atomically subtract from a card via the redeem_gift_card RPC. Returns
 * { ok: true } only when the balance was actually reduced — a concurrent
 * redemption or a missing balance yields ok: false, and the caller must not
 * grant the discount. */
export async function redeemGift(
  rawCode: string,
  amountCents: number
): Promise<{ ok: boolean; newBalanceCents?: number }> {
  const code = normalizeGiftCode(rawCode);
  if (!code || amountCents <= 0) return { ok: false };
  try {
    const db = supabaseAdmin();
    const { data, error } = await db.rpc("redeem_gift_card", { p_code: code, p_amount: amountCents });
    if (error) {
      console.error("redeem_gift_card RPC failed:", error.message);
      return { ok: false };
    }
    // The function returns the new balance, or null when it couldn't apply.
    if (data === null || data === undefined) return { ok: false };
    return { ok: true, newBalanceCents: Number(data) };
  } catch (err) {
    console.error("redeemGift threw (treating as not redeemed):", err instanceof Error ? err.message : err);
    return { ok: false };
  }
}

/** Records a gift card the shop just sold. Upsert-ignore so a redelivered
 * Stripe webhook (which mints the same deterministic code) can't create a
 * duplicate or reset a balance already spent down. */
export async function recordIssuedGiftCard(opts: {
  code: string;
  amountCents: number;
  stripeSessionId: string;
}): Promise<void> {
  try {
    const db = supabaseAdmin();
    const { error } = await db.from("gift_cards").upsert(
      {
        code: opts.code,
        initial_cents: opts.amountCents,
        balance_cents: opts.amountCents,
        currency: "usd",
        status: "active",
        stripe_session_id: opts.stripeSessionId,
      },
      { onConflict: "code", ignoreDuplicates: true }
    );
    if (error) console.error("Failed to record issued gift card:", error.message);
  } catch (err) {
    // A gift card whose code emailed fine but didn't persist is recoverable by
    // hand from the order email; a throw here must not fail the whole webhook.
    console.error("recordIssuedGiftCard threw:", err instanceof Error ? err.message : err);
  }
}
