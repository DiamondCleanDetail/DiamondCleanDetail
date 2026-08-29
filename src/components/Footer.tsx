import Link from "next/link";
import DiamondDivider from "@/components/DiamondDivider";
import SocialLinks from "@/components/SocialLinks";
import { serviceArea } from "@/data/serviceArea";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <DiamondDivider />
      <div className="mx-auto max-w-6xl px-6 pb-6">
        <SocialLinks />
      </div>
      {/* Calling is how most people will actually get in touch, but the number
          used to share a line, a size and a colour with the email address and
          the opening hours, so it read as one of three equal footnotes. It now
          leads, in the same silver the site gives its prices and figures, with
          the email and hours settling underneath it as secondary detail. */}
      <div className="mx-auto max-w-6xl px-6 pb-6 flex flex-col items-center gap-2 text-center">
        <a
          href={`tel:${serviceArea.phoneHref}`}
          /* py-2 is for the thumb, not the look: as the primary way to reach
             the business from a phone, the line of text on its own was only a
             24px tap target. */
          className="chrome-text inline-block py-2 text-2xl sm:text-3xl font-bold tracking-tight leading-none transition-opacity hover:opacity-75"
        >
          {serviceArea.phone}
        </a>
        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-4 text-sm text-muted">
          <a href={`mailto:${serviceArea.email}`} className="hover:text-foreground transition-colors">
            {serviceArea.email}
          </a>
          {/* Both lines, not just the first. When this rendered hours[0] alone
              it showed the phone hours and silently dropped the one a customer
              actually needs — which days we can come out. */}
          {serviceArea.hours.map((h) => (
            <span key={h.days} className="contents">
              <span className="hidden sm:inline text-border">&bull;</span>
              <span>
                {h.days}: {h.time}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-8 text-center text-xs text-muted tracking-wide">
        A cut above every car wash.
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-8 flex items-center justify-center gap-3 text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} Diamond Clean Detail. All rights reserved.</p>
        <span aria-hidden>&middot;</span>
        <Link href="/privacy" className="hover:text-foreground transition-colors">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
