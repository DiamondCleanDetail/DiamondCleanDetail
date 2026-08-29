/**
 * Finds the Google place ID for the business listing, so the reviews block can
 * be pointed at it.
 *
 * You only ever need to run this once — the ID does not change, even if the
 * listing is renamed. Put the result in GOOGLE_PLACE_ID.
 *
 *   GOOGLE_PLACES_API_KEY=... node scripts/find-place-id.mjs
 *   GOOGLE_PLACES_API_KEY=... node scripts/find-place-id.mjs "some other name"
 */
const key = process.env.GOOGLE_PLACES_API_KEY;
if (!key) {
  console.error("Set GOOGLE_PLACES_API_KEY first.");
  process.exit(1);
}

const query = process.argv[2] ?? "Diamond Clean Detailing Denver";

const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": key,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount",
  },
  body: JSON.stringify({ textQuery: query }),
});

if (!res.ok) {
  console.error(`${res.status} ${res.statusText}`);
  console.error(await res.text());
  process.exit(1);
}

const { places = [] } = await res.json();
if (!places.length) {
  console.error(`Nothing found for "${query}".`);
  process.exit(1);
}

// Printed as a list rather than auto-picking the first: several detailers in
// Denver have similar names, and pointing the site at a competitor's reviews
// would be a quiet, embarrassing bug. Check the address before choosing.
for (const p of places) {
  console.log(`\n${p.displayName?.text ?? "(no name)"}`);
  console.log(`  ${p.formattedAddress ?? "(no address)"}`);
  console.log(`  ${p.rating ?? "?"} stars from ${p.userRatingCount ?? "?"} reviews`);
  console.log(`  GOOGLE_PLACE_ID=${p.id}`);
}
console.log("");
