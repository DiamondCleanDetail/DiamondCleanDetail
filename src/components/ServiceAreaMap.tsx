"use client";

import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { serviceArea } from "@/data/serviceArea";

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ServiceAreaMap() {
  const [open, setOpen] = useState(false);

  return (
    <section id="service-area" className="mx-auto max-w-6xl px-6 py-10 sm:py-16 scroll-mt-24">
      <SectionHeading
        align="left"
        eyebrow="Where We Work"
        title="We Serve All of"
        accent={serviceArea.region}
        subtitle="Mobile detailing that comes to you, wherever you are in the metro."
        className="mb-8 sm:mb-10"
      />

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-start gap-3">
            <PinIcon />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Address</p>
              <p className="text-sm mt-1">{serviceArea.region}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PhoneIcon />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Phone</p>
              <a href={`tel:${serviceArea.phoneHref}`} className="text-sm mt-1 hover:text-foreground transition-colors block">
                {serviceArea.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MailIcon />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Email</p>
              <a href={`mailto:${serviceArea.email}`} className="text-sm mt-1 hover:text-foreground transition-colors block">
                {serviceArea.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ClockIcon />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Hours</p>
              {serviceArea.hours.map((h) => (
                <p key={h.days} className="text-sm mt-1">
                  {h.days}: {h.time}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">
            Service Area
          </p>
          <p className="text-sm text-muted mb-4">
            Based in {serviceArea.region}, covering {serviceArea.cities.length}+ cities across
            the metro — Denver, Aurora, Boulder, and everywhere in between.
          </p>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="chrome-btn px-5 py-2 rounded-lg font-semibold text-sm"
          >
            {open ? "Hide Service Area" : "View Service Area"}
          </button>

          {/* Cities stay in the DOM (good for SEO) even when visually
              collapsed — only their visibility toggles. */}
          <div className={`flex flex-wrap gap-2 mt-4 ${open ? "" : "hidden"}`}>
            {serviceArea.cities.map((city) => (
              <span
                key={city}
                className="text-xs sm:text-sm text-muted border border-border bg-surface-2 rounded-full px-3 py-1"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
