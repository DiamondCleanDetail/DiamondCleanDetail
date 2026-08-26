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
  /** Shows a "Most Popular" badge and highlighted border on the package card. */
  featured?: boolean;
};

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
  /** "What is this service" explainer paragraph. */
  valueProp: string;
  benefits: Benefit[];
  process: ProcessStep[];
  /** Slugs of other categories to surface as "Related Services" on this page. */
  relatedSlugs?: string[];
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
    tagline: "Showroom results, without the drive to a shop.",
    heroVideo: "/video/mobile-detailing.mp4",
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
    packages: [
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
    valueProp:
      "Every vehicle picks up fine swirl marks and light scratches from years of washing. Paint correction uses machine polishers and cutting/finishing compounds to level out that top layer of clear coat, bringing back true clarity and gloss before any wax, sealant, or ceramic coating goes on.",
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
    tagline: "A years-long shield with a mirror finish.",
    valueProp:
      "Ceramic coating is a liquid polymer that chemically bonds to your paint, forming a hard, glossy, hydrophobic layer that outlasts any wax by years, not weeks. It also protects wheels and glass — see the related services below for wheel- and glass-specific coatings.",
    benefits: [
      { title: "Years of protection", description: "Bonds to the clear coat instead of sitting on top, so it doesn't wash or wear off in weeks." },
      { title: "Deep, wet-look gloss", description: "A coated finish reads noticeably glossier and deeper than wax or sealant alone." },
      { title: "Easier to keep clean", description: "The hydrophobic surface sheds water, dirt, and grime, so regular washes take less effort." },
    ],
    process: [
      { title: "Paint correction & prep", description: "Included on every package — coatings look and bond best over corrected paint." },
      { title: "Panel wipe-down", description: "An isopropyl wipe removes any oils before coating so nothing is trapped underneath." },
      { title: "Coating application", description: "The ceramic coating is applied panel by panel and leveled by hand." },
      { title: "Cure time", description: "The coating cures for 24-48 hours before the vehicle should get wet." },
    ],
    relatedSlugs: ["wheel-ceramic-coating", "glass-ceramic-coating"],
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
    tagline: "Invisible armor for the panels that take the hits.",
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
    tagline: "See your shade before you commit.",
    valueProp:
      "Window tint film blocks UV rays and heat, adds privacy, and gives your vehicle a finished look. Preview each darkness level and coverage option before booking, with separate pricing for Tesla's glass and installation requirements.",
    benefits: [
      { title: "Heat & UV rejection", description: "Tint film blocks the sun's heat and UV rays, keeping the cabin cooler and protecting interior surfaces." },
      { title: "More privacy", description: "Darker shades make it harder to see inside the vehicle when parked or driving." },
      { title: "A finished look", description: "Tint is one of the highest-impact, most affordable upgrades for a vehicle's appearance." },
    ],
    process: [
      { title: "Preview your shade", description: "Use the tint level and coverage tools above to see your options before booking." },
      { title: "Glass cleaning", description: "Every window is thoroughly cleaned before film is applied." },
      { title: "Film application", description: "Film is precision-cut and applied to each window, then squeegeed to remove air and moisture." },
      { title: "Cure time", description: "Tint should not be rolled down for a few days while it fully cures." },
    ],
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
    tagline: "Brake dust that wipes off in seconds.",
    valueProp:
      "Wheels take more abuse than any other part of the vehicle — baked-on brake dust, road grime, and constant heat cycles. A dedicated wheel ceramic coating makes that grime sit on top of the surface instead of bonding to it, so a quick rinse is all it takes to keep them looking freshly detailed.",
    benefits: [
      { title: "Brake dust wipes off", description: "Coated wheels release baked-on dust with a rinse instead of a scrub brush." },
      { title: "Heat resistant", description: "Formulated to hold up to the heat cycles wheels and calipers go through." },
      { title: "Keeps that just-detailed look", description: "Wheels stay glossy for months between full details." },
    ],
    process: [
      { title: "Wheel decontamination", description: "Wheels are deep-cleaned to remove embedded brake dust before coating." },
      { title: "Caliper prep", description: "Calipers are cleaned and dressed to match." },
      { title: "Coating application", description: "Ceramic coating is applied and cured on all 4 wheels and calipers." },
    ],
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
    tagline: "Rain that rolls off instead of smearing.",
    valueProp:
      "A hydrophobic ceramic coating on your glass makes water bead up and roll away at speed instead of smearing across the windshield. It also makes ice and frost easier to scrape off in winter, and helps keep glass cleaner between washes.",
    benefits: [
      { title: "Better visibility in rain", description: "Water beads and rolls off the windshield instead of smearing under the wipers." },
      { title: "Easier winter mornings", description: "Ice and frost release more easily from coated glass." },
      { title: "Stays cleaner longer", description: "Road grime and bugs have a harder time bonding to coated glass." },
    ],
    process: [
      { title: "Glass decontamination", description: "Glass is polished and decontaminated to remove old wiper residue and grime." },
      { title: "Coating application", description: "Ceramic coating is applied and buffed to a clear, streak-free finish." },
    ],
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
    summary: "Recurring detailing on a schedule, at a member price.",
    description:
      "Keep your vehicle consistently clean with a recurring plan — scheduled visits, priority booking, and lower per-visit pricing than one-off bookings.",
    tagline: "Consistently clean, without thinking about it.",
    valueProp:
      "Maintenance plans put your detailing on autopilot. We schedule recurring visits on your driveway, so your vehicle stays consistently clean at a lower per-visit price than booking one-off appointments, with priority scheduling and discounts on any add-ons.",
    benefits: [
      { title: "Lower per-visit price", description: "Recurring plans cost less per visit than booking one-off appointments." },
      { title: "Priority scheduling", description: "Plan members get first access to available time slots." },
      { title: "One less thing to remember", description: "Visits are scheduled automatically on your plan's cadence." },
    ],
    process: [
      { title: "Pick your cadence", description: "Choose monthly or bi-weekly based on how your vehicle gets used." },
      { title: "We schedule the visits", description: "Recurring appointments are set up automatically on your plan." },
      { title: "We show up & detail", description: "Same reliable wash and vacuum, every time, at your discounted rate." },
    ],
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
    tagline: "Volume detailing for businesses that run on their vehicles.",
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
