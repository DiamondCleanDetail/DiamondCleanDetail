import type { Metadata } from "next";
import BookingWizard from "@/components/BookingWizard";
import type { VehicleSize } from "@/data/catalog";

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
  const film = typeof params.film === "string" ? params.film : undefined;
  const tesla = params.tesla === "1";
  const vehicleSizeParam = typeof params.vehicleSize === "string" ? params.vehicleSize : undefined;
  const vehicleSize: VehicleSize | undefined =
    vehicleSizeParam === "sedan" || vehicleSizeParam === "suv" || vehicleSizeParam === "truck"
      ? vehicleSizeParam
      : undefined;
  const vehicleInfo = typeof params.vehicleInfo === "string" ? params.vehicleInfo : undefined;

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
      />
    </div>
  );
}
