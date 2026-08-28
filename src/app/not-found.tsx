import Link from "next/link";
import Image from "next/image";

/** Branded 404 — the default unstyled one was the only unthemed page on the
 * site. Routes the lost visitor to the two places they most likely wanted. */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 sm:py-36 text-center">
      <Image
        src="/brand/logo.png"
        alt=""
        width={48}
        height={48}
        className="mx-auto h-12 w-12 opacity-70"
      />
      <p className="mt-6 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted">
        404 — Page Not Found
      </p>
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mt-3 text-balance">
        This page took the <span className="chrome-text">day off</span>.
      </h1>
      <p className="text-muted mt-4 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Your car, however,
        can still get detailed.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/services" className="chrome-btn px-6 py-3 rounded-lg font-semibold">
          View Services
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg font-semibold border border-border bg-surface hover:border-muted transition-colors"
        >
          Back Home
        </Link>
      </div>
    </section>
  );
}
