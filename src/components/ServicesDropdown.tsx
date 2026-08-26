"use client";

import { useState, useRef, type FocusEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { navGroups } from "@/data/navGroups";

export default function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function hide() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    const next = e.relatedTarget as Node | null;
    if (!next || !containerRef.current?.contains(next)) {
      setOpen(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <Link
        href="/services"
        aria-haspopup="true"
        aria-expanded={open}
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
            <div className="w-64 bg-surface border border-border rounded-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] p-2">
              {navGroups.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-2 transition-colors"
                >
                  {g.label}
                </Link>
              ))}
              <Link
                href="/services"
                className="block mt-1 pt-3 border-t border-border text-center text-sm font-medium chrome-text py-2"
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
