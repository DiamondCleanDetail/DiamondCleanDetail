import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Test",
  description: "A scratch page for trying things out.",
  // Not a customer-facing page — keep it out of search results. It's also
  // deliberately absent from sitemap.ts for the same reason.
  robots: { index: false, follow: false },
};

export default function TestPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-10 sm:pt-16 pb-16 sm:pb-24">
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted">
        Sandbox
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Test</h1>
      <p className="text-muted mt-6 leading-relaxed">
        This page is a scratch space for trying out layout, copy, and components
        before they land anywhere customers see. Nothing here is live work.
      </p>

      <p className="text-sm text-muted mt-12 pt-6 border-t border-border">
        <Link href="/" className="text-foreground underline underline-offset-4">
          Back to home
        </Link>
      </p>
    </div>
  );
}
