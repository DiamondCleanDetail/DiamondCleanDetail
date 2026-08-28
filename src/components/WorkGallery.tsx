"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox, { type LightboxSlide } from "@/components/Lightbox";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { workItems, type WorkItem } from "@/data/work";

/** Jobs grouped by marque, preserving the order they appear in the data. */
function groupByBrand(items: WorkItem[]): { brand: string; items: WorkItem[] }[] {
  const groups: { brand: string; items: WorkItem[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.brand === item.brand) last.items.push(item);
    else groups.push({ brand: item.brand, items: [item] });
  }
  return groups;
}

export default function WorkGallery() {
  const [slides, setSlides] = useState<LightboxSlide[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  function openJob(item: WorkItem, photoIndex: number) {
    if (item.images.length === 0) return;
    setSlides(item.images.map((src) => ({ src, caption: item.title })));
    setIndex(photoIndex);
  }

  const groups = groupByBrand(workItems);

  return (
    <>
      {/* One masonry block per marque. The divider used to live inside a
          column item with `column-span: all`, which browsers fragment
          inconsistently — it was overlapping the card above it. Each brand
          now gets its own columns container, so the divider is an ordinary
          full-width block and can't collide with anything. */}
      <div className="flex flex-col gap-8 sm:gap-12">
        {groups.map((group) => (
          <section key={group.brand}>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
              <h2 className="text-[10px] sm:text-xs uppercase tracking-widest text-muted shrink-0">
                {group.brand}
              </h2>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
            </div>

            <StaggerGrid className="columns-2 lg:columns-3 gap-3 sm:gap-5">
              {group.items.map((item) => (
                <StaggerItem key={item.slug} className="mb-3 sm:mb-5 break-inside-avoid">
                  <figure className="card-lift bg-surface border border-border rounded-xl overflow-hidden">
                    {item.images.length === 0 ? (
                      <div className="relative aspect-square bg-surface-2 flex items-center justify-center text-xs text-muted px-4 text-center">
                        Photo coming soon — {item.title}
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => openJob(item, 0)}
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
                            style={{
                              gridTemplateColumns: `repeat(${item.images.length - 1}, minmax(0, 1fr))`,
                            }}
                          >
                            {item.images.slice(1).map((src, j) => (
                              <button
                                key={src}
                                type="button"
                                onClick={() => openJob(item, j + 1)}
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
              ))}
            </StaggerGrid>
          </section>
        ))}
      </div>

      <Lightbox
        slides={slides}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </>
  );
}
