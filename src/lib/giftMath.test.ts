import test from "node:test";
import assert from "node:assert/strict";
import { computeGiftApplication, normalizeGiftCode } from "@/lib/giftMath";

// computeGiftApplication decides how much of a gift card applies and what's
// left to charge. It runs on the server (authoritative) and in the wizard
// (preview), so these pin the money math both rely on.

test("a card smaller than the bill applies its whole balance", () => {
  assert.deepEqual(computeGiftApplication(10000, 5000), { appliedCents: 5000, remainingChargeCents: 5000 });
});

test("a card equal to the bill clears it", () => {
  assert.deepEqual(computeGiftApplication(10000, 10000), { appliedCents: 10000, remainingChargeCents: 0 });
});

test("a card larger than the bill only applies what's needed", () => {
  assert.deepEqual(computeGiftApplication(5000, 10000), { appliedCents: 5000, remainingChargeCents: 0 });
});

test("an empty card applies nothing", () => {
  assert.deepEqual(computeGiftApplication(10000, 0), { appliedCents: 0, remainingChargeCents: 10000 });
});

test("nothing to charge means nothing to apply", () => {
  assert.deepEqual(computeGiftApplication(0, 10000), { appliedCents: 0, remainingChargeCents: 0 });
});

test("a sub-50-cent remainder is bumped up to the Stripe minimum", () => {
  // $100.30 bill, $100.00 card → naive remainder is 30c, below Stripe's floor.
  // Leave exactly 50c to charge and use a hair less of the card.
  assert.deepEqual(computeGiftApplication(10030, 10000), { appliedCents: 9980, remainingChargeCents: 50 });
});

test("the whole-dollar amounts we actually sell never hit the sub-minimum path", () => {
  // $150 bill, $50 card → clean $100 remainder.
  assert.deepEqual(computeGiftApplication(15000, 5000), { appliedCents: 5000, remainingChargeCents: 10000 });
});

test("normalizeGiftCode canonicalises spacing, case and dashes", () => {
  assert.equal(normalizeGiftCode("dcd abcd 2345"), "DCD-ABCD-2345");
  assert.equal(normalizeGiftCode("DCD-ABCD-2345"), "DCD-ABCD-2345");
  assert.equal(normalizeGiftCode("dcdabcd2345"), "DCD-ABCD-2345");
});

test("normalizeGiftCode leaves an unrecognised shape alone but upper-cased", () => {
  assert.equal(normalizeGiftCode("  promo-xyz  "), "PROMO-XYZ");
});
