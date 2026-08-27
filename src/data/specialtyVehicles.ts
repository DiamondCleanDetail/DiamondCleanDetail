export type VehicleTypeBreakdown = {
  slug: string;
  eyebrow: string;
  name: string;
  tagline: string;
  /** Transparent side-view PNG/WebP under /public/services. */
  image: string;
  /** Rough on-site time range, communicating the scope of the work involved. */
  timeOnSite: string;
  services: string[];
  /** Matches a packages[].slug on the specialty-vehicles category, for the booking link. */
  packageSlug: string;
};

export const specialtyVehicleBreakdown: VehicleTypeBreakdown[] = [
  {
    slug: "rv",
    eyebrow: "RV & Motorhome Detailing",
    name: "RVs & Motorhomes",
    tagline: "Every panel, seal, and surface — inside and out.",
    image: "/services/vehicle-rv.webp",
    timeOnSite: "Typically 4–8 hours on site, depending on size and condition",
    packageSlug: "rv-detailing",
    services: [
      "Full exterior hand wash & bug/tar removal",
      "Oxidation removal & paint decontamination",
      "Roof inspection, cleaning & UV-protectant sealant",
      "Awning, slide-out seal & window track cleaning",
      "Chrome, trim, ladder & wheel detailing",
      "Undercarriage & wheel well rinse",
      "Full interior deep clean — cabin, galley & sleeping areas",
      "Upholstery, carpet & floor shampoo",
      "Odor elimination & sanitizing wipe-down",
      "Optional ceramic coating for long-term UV & road-film protection",
    ],
  },
  {
    slug: "boat",
    eyebrow: "Boat Detailing",
    name: "Boats",
    tagline: "Hull to helm, brought back to showroom condition.",
    image: "/services/vehicle-boat.webp",
    timeOnSite: "Typically 3–6 hours on site, depending on size and hull condition",
    packageSlug: "boat-detailing",
    services: [
      "Hull wash, oxidation & waterline stain removal",
      "Gelcoat compounding, polish & wax or ceramic sealant",
      "Metal hardware polishing — rails, cleats, props & trim",
      "Non-skid deck, canvas & upholstery cleaning",
      "Bilge cleaning & odor treatment",
      "Engine bay wipe-down & compartment detailing",
      "Interior detailing — helm, seating & storage compartments",
      "Trailer wash & wheel detailing, if applicable",
    ],
  },
  {
    slug: "aircraft",
    eyebrow: "Aircraft Detailing",
    name: "Aircraft",
    tagline: "Meticulous, material-safe care from nose to tail.",
    image: "/services/vehicle-aircraft.webp",
    timeOnSite: "Typically 3–5 hours on site, depending on aircraft size",
    packageSlug: "aircraft-detailing",
    services: [
      "Exterior wash using aviation-safe, non-corrosive products",
      "Belly & leading-edge degreasing — bug & oil residue removal",
      "Paint polish & protective sealant application",
      "Window & windshield polishing with scratch-safe technique",
      "Wheel well & landing gear detailing",
      "Full cabin interior detail — seats, carpet & side panels",
      "Cockpit & instrument panel dust-free wipe-down",
      "Trained on aviation-safe chemical handling & application",
    ],
  },
];
