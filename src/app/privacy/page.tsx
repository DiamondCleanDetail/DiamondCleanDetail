import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Diamond Clean Detail collects, uses, and protects your information.",
};

/** Plain-language privacy policy. Every claim here reflects what the site
 * actually does — if a new data flow is added (analytics, marketing email,
 * SMS), this page must be updated in the same change. */
const sections = [
  {
    title: "What we collect",
    body: (
      <>
        <p>
          When you book a service we collect what the job needs: your name, email address,
          phone number, the service address where we&apos;ll meet your vehicle, and your
          vehicle&apos;s details (year, make, model). If you create an account, we also store
          your sign-in email.
        </p>
        <p>
          We never see or store your card number. Payments are handled entirely by Stripe,
          our payment processor — card details go directly to them.
        </p>
      </>
    ),
  },
  {
    title: "How we use it",
    body: (
      <>
        <p>
          To do the work: confirming your booking, showing up at the right address, sending
          you booking confirmations and receipts by email, and contacting you about your
          appointment if something changes.
        </p>
        <p>
          We don&apos;t sell your information, share it with advertisers, or send marketing
          you didn&apos;t ask for.
        </p>
      </>
    ),
  },
  {
    title: "Who handles it for us",
    body: (
      <>
        <p>
          Like most small businesses, we run on a few established services, and your data
          passes through them to the extent needed to operate the site:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-3">
          <li>
            <strong className="text-foreground">Stripe</strong> — payment processing (they
            hold your card details; we don&apos;t)
          </li>
          <li>
            <strong className="text-foreground">Clerk</strong> — account sign-in, if you
            create an account
          </li>
          <li>
            <strong className="text-foreground">Supabase</strong> — our booking database
          </li>
          <li>
            <strong className="text-foreground">Resend</strong> — sends booking confirmation
            emails
          </li>
          <li>
            <strong className="text-foreground">Vercel</strong> — hosts this website
          </li>
        </ul>
        <p className="mt-3">
          Each processes your data under their own privacy terms, on our instructions, for
          the purposes above.
        </p>
      </>
    ),
  },
  {
    title: "Cookies",
    body: (
      <p>
        We use only functional cookies: keeping you signed in to your account and remembering
        your session while you book. No advertising or cross-site tracking cookies.
      </p>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        Booking records are kept as long as we need them for our own records — things like
        receipts, taxes, and answering questions about past work. If you&apos;d like your
        information removed, email us and we&apos;ll delete what we&apos;re not legally
        required to keep.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <p>
        You can ask us what we have about you, ask us to correct it, or ask us to delete it —
        just email{" "}
        <a href="mailto:info@diamondcleandetail.com" className="text-foreground underline underline-offset-4">
          info@diamondcleandetail.com
        </a>
        . We&apos;ll respond within a reasonable time, and there&apos;s no charge.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        If how we handle data changes, this page changes with it, with the date below
        updated. Significant changes will be noted here rather than buried.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-10 sm:pt-16 pb-16 sm:pb-24">
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted">
        Legal
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Privacy Policy</h1>
      <p className="text-sm text-muted mt-3">
        Diamond Clean Detail · Denver, Colorado · Last updated August 30, 2026
      </p>
      <p className="text-muted mt-6 leading-relaxed">
        The short version: we collect what we need to detail your car and get paid for it,
        we don&apos;t sell it to anyone, and you can ask us to delete it. The longer version
        is below.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <div className="text-sm text-muted mt-2 leading-relaxed space-y-3">{s.body}</div>
          </section>
        ))}
      </div>

      <p className="text-sm text-muted mt-12 pt-6 border-t border-border">
        Questions? Email{" "}
        <a href="mailto:info@diamondcleandetail.com" className="text-foreground underline underline-offset-4">
          info@diamondcleandetail.com
        </a>{" "}
        or see <Link href="/about" className="text-foreground underline underline-offset-4">who we are</Link>.
      </p>
    </div>
  );
}
