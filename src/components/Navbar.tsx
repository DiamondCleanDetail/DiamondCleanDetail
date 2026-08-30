"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { isOwnerEmail } from "@/lib/siteAccess";
import { navGroups } from "@/data/navGroups";
import { serviceArea } from "@/data/serviceArea";
import ServicesDropdown from "@/components/ServicesDropdown";

// The wordmark never fits beside the logo and the menu button at phone
// widths — "Diamond Clean Detail" wants 308px against the 252px it gets at
// 390px. It used to be clipped with `truncate`, which added an ellipsis, and
// the trailing "..." implied text was missing rather than reading as a
// deliberately short mark. So drop to just "Diamond Clean" below sm instead:
// same wording, cut at a word boundary, no dots, and no shrinking the font or
// wrapping to a second line. Two spans rather than one with a nested
// <span> — `chrome-text` paints its gradient with background-clip: text, and
// giving each phrase its own element keeps that off the edge cases.
const wordmarkClass =
  "font-wordmark text-[26px] sm:text-[30px] leading-none chrome-text whitespace-nowrap overflow-hidden pt-1";

const links = [
  { href: "/our-work", label: "Our Work" },
  { href: "/booking", label: "Book Now" },
  { href: "/about", label: "About" },
];

/** 16px calendar, sized to sit level with Clerk's own menu icons. */
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

/** 16px shield, matching the calendar icon's weight. */
function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Whether to offer the admin link. Convenience only — /admin re-checks the
  // signed-in email server-side, so a forced-true here still opens nothing.
  const { user } = useUser();
  const isOwner = isOwnerEmail(user?.primaryEmailAddress?.emailAddress);

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
        <Link
          href="/"
          aria-label="Diamond Clean Detail"
          className="flex items-center gap-2.5 min-w-0"
          onClick={() => setOpen(false)}
        >
          {/* Decorative: the link carries the full name via aria-label. */}
          <Image src="/brand/logo.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0" />
          {/* Below 360px even "Diamond Clean" runs out of room (212px wanted
              against 182px at a 320px viewport) and would be sliced mid-word,
              so it steps down one size there — and only there. */}
          <span className={`${wordmarkClass} max-[359px]:text-[22px] sm:hidden`}>Diamond Clean</span>
          <span className={`${wordmarkClass} hidden sm:inline`}>Diamond Clean Detail</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm shrink-0">
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
          {/* Phone escape hatch — some customers will always rather call, and
              until now the number only existed in the footer. Icon-only at
              tablet widths so it can't crowd the wordmark into truncating;
              the full number appears from lg up. */}
          <a
            href={`tel:${serviceArea.phoneHref}`}
            aria-label={`Call ${serviceArea.phone}`}
            className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors whitespace-nowrap"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
              <path
                d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden lg:inline link-underline">{serviceArea.phone.replace(/^\+1 /, "")}</span>
          </a>
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
            <UserButton>
              {/* Clerk's own menu only offers profile settings and sign-out.
                  This is the reason to have an account at all: bookings,
                  vehicles and history. */}
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Your bookings"
                  labelIcon={<CalendarIcon />}
                  href="/account"
                />
                {isOwner && (
                  <UserButton.Link
                    label="Admin dashboard"
                    labelIcon={<ShieldIcon />}
                    href="/admin"
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
          </Show>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="lg:hidden shrink-0 w-11 h-11 flex flex-col items-center justify-center gap-1.5 border border-border rounded-lg"
        >
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-surface px-6 py-4 flex flex-col gap-1 text-sm">
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
          <a
            href={`tel:${serviceArea.phoneHref}`}
            className="py-2 text-muted hover:text-foreground transition-colors"
          >
            Call {serviceArea.phone.replace(/^\+1 /, "")}
          </a>
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
            <div className="py-2 flex items-center gap-3 flex-wrap">
              <UserButton />
              <Link href="/account" onClick={() => setOpen(false)} className="text-sm">
                Your bookings
              </Link>
              {isOwner && (
                <Link href="/admin" onClick={() => setOpen(false)} className="text-sm">
                  Admin
                </Link>
              )}
            </div>
          </Show>
        </nav>
      )}
    </header>
  );
}
