"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import Lightbox, { type LightboxSlide } from "@/components/Lightbox";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { workItems } from "@/data/work";

export default function WorkGallery() {
  const [slides, setSlides] = useState<LightboxSlide[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  function openJob(itemIndex: number, photoIndex: number) {
    const item = workItems[itemIndex];
    if (item.images.length === 0) return;
    setSlides(item.images.map((src) => ({ src, caption: item.title })));
    setIndex(photoIndex);
  }

  return (
    <>
      <StaggerGrid className="columns-2 lg:columns-3 gap-3 sm:gap-5">
        {workItems.map((item, i) => (
          <div key={item.slug} style={{ breakInside: "avoid" }}>
            {item.brand !== workItems[i - 1]?.brand && (
              <div
                className="flex items-center gap-3 mb-3 sm:mb-5"
                style={{ columnSpan: "all" } as CSSProperties}
              >
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted shrink-0">
                  {item.brand}
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
              </div>
            )}
          <StaggerItem className="mb-3 sm:mb-5 break-inside-avoid">
            <figure className="card-lift bg-surface border border-border rounded-xl overflow-hidden">
              {item.images.length === 0 ? (
                <div className="relative aspect-square bg-surface-2 flex items-center justify-center text-xs text-muted px-4 text-center">
                  Photo coming soon — {item.title}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openJob(i, 0)}
                    aria-label={`View photos from ${item.title}`}
                    className="group relative block w-full aspect-square bg-surface-2 cursor-zoom-in overflow-hidden"
                  >
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.images.length > 1 && (
                      <span className="absolute bottom-2 right-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-medium text-white/90 tabular-nums">
                        {item.images.length} photos
                      </span>
                    )}
                  </button>

                  {/* Remaining shots from the same job, as a thumbnail strip. */}
                  {item.images.length > 1 && (
                    <div
                      className="grid gap-px bg-border"
                      style={{ gridTemplateColumns: `repeat(${item.images.length - 1}, minmax(0, 1fr))` }}
                    >
                      {item.images.slice(1).map((src, j) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => openJob(i, j + 1)}
                          aria-label={`View photo ${j + 2} from ${item.title}`}
                          className="group relative aspect-[4/3] bg-surface-2 cursor-zoom-in overflow-hidden"
                        >
                          <Image
                            src={src}
                            alt={`${item.title} — photo ${j + 2}`}
                            fill
                            sizes="(max-width: 1024px) 25vw, 17vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

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
          </div>
        ))}
      </StaggerGrid>

      <Lightbox
        slides={slides}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </>
  );
}
