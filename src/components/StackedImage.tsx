"use client";

import Image from "next/image";

export type ImageVariant = { key: string; src: string };

/** Renders every variant at once, stacked, and reveals one.
 *
 * A single <Image> whose `src` changes has to go and fetch the new file the
 * first time each variant is picked, and that fetch is the pause you see when
 * stepping through tint shades or coverage tiers. Holding them all in the DOM
 * turns the switch into a style change, which lands in the same frame.
 *
 * The parent must be positioned and own the height — every layer is `fill`. */
export default function StackedImage({
  variants,
  active,
  alt,
  sizes,
  className = "",
  priorityKey,
}: {
  variants: ImageVariant[];
  /** `key` of the variant to show. */
  active: string;
  /** Describes the shown variant; the rest are hidden from assistive tech. */
  alt: string;
  sizes: string;
  className?: string;
  /** The variant worth preloading — normally whichever is up at mount. The
   * rest load eagerly too, just without competing for priority. */
  priorityKey?: string;
}) {
  return (
    <>
      {variants.map((v) => {
        const isShown = v.key === active;
        return (
          <Image
            key={v.key}
            src={v.src}
            alt={isShown ? alt : ""}
            aria-hidden={!isShown}
            fill
            {...(v.key === priorityKey ? { priority: true } : { loading: "eager" as const })}
            sizes={sizes}
            className={`${className} ${isShown ? "opacity-100" : "opacity-0"}`}
          />
        );
      })}
    </>
  );
}
