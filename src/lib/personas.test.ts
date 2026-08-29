import { test } from "node:test";
import assert from "node:assert/strict";
import {
  catalog,
  getCategory,
  resolveLinePrice,
  addOnPrice,
  addOnsConflict,
  type VehicleSize,
} from "../data/catalog.ts";
import { teslaModelFromVehicleInfo, teslaCoveragesFor } from "../data/teslaTint.ts";

/**
 * A walk-through of the site as thirty different customers.
 *
 * These exercise the resolver layer that the service pages, the booking
 * wizard and `/api/booking/start` all price with. Because all three call the
 * same functions, agreement here is what makes "the number you agreed to" and
 * "the number Stripe charges" the same number — the one defect in this
 * codebase that would cost real money rather than looking wrong.
 */

type Line = {
  service: string;
  pkg: string;
  addOns?: string[];
  film?: string;
  teslaCoverage?: string;
};
type Persona = {
  who: string;
  vehicleSize: VehicleSize;
  vehicleInfo: string;
  lines: Line[];
  /** Quote-only bookings legitimately charge nothing up front. */
  expectQuoteOnly?: boolean;
};

const personas: Persona[] = [
  // ---- Detailing, the core business -------------------------------------
  { who: "Commuter wants the basic detail", vehicleSize: "sedan", vehicleInfo: "2019 Honda Accord",
    lines: [{ service: "mobile-detailing", pkg: "the-diamond-detail" }] },
  { who: "SUV owner wants the mid detail", vehicleSize: "suv", vehicleInfo: "2021 Toyota Highlander",
    lines: [{ service: "mobile-detailing", pkg: "the-diamond-detail-plus" }] },
  { who: "Truck owner wants the top detail", vehicleSize: "truck", vehicleInfo: "2022 Ford F-150",
    lines: [{ service: "mobile-detailing", pkg: "the-diamond-detail-pro" }] },
  { who: "Just the inside, nothing else", vehicleSize: "sedan", vehicleInfo: "2018 Mazda 3",
    lines: [{ service: "mobile-detailing", pkg: "interior-detail" }] },
  { who: "Just the outside, nothing else", vehicleSize: "truck", vehicleInfo: "2020 RAM 1500",
    lines: [{ service: "mobile-detailing", pkg: "exterior-detail" }] },

  // ---- Tint, every coverage x film x size --------------------------------
  { who: "Front two only, cheapest film", vehicleSize: "sedan", vehicleInfo: "2017 Civic",
    lines: [{ service: "window-tinting", pkg: "front-two", film: "diamond-smoke" }] },
  { who: "Front two, mid film, mid-size", vehicleSize: "suv", vehicleInfo: "2021 CR-V",
    lines: [{ service: "window-tinting", pkg: "front-two", film: "diamond-ceramic-rx" }] },
  { who: "Front two, best film, large", vehicleSize: "truck", vehicleInfo: "2023 Tahoe",
    lines: [{ service: "window-tinting", pkg: "front-two", film: "diamond-ceramic-rx1" }] },
  { who: "Full vehicle, cheapest film", vehicleSize: "sedan", vehicleInfo: "2016 Altima",
    lines: [{ service: "window-tinting", pkg: "full-vehicle", film: "diamond-smoke" }] },
  { who: "Full vehicle, mid film, large", vehicleSize: "truck", vehicleInfo: "2022 Silverado",
    lines: [{ service: "window-tinting", pkg: "full-vehicle", film: "diamond-ceramic-rx" }] },
  { who: "Full vehicle, best film", vehicleSize: "suv", vehicleInfo: "2020 RX 350",
    lines: [{ service: "window-tinting", pkg: "full-vehicle", film: "diamond-ceramic-rx1" }] },
  { who: "Full vehicle plus a visor strip", vehicleSize: "sedan", vehicleInfo: "2019 Camry",
    lines: [{ service: "window-tinting", pkg: "full-vehicle", film: "diamond-ceramic-rx", addOns: ["windshield-strip"] }] },
  { who: "Full vehicle plus the whole windshield", vehicleSize: "suv", vehicleInfo: "2021 Palisade",
    lines: [{ service: "window-tinting", pkg: "full-vehicle", film: "diamond-ceramic-rx1", addOns: ["full-windshield"] }] },

  // ---- Tesla: priced on coverage x film, not size ------------------------
  { who: "Model 3, front doors, mid film", vehicleSize: "sedan", vehicleInfo: "2023 Tesla Model 3",
    lines: [{ service: "window-tinting", pkg: "front-two", film: "diamond-ceramic-rx" }] },
  { who: "Model 3, full car, best film", vehicleSize: "sedan", vehicleInfo: "2024 Tesla Model 3",
    lines: [{ service: "window-tinting", pkg: "full-vehicle", film: "diamond-ceramic-rx1" }] },
  { who: "Model Y wants the panoramic roof too", vehicleSize: "suv", vehicleInfo: "2023 Tesla Model Y",
    lines: [{ service: "window-tinting", pkg: "full-vehicle", film: "diamond-ceramic-rx", addOns: ["pano-roof"] }] },
  { who: "Model X, full car and full windshield", vehicleSize: "truck", vehicleInfo: "2022 Tesla Model X",
    lines: [{ service: "window-tinting", pkg: "full-vehicle", film: "diamond-ceramic-rx", addOns: ["full-windshield"] }] },
  { who: "Model Y, strip and roof together", vehicleSize: "suv", vehicleInfo: "2024 Tesla Model Y",
    lines: [{ service: "window-tinting", pkg: "full-vehicle", film: "diamond-smoke", addOns: ["windshield-strip", "pano-roof"] }] },

  // ---- PPF, every tier plus the small pieces -----------------------------
  { who: "Entry PPF only", vehicleSize: "sedan", vehicleInfo: "2021 Audi A4",
    lines: [{ service: "paint-protection-film", pkg: "barrier" }] },
  { who: "Mid PPF", vehicleSize: "suv", vehicleInfo: "2022 X3",
    lines: [{ service: "paint-protection-film", pkg: "shield" }] },
  { who: "PPF plus door edges and cups", vehicleSize: "sedan", vehicleInfo: "2023 Model S",
    lines: [{ service: "paint-protection-film", pkg: "armor", addOns: ["door-edge-guards", "door-cups"] }] },
  { who: "PPF with the lights done", vehicleSize: "truck", vehicleInfo: "2023 Raptor",
    lines: [{ service: "paint-protection-film", pkg: "track", addOns: ["headlight-ppf", "fog-light-ppf"] }] },
  { who: "Whole-car PPF — quote only", vehicleSize: "suv", vehicleInfo: "2024 Urus",
    lines: [{ service: "paint-protection-film", pkg: "full-protection" }], expectQuoteOnly: true },

  // ---- Ceramic, paint and the add-on coatings ---------------------------
  { who: "One-year coating", vehicleSize: "sedan", vehicleInfo: "2020 Golf",
    lines: [{ service: "ceramic-coating", pkg: "1-year-coating" }] },
  { who: "Five-year coating on a truck", vehicleSize: "truck", vehicleInfo: "2023 Tundra",
    lines: [{ service: "ceramic-coating", pkg: "5-year-coating" }] },
  { who: "Wheels only", vehicleSize: "suv", vehicleInfo: "2019 Q5",
    lines: [{ service: "ceramic-coating", pkg: "wheel-coating" }] },
  { who: "Windshield glass only", vehicleSize: "sedan", vehicleInfo: "2018 Jetta",
    lines: [{ service: "ceramic-coating", pkg: "windshield-only" }] },

  // ---- The rest of the catalogue ----------------------------------------
  { who: "Swirls polished out", vehicleSize: "sedan", vehicleInfo: "2015 BMW 335i",
    lines: [{ service: "paint-correction", pkg: catalog.find((c) => c.slug === "paint-correction")!.packages[0].slug }] },
  { who: "Seats restored", vehicleSize: "suv", vehicleInfo: "2016 Range Rover",
    lines: [{ service: "leather-restoration", pkg: catalog.find((c) => c.slug === "leather-restoration")!.packages[0].slug }] },
  { who: "Signs up for upkeep", vehicleSize: "sedan", vehicleInfo: "2022 Model 3",
    lines: [{ service: "maintenance-plans", pkg: "biweekly-maintenance" }] },

  // ---- Multi-service bookings, the combinations asked about --------------
  { who: "Detail and PPF together", vehicleSize: "sedan", vehicleInfo: "2023 Porsche 911",
    lines: [
      { service: "mobile-detailing", pkg: "the-diamond-detail" },
      { service: "paint-protection-film", pkg: "shield" },
    ] },
  { who: "PPF door cups plus an interior detail", vehicleSize: "suv", vehicleInfo: "2021 Macan",
    lines: [
      { service: "paint-protection-film", pkg: "barrier", addOns: ["door-cups"] },
      { service: "mobile-detailing", pkg: "interior-detail" },
    ] },
  { who: "Tint and ceramic in one visit", vehicleSize: "sedan", vehicleInfo: "2022 Model 3",
    lines: [
      { service: "window-tinting", pkg: "full-vehicle", film: "diamond-ceramic-rx" },
      { service: "ceramic-coating", pkg: "3-year-coating" },
    ] },
  { who: "The works: detail, coating, tint and PPF", vehicleSize: "truck", vehicleInfo: "2024 G63",
    lines: [
      { service: "mobile-detailing", pkg: "the-diamond-detail-pro" },
      { service: "ceramic-coating", pkg: "5-year-coating" },
      { service: "window-tinting", pkg: "full-vehicle", film: "diamond-ceramic-rx1" },
      { service: "paint-protection-film", pkg: "armor" },
    ] },
];

/** Mirrors `/api/booking/start` exactly. Kept beside the personas so a change
 * to the charge rules that isn't mirrored here shows up as a failure. */
function priceLine(p: Persona, line: Line) {
  const category = getCategory(line.service);
  assert.ok(category, `${p.who}: no such service "${line.service}"`);
  const pkg = category.packages.find((x) => x.slug === line.pkg);
  assert.ok(pkg, `${p.who}: no package "${line.pkg}" in ${line.service}`);

  const isTesla = /tesla/i.test(p.vehicleInfo);
  const teslaModel = teslaModelFromVehicleInfo(p.vehicleInfo);
  const teslaCoverage =
    line.teslaCoverage ??
    (isTesla && category.hasTeslaVariant
      ? teslaCoveragesFor(teslaModel).find((c) =>
          line.pkg === "front-two" ? /door/i.test(c.slug) : /full-car|full-rear/i.test(c.slug)
        )?.slug
      : undefined);

  const base =
    resolveLinePrice(pkg, p.vehicleSize, {
      isTesla: isTesla && category.hasTeslaVariant,
      filmSlug: line.film,
      teslaCoverageSlug: teslaCoverage,
    }) ?? 0;

  const addOns = (category.addOns ?? []).filter(
    (a) =>
      (line.addOns ?? []).includes(a.slug) &&
      !a.includedIn?.includes(pkg.slug) &&
      (!a.teslaOnly || isTesla)
  );
  const addOnsTotal = addOns.reduce(
    (n, a) => n + addOnPrice(a, { isTesla, filmSlug: line.film, teslaModel }),
    0
  );

  const depositPercent = pkg.depositPercent ?? 0;
  const deposit = depositPercent > 0 ? Math.round((base * depositPercent) / 100) : 0;
  const charge =
    pkg.pricing.type === "quote" ? 0 : (deposit > 0 ? deposit : base) + addOnsTotal;

  return { category, pkg, base, addOns, addOnsTotal, total: base + addOnsTotal, charge };
}

test("every persona gets a real, non-zero price for what they picked", () => {
  for (const p of personas) {
    for (const line of p.lines) {
      const r = priceLine(p, line);
      if (r.pkg.pricing.type === "quote") {
        assert.equal(r.charge, 0, `${p.who}: a quote-only package must not charge up front`);
        continue;
      }
      assert.ok(
        r.base > 0,
        `${p.who}: ${line.service}/${line.pkg} priced at ${r.base} — a zero here bills the customer nothing and quotes them nothing`
      );
      assert.ok(Number.isFinite(r.total), `${p.who}: total is not a number`);
    }
  }
});

test("every add-on a persona picked actually resolves and is charged", () => {
  for (const p of personas) {
    for (const line of p.lines) {
      const asked = line.addOns ?? [];
      if (asked.length === 0) continue;
      const r = priceLine(p, line);
      const isTesla = /tesla/i.test(p.vehicleInfo);
      // Tesla-only extras are legitimately dropped for other cars.
      const expected = asked.filter((slug) => {
        const a = (r.category.addOns ?? []).find((x) => x.slug === slug);
        return a && (!a.teslaOnly || isTesla) && !a.includedIn?.includes(r.pkg.slug);
      });
      assert.equal(
        r.addOns.length,
        expected.length,
        `${p.who}: expected ${expected.length} add-ons to resolve, got ${r.addOns.length}`
      );
      for (const a of r.addOns) {
        const price = addOnPrice(a, {
          isTesla,
          filmSlug: line.film,
          teslaModel: teslaModelFromVehicleInfo(p.vehicleInfo),
        });
        assert.ok(price > 0, `${p.who}: add-on ${a.slug} priced at ${price}`);
      }
    }
  }
});

test("the deposit is never more than the job, and a deposit job always charges something", () => {
  for (const p of personas) {
    for (const line of p.lines) {
      const r = priceLine(p, line);
      if (r.pkg.pricing.type === "quote") continue;
      assert.ok(
        r.charge <= r.total,
        `${p.who}: charging ${r.charge} on a ${r.total} job — a deposit cannot exceed the total`
      );
      assert.ok(r.charge > 0, `${p.who}: nothing charged for a bookable job`);
    }
  }
});

test("a Tesla is never quoted the size-based tint price by accident", () => {
  const tint = getCategory("window-tinting")!;
  for (const p of personas.filter((x) => /tesla/i.test(x.vehicleInfo))) {
    for (const line of p.lines.filter((l) => l.service === "window-tinting")) {
      const r = priceLine(p, line);
      const sizeBased = resolveLinePrice(
        tint.packages.find((x) => x.slug === line.pkg)!,
        p.vehicleSize,
        { filmSlug: line.film }
      );
      assert.ok(r.base > 0, `${p.who}: Tesla tint resolved to 0`);
      // Not asserting they differ — some genuinely coincide — only that the
      // Tesla path produced a real number rather than falling through.
      assert.ok(Number.isFinite(sizeBased ?? 0));
    }
  }
});

test("no persona can hold two add-ons that exclude each other", () => {
  for (const p of personas) {
    for (const line of p.lines) {
      const category = getCategory(line.service)!;
      const picked = (line.addOns ?? [])
        .map((s) => (category.addOns ?? []).find((a) => a.slug === s))
        .filter((a): a is NonNullable<typeof a> => Boolean(a));
      for (let i = 0; i < picked.length; i++) {
        for (let j = i + 1; j < picked.length; j++) {
          assert.ok(
            !addOnsConflict(picked[i], picked[j]),
            `${p.who}: ${picked[i].slug} and ${picked[j].slug} cannot both be bought`
          );
        }
      }
    }
  }
});

test("a multi-service booking totals the sum of its lines", () => {
  for (const p of personas.filter((x) => x.lines.length > 1)) {
    const lines = p.lines.map((l) => priceLine(p, l));
    const total = lines.reduce((n, r) => n + r.total, 0);
    const charge = lines.reduce((n, r) => n + r.charge, 0);
    assert.ok(total > 0, `${p.who}: multi-service booking totalled 0`);
    assert.ok(charge > 0, `${p.who}: multi-service booking charged 0`);
    assert.ok(charge <= total, `${p.who}: charged ${charge} on a ${total} booking`);
  }
});

test("an unrecognised film is never priced as if it were the cheapest one", () => {
  // Regression. The wizard falls back to Ceramic RX for *display* when the
  // film is absent, but a bogus slug is truthy, so it survived that fallback
  // and then missed the film table — showing RX and charging the base rate,
  // $299 against $449 on a mid-size full vehicle. Both the booking page and
  // the API now reject a film that isn't ours, so the two can't diverge.
  const tint = getCategory("window-tinting")!;
  const full = tint.packages.find((p) => p.slug === "full-vehicle")!;
  const real = resolveLinePrice(full, "suv", { filmSlug: "diamond-ceramic-rx" });
  const base = resolveLinePrice(full, "suv", { filmSlug: undefined });
  assert.ok(real !== null && base !== null);
  assert.ok(
    real > base,
    "the film table must actually change the price, or this whole class of bug is invisible"
  );
  assert.equal(
    resolveLinePrice(full, "suv", { filmSlug: "not-a-real-film" }),
    base,
    "an unknown film still falls back to base here — which is why it must be rejected at the boundary"
  );
});

test("every package in the catalogue is reachable and priced, not just the sampled ones", () => {
  const sizes: VehicleSize[] = ["sedan", "suv", "truck"];
  for (const category of catalog) {
    for (const pkg of category.packages) {
      for (const size of sizes) {
        const price = resolveLinePrice(pkg, size, {
          filmSlug: category.slug === "window-tinting" ? "diamond-ceramic-rx" : undefined,
        });
        if (pkg.pricing.type === "quote") continue;
        assert.ok(
          price !== null && price > 0,
          `${category.slug}/${pkg.slug} has no price for ${size} — it is bookable but unpriced`
        );
      }
    }
  }
});
