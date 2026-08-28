import Link from "next/link";
import { getCategory, priceForSize } from "@/data/catalog";

const plans = getCategory("maintenance-plans");

/** Surfaces the recurring maintenance plans as a membership offer. Those
 * packages already exist as their own service page, but nobody browsing
 * detailing ever found them there — this puts the recurring option in front
 * of the people actually choosing a detail. */
export default function MembershipCard() {
  if (!plans) return null;

  const monthly = plans.packages.find((p) => p.slug === "monthly-maintenance");
  const biweekly = plans.packages.find((p) => p.slug === "biweekly-maintenance");
  if (!monthly || !biweekly) return null;

  const monthlyPrice = priceForSize(monthly, "sedan");
  const biweeklyPrice = priceForSize(biweekly, "sedan");

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface border border-border px-6 py-10 sm:px-12 sm:py-14 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_22rem_at_50%_-30%,rgba(236,238,240,0.12),transparent_70%)]"
      />
      <div className="relative">
        <div className="text-center">
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted mb-3">
            Membership
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-balance">
            Keep It Clean <span className="chrome-text">All Year</span>
          </h2>
          <p className="text-sm sm:text-base text-muted mt-3 max-w-xl mx-auto">
            A recurring detail on your schedule, at a lower per-visit price than booking one
            at a time — with priority access to the calendar.
          </p>
        </div>

        <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 gap-4 sm:gap-5">
          {[
            { pkg: biweekly, price: biweeklyPrice, cadence: "every 2 weeks", featured: true },
            { pkg: monthly, price: monthlyPrice, cadence: "per month", featured: false },
          ].map(({ pkg, price, cadence, featured }) => (
            <div
              key={pkg.slug}
              className={`relative rounded-xl bg-surface-2 border p-6 ${
                featured ? "border-accent" : "border-border"
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-5 chrome-chip text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Best Value
                </span>
              )}
              <h3 className="font-semibold text-lg">{pkg.name}</h3>
              <p className="text-sm text-muted mt-1">{pkg.tagline}</p>
              <p className="chrome-text text-4xl font-black leading-none mt-4">${price}</p>
              <p className="text-xs text-muted mt-1">per visit, {cadence} — sedan; SUV &amp; truck priced at checkout</p>
              <ul className="mt-4 space-y-1.5">
                {pkg.features.map((f) => (
                  <li key={f} className="text-sm text-muted flex gap-2">
                    <span className="text-accent shrink-0">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/booking?service=${plans.slug}&package=${pkg.slug}`}
                className="chrome-btn w-full text-center inline-block mt-6 px-5 py-3 rounded-lg font-bold"
              >
                Start This Plan
              </Link>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted text-center mt-7">
          More than one car in the driveway?{" "}
          <Link href="/services/fleet-detailing" className="text-foreground underline underline-offset-4 hover:text-accent transition-colors">
            Multi-vehicle pricing
          </Link>{" "}
          covers households and businesses booking several at once.
        </p>

        {/* No annual-savings comparison here on purpose: a member visit is a
            wash & vacuum, not the full Diamond Detail, so comparing it to 12
            full details would inflate the "savings" against a different
            service. The per-visit price stands on its own. */}
      </div>
    </div>
  );
}
