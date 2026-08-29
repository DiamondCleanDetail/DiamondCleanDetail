import type { Metadata } from "next";
import BookingWizard from "@/components/BookingWizard";
import type { VehicleSize } from "@/data/catalog";
import { filmTypes } from "@/data/filmTypes";

export const metadata: Metadata = {
  title: "Book a Detail",
  description: "Choose your service, compare packages, pick a time, and book online in minutes.",
};

export default async function BookingPage({
  searchParams,
}: PageProps<"/booking">) {
  const params = await searchParams;
  const service = typeof params.service === "string" ? params.service : undefined;
  const pkg = typeof params.package === "string" ? params.package : undefined;
  const tint = typeof params.tint === "string" ? params.tint : undefined;
  // Checked against the real films, the way the add-on params already are.
  // An unrecognised slug used to survive this far and then behave worse than
  // a missing one: the wizard falls back to Ceramic RX for *display* only
  // when the value is absent, so a bogus film showed RX while pricing at the
  // base rate — $299 charged against $449 shown on a mid-size full vehicle.
  const filmParam = typeof params.film === "string" ? params.film : undefined;
  const film = filmTypes.some((f) => f.slug === filmParam) ? filmParam : undefined;
  const tesla = params.tesla === "1";
  const vehicleSizeParam = typeof params.vehicleSize === "string" ? params.vehicleSize : undefined;
  const vehicleSize: VehicleSize | undefined =
    vehicleSizeParam === "sedan" || vehicleSizeParam === "suv" || vehicleSizeParam === "truck"
      ? vehicleSizeParam
      : undefined;
  const vehicleInfo = typeof params.vehicleInfo === "string" ? params.vehicleInfo : undefined;
  // Comma-separated add-on slugs, validated in the wizard against the
  // category rather than trusted here.
  const addOns = typeof params.addons === "string" ? params.addons.split(",").filter(Boolean) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Book a Detail</h1>
      <p className="text-sm sm:text-base text-muted mb-6 sm:mb-8">
        Choose your service, compare packages, pick a time, and book — all
        online.
      </p>
      <BookingWizard
        initialCategory={service}
        initialPackage={pkg}
        initialTint={tint}
        initialFilm={film}
        initialTesla={tesla}
        initialVehicleSize={vehicleSize}
        initialVehicleInfo={vehicleInfo}
        initialAddOns={addOns}
      />
    </div>
  );
}
