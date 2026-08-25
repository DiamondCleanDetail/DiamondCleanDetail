export type VehicleSize = "sedan" | "suv" | "truck";

export const vehicleSizeLabels: Record<VehicleSize, string> = {
  sedan: "Sedan / Coupe",
  suv: "SUV / Minivan",
  truck: "Truck / Full-size SUV",
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
};

export type ServiceCategory = {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  description: string;
  heroNote?: string;
  packages: Package[];
  visualizer?: "tint" | "ppf";
  hasTeslaVariant?: boolean;
  isQuoteOnly?: boolean;
};

export const catalog: ServiceCategory[] = [
  {
    slug: "mobile-detailing",
    name: "Mobile Detailing",
    shortName: "Mobile Detailing",
    summary: "Full interior & exterior detailing, wherever your car is parked.",
    description:
      "Our core detailing packages, brought to your driveway or office. Hand wash, deep interior cleaning, and finishing touches that leave your vehicle looking showroom-fresh.",
    packages: [
      {
        slug: "basic-wash",
        name: "Basic Wash & Vacuum",
        tagline: "A quick refresh for regular upkeep.",
        features: [
          "Exterior hand wash & dry",
          "Wheel & tire cleaning",
          "Interior vacuum",
          "Window cleaning, in & out",
        ],
        pricing: { type: "fixed", byVehicleSize: { sedan: 45, suv: 55, truck: 65 } },
        durationMinutes: 45,
      },
      {
        slug: "interior-detail",
        name: "Interior Detail",
        tagline: "Deep clean for the cabin.",
        features: [
          "Full interior shampoo",
          "Dashboard & console detailing",
          "Leather/vinyl conditioning",
          "Odor treatment",
        ],
        pricing: { type: "fixed", byVehicleSize: { sedan: 90, suv: 110, truck: 125 } },
        durationMinutes: 90,
      },
      {
        slug: "full-detail",
        name: "Full Interior & Exterior Detail",
        tagline: "Our most popular full-service package.",
        features: [
          "Everything in Interior Detail",
          "Clay bar decontamination",
          "Hand wax & paint sealant",
          "Tire shine & trim dressing",
        ],
        pricing: { type: "fixed", byVehicleSize: { sedan: 175, suv: 210, truck: 240 } },
        durationMinutes: 180,
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
    packages: [
      {
        slug: "single-stage",
        name: "Single-Stage Polish",
        tagline: "Removes light swirls, adds gloss.",
        features: ["One-step machine polish", "Removes light swirl marks", "Enhanced gloss & clarity"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 250, suv: 300, truck: 325 } },
        durationMinutes: 240,
        depositPercent: 25,
      },
      {
        slug: "multi-stage",
        name: "Multi-Stage Correction",
        tagline: "Maximum defect removal.",
        features: [
          "Compound + polish + finishing pass",
          "Removes moderate scratches & oxidation",
          "Show-quality finish",
          "Recommended before ceramic coating",
        ],
        pricing: { type: "fixed", byVehicleSize: { sedan: 450, suv: 525, truck: 575 } },
        durationMinutes: 480,
        depositPercent: 25,
      },
    ],
  },
  {
    slug: "ceramic-coating",
    name: "Ceramic Coating",
    shortName: "Ceramic Coating",
    summary: "Long-term paint protection with a durable hydrophobic finish.",
    description:
      "Professional-grade ceramic coating bonds to your paint for years of protection, deep gloss, and easier washing. Paint correction is included on prep before every coating.",
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
    ],
  },
  {
    slug: "paint-protection-film",
    name: "Paint Protection Film (PPF)",
    shortName: "PPF",
    summary: "Self-healing film that shields your paint from rock chips and scratches.",
    description:
      "Choose your coverage and see exactly which panels get protected. Partial-front covers the most impact-prone areas; full-body wraps the entire vehicle in self-healing film.",
    visualizer: "ppf",
    packages: [
      {
        slug: "partial-front",
        name: "Partial Front",
        tagline: "Bumper, partial hood & mirrors.",
        features: ["Full front bumper", "Partial hood & fenders", "Side mirror caps"],
        pricing: { type: "starting-at", amount: 900 },
        depositPercent: 25,
      },
      {
        slug: "full-front",
        name: "Full Front",
        tagline: "Complete front-end coverage.",
        features: ["Full hood, fenders & bumper", "Side mirror caps", "Headlights"],
        pricing: { type: "starting-at", amount: 1600 },
        depositPercent: 25,
      },
      {
        slug: "full-body",
        name: "Full Body",
        tagline: "Total coverage, total protection.",
        features: ["Every exterior panel wrapped", "Self-healing top coat", "Maximum resale protection"],
        pricing: { type: "quote" },
        depositPercent: 25,
      },
    ],
  },
  {
    slug: "window-tinting",
    name: "Window Tinting",
    shortName: "Window Tint",
    summary: "See how each shade looks before you book.",
    description:
      "Preview different tint shades on your vehicle before committing, then choose the darkness level that fits your style and your state's legal limits.",
    visualizer: "tint",
    hasTeslaVariant: true,
    packages: [
      {
        slug: "front-two",
        name: "Front Two Windows",
        tagline: "Driver & passenger front only.",
        features: ["Front two windows", "Any available shade"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 90, suv: 100, truck: 100 } },
        durationMinutes: 60,
      },
      {
        slug: "full-vehicle",
        name: "Full Vehicle",
        tagline: "All windows, one consistent shade.",
        features: ["All side & rear windows", "Any available shade", "UV & heat rejection"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 250, suv: 300, truck: 325 } },
        durationMinutes: 150,
        depositPercent: 25,
      },
      {
        slug: "windshield-strip",
        name: "Windshield Strip",
        tagline: "Add-on visor strip.",
        features: ["Top-of-windshield strip", "Reduces sun glare"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 50, suv: 50, truck: 50 } },
        durationMinutes: 30,
      },
    ],
  },
  {
    slug: "wheel-ceramic-coating",
    name: "Wheel Ceramic Coating",
    shortName: "Wheel Coating",
    summary: "Keep brake dust and grime from baking onto your wheels.",
    description:
      "A dedicated ceramic coating for wheels and calipers, making brake dust wipe off in seconds and keeping wheels looking freshly detailed for months.",
    packages: [
      {
        slug: "wheel-coating",
        name: "4-Wheel Ceramic Coating",
        tagline: "Set of 4 wheels & calipers.",
        features: ["Deep wheel decontamination", "Ceramic coating on all 4 wheels", "Caliper coating included"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 150, suv: 175, truck: 200 } },
        durationMinutes: 120,
      },
    ],
  },
  {
    slug: "glass-ceramic-coating",
    name: "Glass Ceramic Coating",
    shortName: "Glass Coating",
    summary: "Rain-repelling glass coating for better visibility.",
    description:
      "A hydrophobic ceramic coating applied to your windshield and windows so rain beads and rolls off, improving visibility and easing winter ice removal.",
    packages: [
      {
        slug: "windshield-only",
        name: "Windshield Only",
        tagline: "Just the front glass.",
        features: ["Glass decontamination", "Ceramic coating on windshield"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 75, suv: 75, truck: 75 } },
        durationMinutes: 45,
      },
      {
        slug: "all-glass",
        name: "All Glass",
        tagline: "Windshield, windows & mirrors.",
        features: ["Glass decontamination", "Ceramic coating on all glass & mirrors"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 150, suv: 175, truck: 190 } },
        durationMinutes: 90,
      },
    ],
  },
  {
    slug: "scratch-removal",
    name: "Scratch Removal",
    shortName: "Scratch Removal",
    summary: "Spot repair for scratches and light paint damage.",
    description:
      "Targeted machine polishing or touch-up to reduce or remove scratches and scuffs. Severity is assessed on a quick photo or in-person before pricing.",
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
    summary: "Recurring detailing on a schedule, at a member price.",
    description:
      "Keep your vehicle consistently clean with a recurring plan — scheduled visits, priority booking, and lower per-visit pricing than one-off bookings.",
    packages: [
      {
        slug: "monthly-maintenance",
        name: "Monthly Plan",
        tagline: "One visit per month.",
        features: ["Basic wash & vacuum monthly", "Priority scheduling", "10% off add-on services"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 40, suv: 48, truck: 55 } },
        durationMinutes: 45,
      },
      {
        slug: "biweekly-maintenance",
        name: "Bi-Weekly Plan",
        tagline: "Every two weeks.",
        features: ["Basic wash & vacuum every 2 weeks", "Priority scheduling", "15% off add-on services"],
        pricing: { type: "fixed", byVehicleSize: { sedan: 35, suv: 42, truck: 48 } },
        durationMinutes: 45,
      },
    ],
  },
  {
    slug: "fleet-detailing",
    name: "Fleet Detailing",
    shortName: "Fleet",
    summary: "Recurring detailing for business & rental fleets.",
    description:
      "Volume pricing and recurring scheduling for companies with multiple vehicles — rideshare, rental, delivery, and corporate fleets.",
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

export function priceLabel(pkg: Package, size: VehicleSize = "sedan"): string {
  if (pkg.pricing.type === "fixed") return `$${pkg.pricing.byVehicleSize[size]}`;
  if (pkg.pricing.type === "starting-at") return `From $${pkg.pricing.amount}`;
  return "Get a Quote";
}

export function priceForSize(pkg: Package, size: VehicleSize): number | null {
  if (pkg.pricing.type === "fixed") return pkg.pricing.byVehicleSize[size];
  if (pkg.pricing.type === "starting-at") return pkg.pricing.amount;
  return null;
}
