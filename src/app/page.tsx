import Link from "next/link";
import { catalog, priceLabel } from "@/data/catalog";
import Hero from "@/components/Hero";
import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Testimonials from "@/components/Testimonials";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import DiamondDivider from "@/components/DiamondDivider";

const featured = ["mobile-detailing", "ceramic-coating", "paint-protection-film", "wheel-ceramic-coating"];

export default function Home() {
  const featuredCategories = catalog.filter((c) => featured.includes(c.slug));

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <FadeIn>
          <Link
            href="/window-tinting"
            className="card-lift group relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 bg-surface border border-border rounded-2xl px-8 py-10"
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-muted">
                Interactive Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                Window Tinting — <span className="chrome-text">See It Before You Book</span>
              </h2>
              <p className="text-muted mt-2 max-w-lg">
                Preview real tint shades on an actual vehicle, then book the
                darkness that fits you. Tesla pricing handled separately.
              </p>
            </div>
            <span className="chrome-btn shrink-0 px-6 py-3 rounded-lg font-semibold whitespace-nowrap">
              Preview Tints &rarr;
            </span>
          </Link>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <FadeIn>
          <h2 className="text-2xl font-semibold mb-6">Popular Services</h2>
        </FadeIn>
        <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCategories.map((category) => (
            <StaggerItem key={category.slug}>
              <Link
                href={`/services/${category.slug}`}
                className="card-lift block h-full bg-surface border border-border rounded-xl p-5"
              >
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted mt-2">{category.summary}</p>
                <p className="mt-4 font-semibold chrome-text">
                  {priceLabel(category.packages[0], "sedan")}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <DiamondDivider />
      <BeforeAfterGallery />
      <DiamondDivider />
      <Testimonials />
      <ServiceAreaMap />
    </div>
  );
}
