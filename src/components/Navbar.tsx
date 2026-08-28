"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { navGroups } from "@/data/navGroups";
import ServicesDropdown from "@/components/ServicesDropdown";

const links = [
  { href: "/our-work", label: "Our Work" },
  { href: "/booking", label: "Book Now" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
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
          <span className="font-wordmark text-[26px] sm:text-[30px] leading-none chrome-text truncate pt-1">
            Diamond Clean Detail
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm shrink-0">
          <ServicesDropdown />
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="link-underline text-muted hover:text-foreground transition-colors"
              >
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden shrink-0 w-11 h-11 flex flex-col items-center justify-center gap-1.5 border border-border rounded-lg"
        >
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-surface px-6 py-4 flex flex-col gap-1 text-sm">
          <button
            type="button"
            onClick={() => setServicesOpen((v) => !v)}
            className="flex items-center justify-between py-2 text-muted hover:text-foreground transition-colors"
            aria-expanded={servicesOpen}
          >
            Services
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {servicesOpen && (
            <div className="pl-3 flex flex-col gap-1 pb-2 border-l border-border ml-1">
              {navGroups.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  onClick={() => setOpen(false)}
                  className="py-1.5 text-sm text-muted hover:text-foreground transition-colors"
                >
                  {g.label}
                </Link>
              ))}
            </div>
          )}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="py-2 text-left text-muted hover:text-foreground transition-colors"
              >
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <div className="py-2 flex items-center gap-2 text-muted">
              <UserButton /> <span className="text-sm">Account</span>
            </div>
          </Show>
        </nav>
      )}
    </header>
  );
}
