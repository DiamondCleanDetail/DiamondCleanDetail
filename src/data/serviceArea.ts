export const serviceArea = {
  region: "Denver Metro Area",
  /** Short form for the utility bar, where the full region name is too long
   * to sit beside the social icons on a phone. */
  city: "Denver, CO",
  phone: "+1 (720) 703-2795",
  phoneHref: "+17207032795",
  email: "info@diamondcleandetail.com",
  /** Two different things, listed separately because conflating them is what
   * made the old single line wrong: the phone is answered on weekdays, but
   * the work happens at weekends. Publishing "Mon–Fri 7:30–6:00" as opening
   * hours promised weekday appointments that the booking form has never
   * offered. Appointment days come from BOOKABLE_DAYS in scheduling.ts. */
  hours: [
    { days: "Phone & enquiries", time: "Monday–Friday, 8:00 AM – 7:00 PM" },
    { days: "Appointments", time: "Saturday & Sunday" },
  ],
  cities: [
    "Castle Rock",
    "Elizabeth",
    "Cherry Creek",
    "Cherry Hills Village",
    "Dove Valley",
    "Larkspur",
    "Englewood",
    "Thornton",
    "Broomfield",
    "Sedalia",
    "Lone Tree",
    "Centennial",
    "Castle Pines",
    "Greenwood Village",
    "Denver Tech Center",
    "Highlands Ranch",
    "Cottonwood",
    "Franktown",
    "Foxfield",
    "Arvada",
    "Lakewood",
    "Westminster",
    "Wheat Ridge",
    "Boulder",
    "Parker",
    "Denver",
    "Aurora",
    "Littleton",
    "Golden",
    "Louisville",
  ],
};
