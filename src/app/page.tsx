import Link from "next/link";
import { catalog, priceLabel } from "@/data/catalog";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Testimonials from "@/components/Testimonials";
import ServiceAreaMap from "@/components/ServiceAreaMap";

const featured = ["mobile-detailing", "ceramic-coating", "paint-protection-film"];

export default function Home() {
  const featuredCategories = catalog.filter((c) => featured.includes(c.slug));

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Your Car, <span className="chrome-text">Detailed Right.</span>
        </h1>
        <p className="mt-4 text-muted max-w-xl mx-auto">
          Premium mobile detailing, paint protection, and ceramic coatings.
          See your options, visualize the results, and book online in
          minutes.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/booking"
            className="chrome-btn transition-colors px-6 py-3 rounded-lg font-semibold"
          >
            Book a Detail
          </Link>
          <Link
            href="/services"
            className="border border-border hover:border-muted transition-colors px-6 py-3 rounded-lg font-medium"
          >
            View Services
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Link
          href="/window-tinting"
          className="group relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 bg-surface border border-border rounded-2xl px-8 py-10 hover:border-muted transition-colors"
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
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-2xl font-semibold mb-6">Popular Services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/services/${category.slug}`}
              className="bg-surface border border-border rounded-xl p-5 hover:border-muted transition-colors"
            >
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted mt-2">{category.summary}</p>
              <p className="mt-4 font-semibold chrome-text">
                {priceLabel(category.packages[0], "sedan")}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <BeforeAfterGallery />
      <Testimonials />
      <ServiceAreaMap />
    </div>
  );
}
