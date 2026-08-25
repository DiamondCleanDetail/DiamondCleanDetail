"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/services", label: "Services" },
  { href: "/window-tinting", label: "Window Tint" },
  { href: "/our-work", label: "Our Work" },
  { href: "/booking", label: "Book Now" },
  { href: "/shop", label: "Shop" },
  { href: "/login", label: "Login" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border bg-surface/90 backdrop-blur-md shadow-[0_8px_30px_-15px_rgba(0,0,0,0.6)]"
          : "border-transparent bg-surface/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 min-w-0" onClick={() => setOpen(false)}>
          <Image src="/brand/logo.png" alt="Diamond Clean Detail" width={36} height={36} className="h-9 w-9 shrink-0" />
          <span className="text-lg font-semibold tracking-tight chrome-text truncate">
            Diamond Clean Detail
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm shrink-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden shrink-0 w-9 h-9 flex flex-col items-center justify-center gap-1.5 border border-border rounded-lg"
        >
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-surface px-6 py-4 flex flex-col gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
