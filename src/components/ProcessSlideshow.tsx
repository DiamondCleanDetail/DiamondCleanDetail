"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type MediaItem = { type: "image" | "video"; src: string; caption?: string };

export default function ProcessSlideshow({ items }: { items?: MediaItem[] }) {
  const [index, setIndex] = useState(0);
  const hasItems = items && items.length > 0;

  useEffect(() => {
    if (!hasItems || items!.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items!.length), 4500);
    return () => clearInterval(t);
  }, [hasItems, items]);

  if (!hasItems) {
    return (
      <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-xl border border-dashed border-border/60 flex items-center justify-center">
        <p className="text-sm text-muted text-center px-6 max-w-md">
          A slideshow of the coating being applied — plus a clip of water beading off
          the finished paint — is coming soon.
        </p>
      </div>
    );
  }

  const item = items![index];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-surface-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <Image src={item.src} alt={item.caption ?? "Ceramic coating process"} fill className="object-cover" />
            )}
          </motion.div>
        </AnimatePresence>

        {item.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
            <p className="text-sm text-white">{item.caption}</p>
          </div>
        )}
      </div>

      {items!.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {items!.map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
