import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { serviceArea } from "@/data/serviceArea";

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/**
 * The strip above the header: where we are, and where to find us.
 *
 * It exists because "Denver Metro Area" only appeared in the footer, so the
 * single most disqualifying fact about a mobile detailer — whether they come
 * to you — was the last thing on the page. Deliberately not sticky: it is
 * orientation, read once, and pinning it would cost a permanent band of screen
 * on phones for something nobody needs twice.
 */
export default function UtilityBar() {
  return (
    <div className="w-full bg-brand-blue text-neutral-950">
      <div className="mx-auto max-w-6xl px-6 h-9 flex items-center justify-between gap-4">
        <Link
          href="/#service-area"
          className="group flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold tracking-wide min-w-0"
        >
          <PinIcon />
          <span className="whitespace-nowrap">{serviceArea.city}</span>
          <span aria-hidden className="opacity-40 hidden sm:inline">
            &middot;
          </span>
          {/* The label is the part that goes on narrow screens, not the link:
              the pin and city still carry it to the same place. */}
          <span className="hidden sm:inline underline underline-offset-2 decoration-neutral-950/30 group-hover:decoration-neutral-950 transition-colors whitespace-nowrap">
            See service areas
          </span>
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            &rarr;
          </span>
        </Link>

        <SocialLinks compact />
      </div>
    </div>
  );
}
