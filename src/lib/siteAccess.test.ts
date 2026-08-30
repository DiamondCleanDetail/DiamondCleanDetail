import test from "node:test";
import assert from "node:assert/strict";
import { isOwnerEmail, ownerEmails } from "@/lib/siteAccess";

// isOwnerEmail is one half of the admin gate — the layout also requires a
// verified, signed-in Clerk session — so these pin the matching rules that a
// typo or a stray env value could quietly break.

test("the business email is an owner by default, with no env set", () => {
  assert.equal(isOwnerEmail("info@diamondcleandetail.com"), true);
});

test("matching ignores case and surrounding whitespace", () => {
  assert.equal(isOwnerEmail("INFO@diamondcleandetail.com"), true);
  assert.equal(isOwnerEmail("  info@diamondcleandetail.com  "), true);
});

test("a non-owner email is never an owner", () => {
  assert.equal(isOwnerEmail("someone.else@gmail.com"), false);
  assert.equal(isOwnerEmail("attacker@diamondcleandetail.com.evil.com"), false);
});

test("null, undefined and empty are never owners", () => {
  assert.equal(isOwnerEmail(null), false);
  assert.equal(isOwnerEmail(undefined), false);
  assert.equal(isOwnerEmail(""), false);
  assert.equal(isOwnerEmail("   "), false);
});

test("a near-miss of the owner email does not match", () => {
  // A lookalike domain or a subaddress is a different address, not the owner.
  assert.equal(isOwnerEmail("info@diamondclean-detail.com"), false);
  assert.equal(isOwnerEmail("info+admin@diamondcleandetail.com"), false);
});

test("ADMIN_EMAILS widens the set and stays case-insensitive", () => {
  const prev = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = "owner@shop.com, Farhan@Shop.com";
  try {
    assert.deepEqual(ownerEmails(), ["owner@shop.com", "farhan@shop.com"]);
    assert.equal(isOwnerEmail("FARHAN@shop.com"), true);
    // The default fallback is replaced, not appended to, when the env is set.
    assert.equal(isOwnerEmail("info@diamondcleandetail.com"), false);
  } finally {
    if (prev === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = prev;
  }
});
