"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { catalog } from "@/data/catalog";

function hrefFor(slug: string) {
  return slug === "window-tinting" ? "/window-tinting" : `/services/${slug}`;
}

export default function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function hide() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href="/services"
        className="link-underline text-muted hover:text-foreground transition-colors inline-flex items-center gap-1"
      >
        Services
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50"
          >
            <div className="w-[560px] max-w-[80vw] bg-surface border border-border rounded-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] p-4 grid grid-cols-2 gap-1">
              {catalog.map((c) => (
                <Link
                  key={c.slug}
                  href={hrefFor(c.slug)}
                  className="rounded-lg px-3 py-2.5 hover:bg-surface-2 transition-colors"
                >
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted mt-0.5 line-clamp-1">{c.summary}</p>
                </Link>
              ))}
              <Link
                href="/services"
                className="col-span-2 mt-1 pt-3 border-t border-border text-center text-sm font-medium chrome-text"
              >
                View All Services &rarr;
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
