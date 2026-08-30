import { policies } from "@/data/policies";
import { teslaTintPrice } from "@/data/teslaTint";
import { tintPrice } from "@/data/tintPricing";

export type VehicleSize = "sedan" | "suv" | "truck";

/**
 * What the three price buckets are really measuring is how much car there is
 * to work on — for tint specifically, how many rows of glass. So minivans sit
 * in the largest bucket alongside three-row SUVs rather than in the middle,
 * and the middle one is named for what actually lives there now: two-row
 * hatchbacks and mid-size SUVs. It used to read "SUV / Minivan", which put
 * a three-row Odyssey and a two-row CR-V under one label and one price.
 */
export const vehicleSizeLabels: Record<VehicleSize, string> = {
  sedan: "Sedan / Coupe",
  suv: "Hatchback / Mid-size SUV",
  truck: "Truck / Full-size SUV",
};

/** The short forms used where the full label won't fit — a pricing column
 * head, a tab. Kept next to the labels so the two can't drift. */
export const vehicleSizeShortLabels: Record<VehicleSize, string> = {
  sedan: "Sedan",
  suv: "Mid-size",
  truck: "Large",
};

export type PricingModel =
  | { type: "fixed"; byVehicleSize: Record<VehicleSize, number> }
  | { type: "starting-at"; amount: number }
  | { type: "quote" };

export type Package = {
  slug: string;
  name: string;
  tagline: string;
  features: string[];
  pricing: PricingModel;
  durationMinutes?: number;
  depositPercent?: number;
  /** Headline outcome for tiered corrective work, e.g. "50–70%". Rendered as
   * the card's defining number so stages compare on result, not just price.
   * Presented as an approximation, because paint condition varies per car. */
  defectRemoval?: string;
  /** Marks fixed per-size prices as a floor rather than a firm quote, shown
   * as "$1,349+". For work whose scope is set by the vehicle's condition
   * rather than its size — a Stage 3 correction being the case in point. */
  priceIsFrom?: boolean;
  /** Who this tier is actually for — the paint/interior conditions it suits. */
  bestFor?: string[];
  /** Stated plainly on the card. Prevents the worst outcome in this trade:
   * someone expecting correction from a clean, or a coating from a polish. */
  excludes?: string[];
  /** Shows a "Most Popular" badge and highlighted border on the package card. */
  featured?: boolean;
  /** Groups packages under a subheading on the pricing list, e.g. "Wheel Coating" —
   * for categories (like Ceramic Coating) that bundle a few related package sets
   * on one page. Ungrouped packages render first, under no subheading. */
  group?: string;
};

/** An optional extra bought alongside a package — e.g. PPF on door edges.
 * Prices are flat (not vehicle-size dependent) since these are small,
 * fixed-area pieces. */
export type AddOn = {
  slug: string;
  name: string;
  description: string;
  price: number;
  /** Photo of the add-on applied. Null renders a placeholder tile. */
  image?: string | null;
  /** Packages that already cover this area, so it isn't sold twice. */
  includedIn?: string[];
  /** Add-ons sharing a group are one-or-the-other: choosing one replaces the
   * other everywhere they're offered. The windshield options are the case in
   * point — the full windshield already covers the strip's glass, so selling
   * both is selling the same film twice. */
  exclusiveGroup?: string;
  /** Only offered on Teslas — the panoramic roof being the case in point.
   * Hidden from non-Tesla UIs and ignored by the server for non-Tesla lines. */
  teslaOnly?: boolean;
  /** Flat Tesla override of `price` (the strip runs $59 on a Tesla vs $50). */
  teslaFlatPrice?: number;
  /** Tesla price by film slug, for work where the film drives the cost —
   * the panoramic roof is film-priced where the windshield options aren't. */
  teslaPriceByFilm?: Record<string, number>;
  /** Tesla price by model name (matching vehicles.ts), for glass that only
   * some Teslas have — the Model X windshield is nearly twice the standard. */
  teslaPriceByModel?: Record<string, number>;
};

/** Whether two add-ons are mutually exclusive. One rule, asked the same way
 * by the page, the wizard and the API — so the three cannot drift. */
export function addOnsConflict(a: AddOn, b: AddOn): boolean {
  return Boolean(a.exclusiveGroup && a.exclusiveGroup === b.exclusiveGroup && a.slug !== b.slug);
}

/** What one add-on costs in context. Everything that quotes or charges an
 * add-on asks this — the page, the wizard and the API — because a Tesla can
 * reprice the same add-on three different ways (flat override, by film, by
 * model) and each surface deciding for itself is how quotes drift. */
export function addOnPrice(
  a: AddOn,
  ctx: { isTesla?: boolean; filmSlug?: string; teslaModel?: string | null } = {}
): number {
  if (!ctx.isTesla) return a.price;
  if (ctx.teslaModel && a.teslaPriceByModel?.[ctx.teslaModel] !== undefined) {
    return a.teslaPriceByModel[ctx.teslaModel];
  }
  if (ctx.filmSlug && a.teslaPriceByFilm?.[ctx.filmSlug] !== undefined) {
    return a.teslaPriceByFilm[ctx.filmSlug];
  }
  return a.teslaFlatPrice ?? a.price;
}

export type Benefit = { title: string; description: string };
export type ProcessStep = { title: string; description: string };

export type ServiceCategory = {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  description: string;
  heroNote?: string;
  /** One-line hero subtitle for the detail page. */
  tagline: string;
  /** Path under /public/video for this page's hero background, e.g. "/video/mobile-detailing.mp4". */
  heroVideo?: string;
  /** Static hero background image, used when a video isn't available yet. */
  heroImage?: string;
  /** Photo shown on this service's card in the services list and booking
   * picker, so those grids read visually instead of as a wall of text.
   * Omit for a category with no representative photo yet — the card falls
   * back to a placeholder rather than borrowing an unrelated image. */
  cardImage?: string;
  /** Swapped in for heroImage on mobile — for a hero background that needs
   * a different crop on a tall, narrow screen instead of a harder crop of
   * the same wide image. */
  heroImageMobile?: string;
  /** Optional explainer image shown beside the "What It Is" copy, e.g. "/services/ceramic-coating-diagram.jpg". */
  valuePropImage?: string;
  /** Set when valuePropImage is a photograph rather than a diagram.
   *
   * The default slot is a square box with object-contain, which is right for
   * a diagram — you must see all of it, and letterboxing is the price. A
   * landscape photo in that box is mostly empty background with a strip of
   * picture through the middle. This gives it a 4:3 frame it can fill. */
  valuePropImageIsPhoto?: boolean;
  /** A clip shown beside the "What It Is" copy instead of valuePropImage.
   * For a service whose explanation is really a demonstration — watching the
   * polisher work says more about correction than any still can. */
  valuePropVideo?: string;
  /** One photo per benefit card, same order as `benefits`. A missing or
   * null entry renders a "coming soon" placeholder for that card instead
   * of leaving it text-only. */
  benefitImages?: ({ src: string; alt: string } | null)[];
  /** Drag-to-compare before/after photos shown beside the "What It Is" copy instead of valuePropImage. Null values render a "coming soon" placeholder. */
  beforeAfter?: { before: string | null; after: string | null; beforeLabel?: string; afterLabel?: string };
  /** Slideshow of application/process photos or video (e.g. applying ceramic coating, water beading on finished paint). Set to an empty array or omit to render a "coming soon" placeholder. */
  processMedia?: { type: "image" | "video"; src: string; caption?: string }[];
  /** Copy set beside the process media rather than under it. Use when the
   * clip is one thing worth explaining, not a reel to sit through — the
   * media and the reason for it then read as a single point. */
  processMediaNote?: { title: string; body: string };
  /** Horizontally scrollable gallery of past jobs of this service type, shown below the final booking CTA. Omit or leave empty to render a "coming soon" placeholder. */
  galleryImages?: { src: string; caption: string }[];
  /** "What is this service" explainer paragraph. */
  valueProp: string;
  benefits: Benefit[];
  process: ProcessStep[];
  /** Slugs of other categories to surface as "Related Services" on this page. */
  relatedSlugs?: string[];
  packages: Package[];
  /** Optional extras offered with this service, selectable at checkout. */
  addOns?: AddOn[];
  visualizer?: "tint" | "ppf";
  hasTeslaVariant?: boolean;
  isQuoteOnly?: boolean;
  /** One short factual number per card, shown as a bold stat callout below
   * the benefits — e.g. a real spec, not a vague marketing claim. Omit
   * entirely for a category with no verified number to show; don't invent
   * one just to fill the slot. */
  stats?: { value: string; label: string }[];
  /** Overrides the 3 auto-generated FAQ entries (booking/duration/mobile-
   * service) for this category. Only needed when the generic answers don't
   * fit — most categories should leave this unset. */
  faqs?: { q: string; a: string }[];
  /** Whether this service is delivered on-site at the customer's location.
   * Defaults to true — every current category is mobile. */
  isMobileService?: boolean;
  /** Work that wants a garage or carport to cure properly — film and coatings.
   * Still mobile, but "we come to you" on its own oversells it, so these
   * categories say what they need up front rather than on the day. */
  needsCoveredSpace?: boolean;
};

export const catalog: ServiceCategory[] = [
  {
    slug: "mobile-detailing",
    name: "Mobile Detailing",
    shortName: "Mobile Detailing",
    summary: "Full interior & exterior detailing, wherever your car is parked.",
    description:
      "Our core detailing packages, brought to your driveway or office. Hand wash, deep interior cleaning, and finishing touches that leave your vehicle looking showroom-fresh.",
    tagline: "Showroom results, without the drive to a shop.",
    heroVideo: "/video/mobile-detailing.mp4",
    cardImage: "/work/porsche-911-orange-1.webp",
    // Matched to the benefits below: on-location van, a swirl-free dark panel,
    // and a finish still glossy after the fact.
    benefitImages: [
      { src: "/work/morgan-1.webp", alt: "A detailer working on a blue SUV parked on a residential driveway" },
      { src: "/work/range-rover-black-1.webp", alt: "The hand-washed flank of a black Range Rover, free of swirl marks" },
      { src: "/work/porsche-911-orange-1.webp", alt: "Sunlight reflecting cleanly off the finished paint of an orange Porsche 911" },
    ],
    beforeAfter: {
      before: "/before-after/rav4-before.jpg",
      after: "/before-after/rav4-after.jpg",
      beforeLabel: "Before",
      afterLabel: "After",
    },
    valueProp:
      "Mobile detailing means our team comes to you — your driveway, office lot, or apartment garage — with everything needed to hand wash, deep-clean, and finish your vehicle on site. No drop-off, no waiting around a shop, no losing your car for the day.",
    benefits: [
      { title: "We come to you", description: "Fully equipped mobile setup — water, power, and products all included, wherever you're parked." },
      { title: "Hand-applied care", description: "No touchless tunnel washes. Every panel and surface is hand-washed and hand-dried to avoid swirl marks." },
      { title: "Built to last", description: "Sealant and conditioning steps that keep the finish looking fresh well after we leave." },
    ],
    process: [
      { title: "Book your time", description: "Pick a package, date, and time online — we'll confirm the address." },
      { title: "We set up on site", description: "Our team arrives with water, power, and all equipment needed — nothing required from you." },
      { title: "Wash, clean & protect", description: "Exterior hand wash, interior deep clean, and a protective finish depending on your package." },
      { title: "Final walkthrough", description: "We review the vehicle with you before we leave to make sure every detail is covered." },
    ],
    relatedSlugs: ["paint-correction", "scratch-removal", "leather-restoration"],
    // Practical questions people actually have about mobile service (what
    // every national mobile detailer answers), replacing the generic
    // auto-generated set. Answers restate facts already on this page.
    faqs: [
      {
        q: "Do I need to provide water or power?",
        a: "No — we arrive fully equipped with water, power, and every product and tool the job needs. Nothing is required from you except the car.",
      },
      {
        q: "Where can you detail my car?",
        a: "Anywhere you're parked in the Denver Metro Area — your driveway, office lot, or apartment garage all work.",
      },
      {
        q: "How do I book?",
        a: "Pick a package, choose an available date and time, and pay online — no phone call needed. We'll confirm the address before your appointment.",
      },
    ],
    // Nearly every job on the Our Work page is a mobile detail, so the same
    // photos carry this page's gallery.
    galleryImages: [
      { src: "/work/ferrari-488-1.webp", caption: "The Diamond Detail Pro — Ferrari 488 Spider" },
      { src: "/work/ferrari-488-3.webp", caption: "The Diamond Detail Pro — Ferrari 488 Spider" },
      { src: "/work/lamborghini-huracan-1.webp", caption: "The Diamond Detail Pro — Lamborghini Huracán" },
      { src: "/work/bentley-1.webp", caption: "The Diamond Detail Pro — Bentley" },
      { src: "/work/porsche-911-orange-1.webp", caption: "The Diamond Detail Plus — Porsche 911 Carrera 4S" },
      { src: "/work/porsche-911-orange-3.webp", caption: "The Diamond Detail Plus — Porsche 911 Carrera 4S" },
      { src: "/work/porsche-911-red-1.webp", caption: "The Diamond Detail — Porsche 911" },
      { src: "/work/porsche-macan-white-1.webp", caption: "The Diamond Detail — Porsche Macan" },
      { src: "/work/porsche-macan-orange-1.webp", caption: "The Diamond Detail — Porsche Macan GTS" },
      { src: "/work/porsche-cayenne-1.webp", caption: "The Diamond Detail — Porsche Cayenne" },
      { src: "/work/mercedes-amg-gt-1.webp", caption: "The Diamond Detail Pro — Mercedes-AMG GT" },
      { src: "/work/mercedes-amg-gt-3.webp", caption: "The Diamond Detail Pro — Mercedes-AMG GT" },
      { src: "/work/bmw-m3-2.webp", caption: "The Diamond Detail — BMW M3 Competition" },
      { src: "/work/bmw-x5-1.webp", caption: "The Diamond Detail Pro — BMW X5" },
      { src: "/work/velar-1.webp", caption: "The Diamond Detail Plus — Range Rover Velar" },
      { src: "/work/range-rover-black-1.webp", caption: "The Diamond Detail Plus — Range Rover" },
      { src: "/work/jose-1.webp", caption: "The Diamond Detail — Land Rover Discovery Sport" },
      { src: "/work/jose-3.webp", caption: "The Diamond Detail — Land Rover Discovery Sport" },
      { src: "/work/audi-interior-1.webp", caption: "The Diamond Detail — Audi Interior" },
      { src: "/work/lexus-rx-1.webp", caption: "The Diamond Detail Pro — Lexus RX" },
      { src: "/work/acura-mdx-1.webp", caption: "Clean & Condition — Acura MDX" },
      { src: "/work/jeep-wrangler-1.webp", caption: "The Diamond Detail — Jeep Wrangler" },
      { src: "/work/morgan-1.webp", caption: "The Diamond Detail Plus — Blue SUV" },
      { src: "/work/green-car-1.webp", caption: "The Diamond Detail — Green Hatchback" },
      { src: "/work/sport-bike.jpg", caption: "Mobile Detail — Sport Bike" },
      { src: "/work/harley-bagger.jpg", caption: "Motorcycle Detail — Harley-Davidson Bagger" },
    ],
    packages: [
      {
        // PRICES ADAPTED from the sheet Farhan shared, not copied: its
        // interior-only price ($179 sedan) sat above our full Diamond Detail
        // ($175), which would make the half job cost more than the whole one.
        // Scaled down to keep the sheet's interior-vs-exterior ratio while
        // staying under the full detail. Needs Farhan's sign-off.
        slug: "interior-detail",
        name: "Interior Detail",
        tagline: "The full deep clean, inside only.",
        features: [
          "Thorough vacuum of carpets, seats & trunk",
          "Cracks, crevices, vents & console detailed",
          "Trim, dash & steering column cleaned and protected",
          "Leather seats cleaned and conditioned",
          "Odor-causing residue removed at the source",
        ],
        excludes: ["Exterior wash", "Paint correction or scratch removal"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 139, suv: 159, truck: 179 } },
        durationMinutes: 120,
        depositPercent: 25,
      },
      {
        // Exterior prices taken from the same sheet as-is — they already sit
        // sensibly under the full detail. Needs Farhan's sign-off.
        slug: "exterior-detail",
        name: "Exterior Detail",
        tagline: "A proper hand wash and finish, outside only.",
        features: [
          "Safe hand wash of the full exterior",
          "All exterior windows and mirrors cleaned",
          "Rims and wheel wells deep cleaned",
          "Tires dressed with 2-month UV protectant",
          "Exterior trim dressed & door jambs wiped down",
        ],
        excludes: ["Interior cleaning", "Paint correction or scratch removal"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 109, suv: 119, truck: 129 } },
        durationMinutes: 90,
        depositPercent: 25,
      },
      {
        slug: "the-diamond-detail",
        name: "The Diamond Detail",
        tagline: "A comprehensive deep clean, conditioning, and protection for all surfaces.",
        features: [
          "Deep interior & exterior clean",
          "Conditioning for all surfaces",
          "Protective finish",
          "Restores that factory-fresh feel and scent",
        ],
        excludes: ["Paint correction or scratch removal", "Ceramic coating"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 175, suv: 210, truck: 240 } },
        durationMinutes: 180,
        depositPercent: 25,
      },
      {
        slug: "the-diamond-detail-plus",
        name: "The Diamond Detail Plus",
        tagline: "Multi-stage paint correction with a premium wax or sealant finish.",
        features: [
          "Everything in The Diamond Detail",
          "Multi-stage paint correction",
          "Removes swirls & imperfections",
          "Premium wax or sealant for a deep, glossy finish",
        ],
        excludes: ["Ceramic coating", "Paint protection film"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 450, suv: 525, truck: 575 } },
        durationMinutes: 480,
        depositPercent: 25,
        featured: true,
      },
      {
        slug: "the-diamond-detail-pro",
        name: "The Diamond Detail Pro",
        tagline: "Full paint correction and professional-grade ceramic coating.",
        features: [
          "Everything in The Diamond Detail Plus",
          "Full multi-stage paint correction",
          "Professional-grade ceramic coating",
          "Long-lasting, unparalleled shine",
        ],
        pricing: { type: "fixed", byVehicleSize: { sedan: 750, suv: 875, truck: 950 } },
        durationMinutes: 600,
        depositPercent: 25,
      },
    ],
  },
  {
    slug: "paint-correction",
    name: "Paint Correction",
    shortName: "Paint Correction",
    summary: "Machine polishing to remove swirls, scratches, and oxidation.",
    description:
      "Multi-stage machine polishing that removes swirl marks, light scratches, and oxidation to restore paint clarity and gloss before a ceramic coating or on its own.",
    tagline: "Restore the paint underneath the swirls.",
    heroVideo: "/video/paint-correction.mp4",
    cardImage: "/work/range-rover-black-1.webp",
    // The old hero, rehomed. "What It Is" was a "photo coming soon" box, and
    // a clip of the polisher actually working explains correction better than
    // the paragraph beside it ever could.
    valuePropVideo: "/video/paint-correction-polishing.mp4",
    // One clip, not a reel: this is Farhan's own footage of a real job, and
    // a second slide only invited people to sit and wait through it.
    processMedia: [
      {
        type: "video",
        src: "/video/paint-correction-apillar.mp4",
        caption: "Machine-polishing faded A-pillar trim back to gloss",
      },
    ],
    processMediaNote: {
      title: "Trim and tight areas, not just the big panels",
      body: "An A-pillar is the kind of area that gets skipped — too narrow for a big polisher, easy to leave faded while the doors and hood come up gleaming. It gets the same passes as everything else, which is why the finished car looks corrected from every angle rather than only in the photos.",
    },
    valueProp:
      "Every vehicle picks up fine swirl marks and light scratches from years of washing. Paint correction uses machine polishers and cutting/finishing compounds to level out that top layer of clear coat, bringing back true clarity and gloss before any wax, sealant, or ceramic coating goes on.",
    // Farhan's own shot, and the only one on the site that shows the defect
    // rather than the result: corrected paint on the left holding a clean
    // round highlight, untouched paint on the right throwing the same light
    // into a spiderweb. Most people have never seen their own swirls.
    benefitImages: [
      {
        src: "/services/correction-swirls.webp",
        alt: "The same light on two panels: a clean round reflection on corrected paint, and a spiderweb of fine scratches around it on uncorrected paint",
      },
      null,
      null,
    ],
    benefits: [
      { title: "Removes swirl marks", description: "Machine polishing levels out the fine scratches that dull a paint job over time." },
      { title: "Maximizes gloss", description: "Correcting the clear coat is what makes paint look genuinely wet and deep, not just clean." },
      { title: "The right prep step", description: "Ceramic coatings and PPF both look and bond better over corrected paint." },
    ],
    process: [
      { title: "Paint inspection", description: "We check paint thickness and defect severity to pick the right correction stage." },
      { title: "Wash & decontaminate", description: "Clay bar and chemical decontamination remove bonded dirt before any polishing starts." },
      { title: "Machine correction", description: "Compounding and polishing passes remove swirls, scratches, and oxidation." },
      { title: "Finish & inspect", description: "A finishing polish maximizes gloss, then we inspect under proper lighting." },
    ],
    packages: [
      {
        slug: "single-stage",
        name: "Stage 1 — Enhancement",
        tagline: "A one-step polish that lifts gloss and clears light swirls.",
        defectRemoval: "30–50%",
        features: ["One-step machine polish", "Removes light swirl marks", "Enhanced gloss & clarity"],
        bestFor: ["Light swirl marks", "Minor water spots", "Dull or faded finish", "Prep before a wax or sealant"],
        excludes: ["Deep scratches you can catch with a fingernail", "Ceramic coating"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 349, suv: 425, truck: 495 } },
        durationMinutes: 240,
        depositPercent: 25,
      },
      {
        slug: "two-stage",
        name: "Stage 2 — Correction",
        tagline: "Compound and polish for paint that's taken real wear.",
        defectRemoval: "50–70%",
        features: [
          "Compounding pass, then a refining polish",
          "Removes heavier swirls & light scratches",
          "Corrects moderate oxidation",
          "Solid prep before a ceramic coating",
        ],
        bestFor: ["Heavy swirl marks", "Light scratches", "Moderate oxidation", "Buffer trails from a previous shop"],
        excludes: ["Scratches through the clear coat", "Ceramic coating"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 549, suv: 625, truck: 775 } },
        durationMinutes: 360,
        depositPercent: 25,
        featured: true,
      },
      {
        slug: "multi-stage",
        name: "Stage 3 — Full Correction",
        tagline: "Every pass we have, for paint that's been neglected.",
        defectRemoval: "70–90%",
        features: [
          "Compound + polish + finishing pass",
          "Removes deep scratches & severe oxidation",
          "Show-quality finish",
          "The right prep before ceramic coating",
        ],
        bestFor: ["Deep scratches", "Severe oxidation", "Neglected or long-unwashed paint", "Maximum gloss restoration"],
        excludes: ["Scratches through to primer or metal", "Ceramic coating"],
        // The only tier Farhan quotes as a floor rather than a firm price:
        // a Stage 3 is scoped to whatever the paint actually needs.
        pricing: { type: "fixed", byVehicleSize: { sedan: 1349, suv: 1575, truck: 1695 } },
        priceIsFrom: true,
        durationMinutes: 480,
        depositPercent: 25,
      },
    ],
  },
  {
    slug: "ceramic-coating",
    needsCoveredSpace: true,
    name: "Ceramic Coating",
    shortName: "Ceramic Coating",
    summary: "Long-term paint protection with a durable hydrophobic finish.",
    description:
      "Professional-grade ceramic coating bonds to your paint for years of protection, deep gloss, and easier washing. Every coating starts with full decontamination and prep, and the 3- and 5-year packages include paint correction first. Dedicated wheel and glass coatings are available too.",
    tagline: "A years-long shield with a mirror finish.",
    heroImage: "/services/ceramic-coating-hero.jpg",
    cardImage: "/services/ceramic-coating-hero.jpg",
    beforeAfter: {
      before: "/services/ceramic-coating-before.jpg",
      after: "/services/ceramic-coating-after.jpg",
    },
    // The explainer belongs beside the "what it is" copy, which is the one
    // place on the page where a diagram beats a photograph.
    valuePropImage: "/services/ceramic-coating-diagram.jpg",
    // `ceramic-coating-application.jpg` used to lead this list. It is a
    // different file from the hero but the same shot — same car, same angle,
    // same hands — so the page opened on a photo and then showed it again a
    // screen later. The clips are the stronger proof anyway: beading is the
    // thing a coating actually does that you can see.
    processMedia: [
      { type: "video", src: "/video/wheel-ceramic-coating.mp4", caption: "Wheel ceramic coating in action" },
      { type: "video", src: "/video/ceramic-glass-beading.mp4", caption: "Water beading off coated glass" },
      { type: "video", src: "/video/ceramic-wheel-beading.mp4", caption: "Water beading off coated wheels" },
    ],
    valueProp:
      "A liquid polymer that chemically bonds to your paint, forming a hard, glossy, water-repelling layer that outlasts wax by years rather than weeks. We coat wheels and glass too — the wheels take the worst of the brake dust and heat, and coated glass makes rain bead and roll away instead of smearing.",
    // Real work, and specifically ceramic work: every one of these is from a
    // Diamond Detail Pro job, the tier that includes a ceramic coating.
    benefitImages: [
      { src: "/work/mercedes-amg-gt-2.webp", alt: "The rear quarter of a coated silver Mercedes-AMG GT, paint still crisp" },
      { src: "/work/bmw-x5-1.webp", alt: "A coated black BMW X5 reflecting its surroundings like a mirror" },
      { src: "/work/lamborghini-huracan-2.webp", alt: "A coated wheel and yellow brake caliper on a Lamborghini Huracán, clear of brake dust" },
    ],
    benefits: [
      { title: "Years of protection", description: "Bonds to the surface instead of sitting on top, so it doesn't wash or wear off in weeks." },
      { title: "Deep, wet-look gloss", description: "A coated finish reads noticeably glossier and deeper than wax or sealant alone." },
      { title: "Easier to keep clean", description: "The hydrophobic surface sheds water, dirt, and grime, so regular washes take less effort." },
    ],
    process: [
      { title: "Prep — and correction on multi-year packages", description: "Every coating starts with decontamination and prep; the 3- and 5-year packages add machine paint correction first." },
      { title: "Decontamination", description: "Paint, wheels, or glass are deep-cleaned to remove embedded grime before anything is applied." },
      { title: "Coating application", description: "The ceramic coating is applied by hand and leveled evenly across the surface." },
      { title: "Cure time", description: "Coatings cure for 24-48 hours before the vehicle should get wet." },
    ],
    // Sourced from the Diamond Detail Pro jobs on the Our Work page — that
    // tier is "full paint correction and professional-grade ceramic coating",
    // so every car here really was coated. Captions keep the job's own name
    // rather than relabelling it "Ceramic Coating", which would imply the
    // booking was coating alone.
    //
    // Those jobs run to eighteen photos between them, but twelve are interior
    // — seats, steering wheels, door cards. A coating goes on paint, wheels
    // and glass, so an interior shot proves nothing here however good the
    // photo is. Only the exterior frames are listed; the rest still carry
    // their jobs on Our Work, where the whole detail is the subject.
    galleryImages: [
      { src: "/work/bmw-x5-1.webp", caption: "The Diamond Detail Pro — BMW X5" },
      { src: "/work/lexus-rx-1.webp", caption: "The Diamond Detail Pro — Lexus RX" },
      { src: "/work/mercedes-amg-gt-1.webp", caption: "The Diamond Detail Pro — Mercedes-AMG GT" },
      { src: "/work/mercedes-amg-gt-2.webp", caption: "The Diamond Detail Pro — Mercedes-AMG GT" },
      { src: "/work/lamborghini-huracan-2.webp", caption: "The Diamond Detail Pro — Lamborghini Huracán" },
    ],
    packages: [
      {
        slug: "1-year-coating",
        name: "1-Year Ceramic Coating",
        tagline: "Entry-level long-term protection.",
        features: ["Paint decontamination & prep", "1-year ceramic coating", "Hydrophobic finish"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 450, suv: 525, truck: 575 } },
        durationMinutes: 300,
        depositPercent: 25,
      },
      {
        slug: "3-year-coating",
        name: "3-Year Ceramic Coating",
        tagline: "Our most popular coating package.",
        features: [
          "Single-stage paint correction included",
          "3-year ceramic coating",
          "Wheels & trim coated",
        ],
        pricing: { type: "fixed", byVehicleSize: { sedan: 750, suv: 875, truck: 950 } },
        durationMinutes: 480,
        depositPercent: 25,
        // Its own tagline already called it the most popular; this is what
        // actually marks it as such in the tier row.
        featured: true,
      },
      {
        slug: "5-year-coating",
        name: "5-Year Ceramic Coating",
        tagline: "Maximum durability.",
        features: [
          "Multi-stage paint correction included",
          "5-year ceramic coating",
          "Wheels, trim & glass coated",
          "Annual maintenance check-in",
        ],
        pricing: { type: "fixed", byVehicleSize: { sedan: 1200, suv: 1350, truck: 1450 } },
        durationMinutes: 600,
        depositPercent: 25,
      },
      {
        slug: "wheel-coating",
        name: "4-Wheel Ceramic Coating",
        tagline: "Set of 4 wheels & calipers — brake dust wipes off in seconds.",
        features: ["Deep wheel decontamination", "Ceramic coating on all 4 wheels", "Caliper coating included"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 150, suv: 175, truck: 200 } },
        durationMinutes: 120,
        group: "Wheel Coating",
      },
      {
        slug: "windshield-only",
        name: "Windshield Only",
        tagline: "Just the front glass — rain beads and rolls off instead of smearing.",
        features: ["Glass decontamination", "Ceramic coating on windshield"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 75, suv: 75, truck: 75 } },
        durationMinutes: 45,
        group: "Glass Coating",
      },
      {
        slug: "all-glass",
        name: "All Glass",
        tagline: "Windshield, windows & mirrors.",
        features: ["Glass decontamination", "Ceramic coating on all glass & mirrors"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 150, suv: 175, truck: 190 } },
        durationMinutes: 90,
        group: "Glass Coating",
      },
    ],
  },
  {
    slug: "paint-protection-film",
    needsCoveredSpace: true,
    name: "Paint Protection Film (PPF)",
    shortName: "PPF",
    summary: "Self-healing film that shields your paint from rock chips and scratches.",
    description:
      "Choose a coverage tier and see exactly which panels get protected — from Barrier's essential front-end coverage up to Full Protection, which wraps the entire vehicle in self-healing film.",
    tagline: "Invisible armor for the panels that take the hits.",
    // The blue BMW is the hero and the card both — the same shot, and one we
    // can stand behind, so it leads the page rather than sitting on a card
    // while stock art takes the top.
    heroImage: "/services/ppf-hero.jpg",
    cardImage: "/services/ppf-hero.jpg",
    // TODO(placeholder): STOCK PHOTO, not our work — Farhan's own PPF photos
    // are due the week of 2026-08-31. Swap the file and this line; nothing
    // else references it. Cropped square because the frame it sits in is.
    valuePropImage: "/services/ppf-what-it-is-stock.webp",
    // Real, and genuinely a customer's car: the chips are the point of the
    // shot, so it is cropped tight enough that they still read at phone size.
    benefitImages: [
      {
        src: "/services/ppf-rock-chips.webp",
        alt: "Dozens of small light-coloured stone chips scattered across the grey metallic paint of a car's hood, beside the headlight",
      },
      // TODO(placeholder): stock/supplier image, not our work — swap when
      // Farhan has his own correction shot. Low resolution at source
      // (640x480), so it is the softest image on the page; a real photo
      // would be a visible upgrade, not just an authenticity one.
      {
        src: "/services/ppf-self-healing-placeholder-stock.webp",
        alt: "A dark green car panel under a work light, the left half clouded with fine swirl marks and the right half polished clear",
      },
      // TODO(placeholder): stock image, not our work — swap when Farhan has a
      // real handover or appraisal shot.
      {
        src: "/services/ppf-resale-placeholder-stock.webp",
        alt: "A person in a business suit making notes on a tablet beside a white car",
      },
    ],
    valueProp:
      "Paint Protection Film is a clear, self-healing urethane film applied directly over your paint. It absorbs rock chips, road debris, and light scratches that would otherwise damage the clear coat — and minor scuffs in the film itself heal with heat, so it stays looking new.",
    benefits: [
      { title: "Stops rock chips cold", description: "Film absorbs impacts from gravel and road debris before they ever reach your paint." },
      { title: "Self-healing top coat", description: "Light swirls and scratches in the film disappear with warmth from the sun or a heat gun." },
      { title: "Protects resale value", description: "Factory paint stays untouched underneath, which matters at trade-in or resale." },
    ],
    process: [
      { title: "Choose your coverage", description: "Use the visualizer above to see exactly which panels each package protects." },
      { title: "Paint prep", description: "Panels are decontaminated and corrected if needed so the film bonds cleanly." },
      { title: "Precision installation", description: "Film is trimmed and applied panel by panel, with edges wrapped for a seamless look." },
      { title: "Final inspection", description: "Every edge and seam is checked before the vehicle is handed back." },
    ],
    visualizer: "ppf",
    // Small fixed-area pieces sold alongside a coverage tier. Anything a
    // package already wraps is marked includedIn so it can't be bought twice.
    // Every add-on photo marks the covered area in red on an otherwise plain
    // white panel, so the set reads as one diagram rather than six unrelated
    // car photos. Each is cropped 4:3 around its marked area with the
    // surrounding panel left in — without that context they're abstract shapes.
    addOns: [
      {
        slug: "door-edge-guards",
        name: "Door Edge PPF",
        description:
          "Wraps the door edges — the first place paint chips when a door taps a wall or another car. Priced per pair of doors.",
        price: 95,
        image: "/services/ppf-addon-door-edge-guards.webp",
      },
      {
        slug: "door-cups",
        name: "Door Handle Cups",
        description:
          "Covers the recess behind each handle, where fingernails and rings wear the clear coat. Covers all four handles.",
        price: 119,
        image: "/services/ppf-addon-door-cups.webp",
        includedIn: ["full-protection"],
      },
      {
        slug: "headlight-ppf",
        name: "Headlight Protection",
        description: "Clear film over the headlights to stop pitting, hazing, and stone chips.",
        price: 195,
        image: "/services/ppf-addon-headlight-ppf.webp",
      },
      {
        slug: "fog-light-ppf",
        name: "Fog Light Protection",
        description: "Same protection for the lower lights, which take the worst of the road spray.",
        price: 89,
        image: "/services/ppf-addon-fog-light-ppf.webp",
      },
      {
        // Separate from Door Edge PPF, and worth being clear why, because the
        // two get confused: the sill is the painted ledge you step over
        // getting in, the edge is the rim that meets the next car along when a
        // door swings open. Different panel, different damage, different film.
        // PRICE UNCONFIRMED — matched to Door Edge PPF, which is the closest
        // equivalent piece of work. Needs Farhan's own number.
        slug: "door-sill-guards",
        name: "Door Sill Guards",
        description:
          "Protects the painted sill you step over getting in and out, where shoes and bags wear the paint through.",
        price: 95,
        image: "/services/ppf-addon-door-sill-guards.webp",
      },
      {
        slug: "fuel-door-ppf",
        name: "Fuel Door",
        description: "A small piece around the fuel door, where nozzle scratches build up over time.",
        price: 49,
        image: "/services/ppf-addon-fuel-door-ppf.webp",
      },
    ],
    packages: [
      {
        slug: "barrier",
        name: "Barrier",
        tagline: "For basic coverage of the most exposed areas.",
        features: ["Partial hood", "Partial fenders"],
        pricing: { type: "starting-at", amount: 399 },
        depositPercent: 25,
      },
      {
        slug: "shield",
        name: "Shield",
        tagline: "Well-rounded coverage for everyday driving.",
        // Mirrors are deliberately not here — they start at Armor, and are
        // what separates the two tiers.
        features: ["Partial hood", "Partial fenders", "Full bumper"],
        pricing: { type: "starting-at", amount: 1199 },
        depositPercent: 25,
        featured: true,
      },
      {
        slug: "armor",
        name: "Armor",
        tagline: "Every high-impact panel, fully wrapped.",
        features: ["Full hood", "Full fenders", "Full bumper", "Back of side mirrors (2)"],
        pricing: { type: "starting-at", amount: 2199 },
        depositPercent: 25,
      },
      {
        slug: "track",
        name: "Track",
        tagline: "Near-total coverage for the panels that see the most road.",
        // Doors are not offered at this tier. Partial door coverage isn't
        // something we do, so it can't be listed — full doors are Full
        // Protection.
        features: ["Full hood, fenders & bumper", "Roof, A-pillars & mirrors", "Rocker panels"],
        pricing: { type: "starting-at", amount: 3499 },
        depositPercent: 25,
      },
      {
        slug: "full-protection",
        name: "Full Protection",
        tagline: "Ultimate coverage for the entire vehicle.",
        features: [
          "Full hood, front & rear bumpers",
          "Full fenders & rocker panels",
          "Side mirrors, doors & door cups",
          "A-pillars, roof, trunk & hatch",
        ],
        pricing: { type: "quote" },
        depositPercent: 25,
      },
    ],
  },
  {
    slug: "window-tinting",
    name: "Window Tinting",
    shortName: "Window Tint",
    summary: "Blocks heat and UV, adds privacy, and finishes the look.",
    description:
      "Ceramic and dyed window films that cut cabin heat, block UV, and add privacy — precision-cut and installed on every window, with shade and coverage options for any vehicle.",
    tagline: "Cooler cabin, less glare, better protected.",
    cardImage: "/services/window-tinting-hero.webp",
    valueProp:
      "Window tint film blocks UV rays and heat, adds privacy, and gives your vehicle a finished look. Preview each darkness level and coverage option before booking, with separate pricing for Tesla's glass and installation requirements.",
    stats: [
      { value: "99%+", label: "UV rays blocked, every film we install" },
      { value: "95%", label: "Infrared heat blocked with Diamond Ceramic RX1" },
    ],
    benefits: [
      { title: "Heat & UV rejection", description: "Tint film blocks the sun's heat and UV rays, keeping the cabin cooler and protecting interior surfaces." },
      { title: "More privacy", description: "Darker shades make it harder to see inside the vehicle when parked or driving." },
      { title: "A finished look", description: "Tint is one of the highest-impact, most affordable upgrades for a vehicle's appearance." },
    ],
    process: [
      { title: "Pick your film and shade", description: "We confirm the film type and darkness level that suit your vehicle and how you use it." },
      { title: "Glass cleaning", description: "Every window is thoroughly cleaned before film is applied." },
      { title: "Film application", description: "Film is precision-cut and applied to each window, then squeegeed to remove air and moisture." },
      { title: "Cure time", description: "Tint should not be rolled down for a few days while it fully cures." },
    ],
    faqs: [
      {
        q: "Myth: a cheap tint and a ceramic tint look the same, so why pay more?",
        a: "They can look identical and perform nothing alike. Shade is how dark the film looks; heat rejection is a separate property of the film itself. Our ceramic films block up to 95% of infrared heat, where a basic dyed film mostly just darkens the glass.",
      },
      {
        q: "Myth: tint is only about privacy and looks.",
        a: "Every film we install blocks over 99% of UV. That is what keeps a dashboard, leather, and trim from fading and cracking - the tint is protecting the interior as much as it is shading you.",
      },
      {
        q: "Myth: darker tint always means a cooler car.",
        a: "Not on its own. A very dark dyed film can reject less heat than a lighter ceramic one, because heat rejection comes from the film's construction rather than how dark it looks. Pick the shade you want, then pick the film for the heat.",
      },
    ],
    visualizer: "tint",
    hasTeslaVariant: true,
    packages: [
      {
        slug: "front-two",
        name: "Front Two Windows",
        tagline: "Driver & passenger front only.",
        features: ["Front two windows", "Any available shade"],
        // MUST equal the diamond-smoke row in tintPricing.ts — these are what
        // the cards quote, that table is what checkout charges.
        pricing: { type: "fixed", byVehicleSize: { sedan: 119, suv: 119, truck: 119 } },
        durationMinutes: 60,
      },
      {
        slug: "full-vehicle",
        name: "Full Vehicle",
        tagline: "All windows, one consistent shade.",
        features: ["All side & rear windows", "Any available shade", "UV & heat rejection"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 279, suv: 299, truck: 299 } },
        durationMinutes: 150,
        depositPercent: 25,
      },
    ],
    /* Windshield work used to be a third coverage package, which made it
     * mutually exclusive with the other two — its own tagline said "add-on
     * visor strip", yet someone wanting Full Vehicle AND the strip literally
     * could not book both. It is modelled as what it always was: an add-on
     * that rides along with either coverage (or none). */
    addOns: [
      {
        slug: "windshield-strip",
        name: "Windshield Strip",
        exclusiveGroup: "windshield",
        description:
          "A visor strip across the top of the windshield — cuts sun glare right at eye level. Any shade.",
        price: 50,
        // The source sheet prices the strip slightly higher on a Tesla.
        teslaFlatPrice: 59,
        image: null,
      },
      {
        // PRICE ADOPTED from Turbo Tint Aurora's published windshield tint
        // ($259), the same source Farhan named for the Tesla numbers —
        // confirm it is his. Light shades only is his own rule: anything
        // under 35% on a windshield is a visibility hazard, and the source
        // shop goes further and sells only 80% and 50%.
        slug: "full-windshield",
        name: "Full Windshield",
        exclusiveGroup: "windshield",
        description:
          "Ceramic film across the entire windshield for heat and UV — in light shades only (50% or 80%). Darker film on a windshield isn't safe to drive behind.",
        price: 259,
        // The Model X windshield is a different job — it's the largest piece
        // of glass on any production car, and the source sheet prices it
        // (and the Cybertruck's) separately.
        teslaPriceByModel: { "Model X": 429, Cybertruck: 429 },
        image: null,
      },
      {
        // Tesla glass roofs are one huge tinted-from-factory panel that
        // still passes serious heat; this is the film that fixes the
        // "greenhouse" complaint. Film-priced per the source sheet
        // (Rev/Turbo/Redline -> our three films), and Tesla-only until
        // Farhan wants to offer sunroof tint on other cars.
        slug: "pano-roof",
        name: "Panoramic Roof",
        teslaOnly: true,
        description:
          "Ceramic film across the glass roof — cuts the heat load Tesla's factory glass lets through.",
        price: 279,
        teslaPriceByFilm: {
          "diamond-smoke": 279,
          "diamond-ceramic-rx": 379,
          "diamond-ceramic-rx1": 479,
        },
        // Shot from above rather than close-up: the roof is the one add-on
        // whose extent you cannot judge from a detail crop — the point is
        // how much glass it actually is.
        image: "/services/tint-addon-pano-roof.webp",
      },
    ],
  },
  {
    slug: "scratch-removal",
    name: "Scratch Removal",
    shortName: "Scratch Removal",
    heroImage: "/services/scratch-removal-hero.webp",
    cardImage: "/services/scratch-removal-hero.webp",
    summary: "Spot repair for scratches and light paint damage.",
    description:
      "Targeted machine polishing or touch-up to reduce or remove scratches and scuffs. Severity is assessed on a quick photo or in-person before pricing.",
    tagline: "Targeted repair for the scratch that bugs you.",
    valueProp:
      "Not every scratch needs a full correction. For an isolated scratch, key mark, or scuff, we assess the depth and severity — most clear-coat-level scratches can be polished out, while deeper scratches may need touch-up paint — and price it per scratch or panel.",
    benefits: [
      { title: "Priced for what you need", description: "No paying for a full-vehicle correction to fix one scratch." },
      { title: "Fast turnaround", description: "Spot repairs are typically much quicker than a full correction." },
      { title: "Honest assessment", description: "We'll tell you upfront if a scratch is too deep to fully polish out." },
    ],
    process: [
      { title: "Send a photo or show us in person", description: "We assess depth and severity to give you an accurate price." },
      { title: "Spot polish or touch-up", description: "Clear-coat scratches are polished out; deeper ones get touch-up paint." },
      { title: "Blend & inspect", description: "The repair is blended into surrounding paint so it doesn't stand out." },
    ],
    isQuoteOnly: true,
    packages: [
      {
        slug: "spot-repair",
        name: "Spot Scratch Repair",
        tagline: "Priced after a quick assessment.",
        features: ["Photo or in-person assessment", "Machine polish or touch-up", "Priced per scratch/panel"],
        pricing: { type: "quote" },
      },
    ],
  },
  {
    slug: "leather-restoration",
    name: "Leather Restoration & Polishing",
    shortName: "Leather Restoration",
    summary: "Bring cracked, faded, or stained leather back to life.",
    description:
      "Deep cleaning, conditioning, and restoration for leather seats and trim — from routine conditioning to repairing cracks and fading.",
    tagline: "Bring tired leather back to life.",
    heroVideo: "/video/leather-restoration.mp4",
    cardImage: "/work/ferrari-488-1.webp",
    valueProp:
      "Leather seats dry out, crack, and fade over years of sun exposure and use. Routine cleaning and conditioning keeps healthy leather supple and protected, while full restoration repairs cracking, fading, and staining on leather that's already showing its age.",
    benefits: [
      { title: "Prevents cracking", description: "UV-protective conditioner keeps leather from drying out and cracking in the sun." },
      { title: "Restores faded color", description: "Full restoration can recolor and repair leather that's faded or worn through." },
      { title: "Feels like new", description: "Deep cleaning lifts embedded dirt and oils that make leather feel stiff or grimy." },
    ],
    process: [
      { title: "Assess condition", description: "We check for cracking, fading, and staining to recommend clean & condition vs. full restoration." },
      { title: "Deep clean", description: "Leather is cleaned to lift embedded dirt without stripping natural oils." },
      { title: "Condition or repair", description: "UV-protective conditioner is applied, or cracks/fading are repaired and color-matched." },
    ],
    packages: [
      {
        slug: "leather-clean-condition",
        name: "Clean & Condition",
        tagline: "Routine leather care.",
        features: ["Deep leather cleaning", "UV-protective conditioning"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 90, suv: 110, truck: 110 } },
        durationMinutes: 90,
      },
      {
        slug: "leather-restoration",
        name: "Full Restoration",
        tagline: "For cracked, faded, or stained leather.",
        features: ["Deep cleaning & conditioning", "Crack & fade repair", "Color matching where needed"],
        pricing: { type: "quote" },
      },
    ],
  },
  {
    slug: "maintenance-plans",
    name: "Maintenance Plans",
    shortName: "Maintenance Plans",
    // Same footage as Mobile Detailing on purpose — a plan is that same visit
    // on a schedule, and it beats an empty hero until dedicated footage exists.
    heroVideo: "/video/mobile-detailing.mp4",
    // Two of Farhan's own photos spliced on a diagonal — the Cayenne mid-wash
    // and a finished cargo area. A plan covers both sides of the car, and no
    // single frame we have says that; the cut lets one card carry both.
    cardImage: "/services/maintenance-plans-card.webp",
    summary: "Recurring detailing on a schedule, at a member price.",
    description:
      "Keep your vehicle consistently clean with a recurring plan — scheduled visits, priority booking, and lower per-visit pricing than one-off bookings.",
    tagline: "Consistently clean, without thinking about it.",
    valueProp:
      "Maintenance plans put your detailing on autopilot. We schedule recurring visits on your driveway, so your vehicle stays consistently clean at a lower per-visit price than booking one-off appointments, with priority scheduling and discounts on any add-ons.",
    // Wording checked against what the site actually does. Checkout runs in
    // Stripe's one-time payment mode, not subscription — there is no standing
    // order and nothing bills itself. Claiming visits "are scheduled
    // automatically" promised a mechanism that does not exist.
    benefits: [
      { title: "A lower rate per visit", description: "The member rate is below what the same visit costs as a one-off booking." },
      { title: "First pick of the calendar", description: "Members get first access to weekend slots before they open up generally." },
      { title: "A rhythm, not a decision", description: "You settle on a cadence once, then keep the same rate every time you book." },
    ],
    process: [
      { title: "Pick your cadence", description: "Monthly or every two weeks, depending on how hard the car works." },
      { title: "Book your first visit", description: "Choose a weekend slot and pay the member rate for that visit." },
      { title: "We come to you, and repeat", description: "Same wash and vacuum each time — we'll set the next one up while we're there." },
    ],
    packages: [
      {
        slug: "monthly-maintenance",
        name: "Monthly Plan",
        tagline: "One visit per month.",
        features: ["Basic wash & vacuum monthly", "Priority scheduling", "10% off add-on services"],
        excludes: ["Deep interior cleaning", "Paint correction"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 40, suv: 48, truck: 55 } },
        durationMinutes: 45,
      },
      {
        slug: "biweekly-maintenance",
        name: "Bi-Weekly Plan",
        tagline: "Every two weeks.",
        features: ["Basic wash & vacuum every 2 weeks", "Priority scheduling", "15% off add-on services"],
        excludes: ["Deep interior cleaning", "Paint correction"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 35, suv: 42, truck: 48 } },
        durationMinutes: 45,
      },
    ],
  },
  {
    slug: "fleet-detailing",
    name: "Fleet Detailing",
    shortName: "Fleet",
    summary: "Multi-vehicle and recurring detailing, at volume pricing.",
    description:
      "Volume pricing and recurring scheduling for companies with multiple vehicles — rideshare, rental, delivery, and corporate fleets.",
    tagline: "Volume detailing for businesses - and households - with more than one vehicle.",
    heroImage: "/services/fleet-hero.jpg",
    cardImage: "/services/fleet-hero.jpg",
    valuePropImage: "/services/fleet-vans.webp",
    valuePropImageIsPhoto: true,
    benefitImages: [
      { src: "/services/fleet-lot.webp", alt: "Rows of identical white cars filling a holding lot" },
      { src: "/services/fleet-vans.webp", alt: "A line of white delivery vans parked nose-out" },
      null,
    ],
    valueProp:
      "Rideshare, rental, delivery, and corporate fleets all depend on vehicles that look and feel clean. We build a recurring detailing schedule around your fleet size and usage, with volume-based pricing and a single invoice instead of per-vehicle billing.",
    benefits: [
      { title: "Volume-based pricing", description: "The more vehicles on the plan, the lower the per-vehicle cost." },
      { title: "One invoice", description: "A single recurring invoice covers the whole fleet, not separate bills per vehicle." },
      { title: "On-site or drop-off", description: "We work around your operation — at your lot or ours." },
    ],
    process: [
      { title: "Tell us about your fleet", description: "Vehicle count, types, and how often you need service." },
      { title: "We build a custom plan", description: "Volume pricing and a recurring schedule tailored to your fleet." },
      { title: "Recurring service", description: "We show up on schedule and bill on a single recurring invoice." },
    ],
    relatedSlugs: ["specialty-vehicles"],
    isQuoteOnly: true,
    packages: [
      {
        slug: "fleet-quote",
        name: "Fleet Program",
        tagline: "Custom pricing based on fleet size.",
        features: ["Volume-based pricing", "Recurring scheduled visits", "On-site or drop-off service", "Single invoice billing"],
        pricing: { type: "quote" },
      },
    ],
  },
  {
    slug: "specialty-vehicles",
    name: "RV, Boat & Aircraft Detailing",
    shortName: "RV / Boat / Aircraft",
    summary: "Large & specialty vehicle detailing, quoted per job.",
    description:
      "Detailing for RVs, boats, and aircraft interiors/exteriors. Every job is quoted individually based on size, condition, and material — request a quote to get started.",
    tagline: "Specialty detailing for whatever you drive, sail, or fly.",
    heroImage: "/services/specialty-vehicles-hero.png",
    cardImage: "/services/specialty-vehicles-hero.png",
    heroImageMobile: "/services/specialty-vehicles-hero-mobile.jpg",
    valueProp:
      "RVs, boats, and aircraft each need their own approach — different materials, different surfaces, different exposure to the elements. We quote every job individually based on size, condition, and material so the price actually reflects the work involved.",
    benefits: [
      { title: "Material-specific care", description: "Gelcoat, aviation-safe products, and RV exteriors each get the right approach." },
      { title: "Fair, individual quotes", description: "Pricing is based on the actual vehicle, not a generic flat rate." },
      { title: "One team for all of it", description: "No need to find separate specialists for your RV, boat, and vehicles." },
    ],
    process: [
      { title: "Request a quote", description: "Tell us the type, size, and condition of what needs detailing." },
      { title: "We assess on site", description: "For larger or more complex jobs, we take a look before finalizing price." },
      { title: "Detail day", description: "Exterior wash/polish and interior detailing using material-appropriate products." },
    ],
    isQuoteOnly: true,
    packages: [
      {
        slug: "rv-detailing",
        name: "RV Detailing",
        tagline: "Exterior wash, wax & interior detail.",
        features: ["Exterior wash & wax", "Roof & awning cleaning", "Full interior detail"],
        pricing: { type: "quote" },
      },
      {
        slug: "boat-detailing",
        name: "Boat Detailing",
        tagline: "Hull, deck & interior detailing.",
        features: ["Hull wash & oxidation removal", "Deck & upholstery cleaning", "Metal polishing"],
        pricing: { type: "quote" },
      },
      {
        slug: "aircraft-detailing",
        name: "Aircraft Detailing",
        tagline: "Exterior & cabin detailing.",
        features: ["Exterior wash & polish", "Cabin interior detail", "Trained for aviation-safe products"],
        pricing: { type: "quote" },
      },
    ],
  },
];

export function getCategory(slug: string): ServiceCategory | undefined {
  return catalog.find((c) => c.slug === slug);
}

/** Summary price label for places that show one figure for a package.
 * Fixed pricing varies by vehicle size and these call sites default to the
 * sedan (cheapest) figure, so it's rendered as "From $X" — a bare "$175"
 * next to no size label reads as *the* price and feels like bait once an
 * SUV owner reaches checkout. Callers that show the full per-size grid use
 * priceForSize instead. */
/** Whole-dollar price with thousands separators. Stage 3 correction is the
 * first four-figure price on the site, and "$1349" reads as a typo. */
export function formatPrice(dollars: number): string {
  return `$${dollars.toLocaleString("en-US")}`;
}

export function priceLabel(pkg: Package, size: VehicleSize = "sedan"): string {
  if (pkg.pricing.type === "fixed") return `From ${formatPrice(pkg.pricing.byVehicleSize[size])}`;
  if (pkg.pricing.type === "starting-at") return `From ${formatPrice(pkg.pricing.amount)}`;
  return "Get a Quote";
}

export function priceForSize(pkg: Package, size: VehicleSize): number | null {
  if (pkg.pricing.type === "fixed") return pkg.pricing.byVehicleSize[size];
  if (pkg.pricing.type === "starting-at") return pkg.pricing.amount;
  return null;
}

/** What a line actually costs, accounting for Teslas being priced on a
 * different axis from everything else.
 *
 * This exists so there is exactly one answer to "what does this cost". The
 * booking form shows a price and the API independently recomputes it before
 * charging — if those two ever used different logic, the number someone agreed
 * to and the number they were charged could differ, which is the worst class
 * of bug this codebase can have. Both call this. */
export function resolveLinePrice(
  pkg: Package,
  size: VehicleSize,
  opts: { isTesla?: boolean; filmSlug?: string; teslaCoverageSlug?: string } = {}
): number | null {
  if (opts.isTesla && opts.teslaCoverageSlug && opts.filmSlug) {
    // A Tesla coverage/film pair we don't price returns null rather than
    // quietly falling back to the size-based figure, which would undercharge.
    return teslaTintPrice(opts.teslaCoverageSlug, opts.filmSlug);
  }
  // Non-Tesla tint prices by film as well as size. Before this branch the
  // film choice never touched the number, so the flagship ceramic charged
  // the dyed-film rate. A film with no table row falls back to the base
  // price — charged as base, never as free.
  if (opts.filmSlug) {
    const byFilm = tintPrice(pkg.slug, opts.filmSlug, size);
    if (byFilm !== null) return byFilm;
  }
  return priceForSize(pkg, size);
}

/** 3 short, honest FAQ entries derived from data already on the category —
 * booking process, how long it takes, and whether it's mobile — so every
 * page gets a useful FAQ without hand-writing (and risking fabricating)
 * answers for each one. Pass `faqs` on the category to override any/all
 * of these when the generic answer doesn't fit. */
export function getFaqs(category: ServiceCategory): { q: string; a: string }[] {
  return [...baseFaqs(category), ...policyFaqs(category)];
}

/** The questions that apply to every booking regardless of service — weather,
 * and whether the online price is the final one. Appended to every category,
 * including ones that override the generated set, because a category with
 * hand-written FAQs still takes deposits in Colorado weather. */
function policyFaqs(category: ServiceCategory): { q: string; a: string }[] {
  const extra: { q: string; a: string }[] = [];
  if (category.needsCoveredSpace) extra.push(policies.coveredSpace);
  extra.push(policies.weather, policies.onArrivalPricing);
  return extra;
}

function baseFaqs(category: ServiceCategory): { q: string; a: string }[] {
  if (category.faqs) return category.faqs;

  const durations = category.packages.map((p) => p.durationMinutes).filter((d): d is number => Boolean(d));
  const durationAnswer =
    durations.length > 0
      ? (() => {
          const min = Math.min(...durations);
          const max = Math.max(...durations);
          const fmt = (m: number) => (m < 60 ? `${m} min` : `${(m / 60).toFixed(m % 60 === 0 ? 0 : 1)} hr`);
          return min === max
            ? `Most ${category.shortName.toLowerCase()} appointments run about ${fmt(min)}, depending on your vehicle.`
            : `Most ${category.shortName.toLowerCase()} appointments run ${fmt(min)}–${fmt(max)}, depending on the package and vehicle size.`;
        })()
      : `Timing depends on the scope of the job — we'll confirm during your quote.`;

  const mobile = category.isMobileService ?? true;

  return [
    {
      q: `How do I book ${category.shortName}?`,
      a: category.isQuoteOnly
        ? `Request a quote with your vehicle details — we'll follow up to confirm price and schedule your appointment.`
        : `Pick a package above, choose an available date and time, and pay online — no call needed.`,
    },
    { q: "How long does it take?", a: durationAnswer },
    {
      q: mobile ? "Do you come to me?" : "Where does the work happen?",
      a: mobile
        ? "Yes — this is mobile service. We come to your home or office anywhere in the Denver Metro Area."
        : "This service is completed at our facility — we'll confirm details when you book.",
    },
  ];
}
