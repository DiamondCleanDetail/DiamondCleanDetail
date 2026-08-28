import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { catalog, priceLabel } from "@/data/catalog";
import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Services",
  description: "Every detailing service we offer, with real packages and pricing — mobile detailing, ceramic coatings, PPF, window tinting, and more.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <FadeIn>
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="What We Do"
          title="Every Service We"
          accent="Offer"
          subtitle="Real packages, real pricing. Pick a category to compare options and book online."
          className="mb-8 sm:mb-12"
        />
      </FadeIn>

      <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {catalog.map((category) => {
          const startingPackage = category.packages[0];
          return (
            <StaggerItem key={category.slug}>
              <Link
                href={category.slug === "window-tinting" ? "/window-tinting" : `/services/${category.slug}`}
                className="card-lift block h-full bg-surface border border-border rounded-xl overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-surface-2">
                  {category.cardImage ? (
                    <Image
                      src={category.cardImage}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-muted text-center px-4">Photo coming soon</p>
                    </div>
                  )}
                  {category.visualizer && (
                    <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wide bg-background/80 backdrop-blur-sm border border-border rounded-full px-2 py-1 text-muted">
                      Visualizer
                    </span>
                  )}
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  <p className="text-sm text-muted mt-2 flex-1">{category.summary}</p>
                  <p className="mt-4 font-semibold chrome-text">
                    {category.isQuoteOnly
                      ? "Get a Quote"
                      : priceLabel(startingPackage, "sedan")}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerGrid>
    </div>
  );
}
