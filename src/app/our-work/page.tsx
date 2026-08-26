import Image from "next/image";
import type { Metadata } from "next";
import { workItems } from "@/data/work";
import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

export const metadata: Metadata = {
  title: "Our Work",
  description: "A look at recent detailing jobs from Diamond Clean Detail, straight from real customers.",
};

export default function OurWorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <FadeIn>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Our Work</h1>
        <p className="text-sm sm:text-base text-muted mb-6 sm:mb-10">
          A look at recent jobs, straight from real customers.
        </p>
      </FadeIn>

      <StaggerGrid className="columns-2 lg:columns-3 gap-3 sm:gap-5">
        {workItems.map((item) => (
          <StaggerItem key={item.slug} className="mb-3 sm:mb-5 break-inside-avoid">
            <figure className="card-lift bg-surface border border-border rounded-xl overflow-hidden">
              <div className="relative aspect-square bg-surface-2">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted px-4 text-center">
                    Photo coming soon — {item.title}
                  </div>
                )}
              </div>
              <figcaption className="p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-medium">{item.title}</p>
                {item.testimonial && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs sm:text-sm text-muted italic">
                      &ldquo;{item.testimonial.quote}&rdquo;
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted mt-2">
                      — {item.testimonial.name}
                    </p>
                  </div>
                )}
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}
