import test from "node:test";
import assert from "node:assert/strict";
import { getReviews } from "@/lib/googleReviews";
import { testimonials as curated } from "@/data/testimonials";

const KEY = "GOOGLE_PLACES_API_KEY";
const ID = "GOOGLE_PLACE_ID";

/** Runs getReviews with the given env and a stubbed fetch, then puts both
 * back. The real network is never touched. */
async function withStub(
  env: Record<string, string | undefined>,
  impl: typeof globalThis.fetch | null
) {
  const prevKey = process.env[KEY];
  const prevId = process.env[ID];
  const prevFetch = globalThis.fetch;
  if (env[KEY] === undefined) delete process.env[KEY];
  else process.env[KEY] = env[KEY];
  if (env[ID] === undefined) delete process.env[ID];
  else process.env[ID] = env[ID];
  if (impl) globalThis.fetch = impl;
  try {
    return await getReviews();
  } finally {
    if (prevKey === undefined) delete process.env[KEY];
    else process.env[KEY] = prevKey;
    if (prevId === undefined) delete process.env[ID];
    else process.env[ID] = prevId;
    globalThis.fetch = prevFetch;
  }
}

const ok = (body: unknown) =>
  (async () =>
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    })) as unknown as typeof globalThis.fetch;

test("with no key configured it uses the hand-entered reviews and never calls out", async () => {
  let called = false;
  const res = await withStub({}, (async () => {
    called = true;
    throw new Error("should not be reached");
  }) as unknown as typeof globalThis.fetch);

  assert.equal(called, false);
  assert.equal(res.source, "curated");
  assert.deepEqual(res.testimonials, curated);
});

test("a live listing replaces the rating, the count and the quotes", async () => {
  const res = await withStub(
    { [KEY]: "k", [ID]: "p" },
    ok({
      rating: 4.85,
      userRatingCount: 23,
      reviews: [
        {
          rating: 5,
          text: { text: "Did a great job on my car." },
          authorAttribution: { displayName: "Sam R" },
        },
      ],
    })
  );

  assert.equal(res.source, "google");
  assert.equal(res.count, 23);
  // Rounded for display, not floored — 4.85 must not become 4.8.
  assert.equal(res.average, 4.9);
  assert.deepEqual(res.testimonials, [
    { name: "Sam R", quote: "Did a great job on my car.", rating: 5 },
  ]);
});

test("a bad response falls back rather than showing a broken rating", async () => {
  for (const body of [{}, { rating: 4.9 }, { userRatingCount: 10 }, { rating: "4.9", userRatingCount: 10 }]) {
    const res = await withStub({ [KEY]: "k", [ID]: "p" }, ok(body));
    assert.equal(res.source, "curated", `should fall back for ${JSON.stringify(body)}`);
    assert.equal(res.count, 8);
  }
});

test("an HTTP error or a thrown fetch falls back", async () => {
  const err = await withStub({ [KEY]: "k", [ID]: "p" }, (async () =>
    new Response("nope", { status: 403 })) as unknown as typeof globalThis.fetch);
  assert.equal(err.source, "curated");

  const thrown = await withStub({ [KEY]: "k", [ID]: "p" }, (async () => {
    throw new Error("network down");
  }) as unknown as typeof globalThis.fetch);
  assert.equal(thrown.source, "curated");
});

test("live numbers are kept even when every quote is unusable", async () => {
  const res = await withStub(
    { [KEY]: "k", [ID]: "p" },
    ok({
      rating: 5,
      userRatingCount: 12,
      // Ratings out of range, wrong types, and empty text: all dropped.
      reviews: [
        { rating: 9, text: { text: "impossible rating" } },
        { rating: "5", text: { text: "rating is a string" } },
        { rating: 5, text: { text: "   " } },
      ],
    })
  );

  assert.equal(res.source, "google");
  assert.equal(res.count, 12);
  // The count is real, so it stays — but with no usable quote the page shows
  // the curated ones rather than an empty grid.
  assert.deepEqual(res.testimonials, curated);
});

test("review text is flattened and capped so one review can't wreck the grid", async () => {
  const res = await withStub(
    { [KEY]: "k", [ID]: "p" },
    ok({
      rating: 5,
      userRatingCount: 3,
      reviews: [
        {
          rating: 5,
          text: { text: `line one\n\nline two\t\tspaced` },
          authorAttribution: { displayName: "  Nested  Name  " },
        },
        { rating: 5, text: { text: "x".repeat(1000) } },
      ],
    })
  );

  assert.equal(res.testimonials[0].quote, "line one line two spaced");
  assert.equal(res.testimonials[0].name, "Nested  Name");
  assert.ok(res.testimonials[1].quote.length <= 320);
  assert.ok(res.testimonials[1].quote.endsWith("…"));
});

test("no more than five quotes are ever shown", async () => {
  const res = await withStub(
    { [KEY]: "k", [ID]: "p" },
    ok({
      rating: 5,
      userRatingCount: 40,
      reviews: Array.from({ length: 12 }, (_, i) => ({
        rating: 5,
        text: { text: `review ${i}` },
        authorAttribution: { displayName: `Person ${i}` },
      })),
    })
  );

  assert.equal(res.testimonials.length, 5);
});
