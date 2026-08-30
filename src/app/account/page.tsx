import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import {
  getAccountData,
  formatVisitDate,
  formatMoney,
  type Visit,
} from "@/lib/accountBookings";
import { socialLinks } from "@/data/social";
import { serviceArea } from "@/data/serviceArea";
import { bookableDaysLabel } from "@/lib/scheduling";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import DiamondDivider from "@/components/DiamondDivider";
import HelpNudge from "@/components/HelpNudge";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Your upcoming visits, past services and vehicles.",
  robots: { index: false, follow: false },
};

// Bookings change the moment someone checks out, so this can never be static.
export const dynamic = "force-dynamic";

const googleUrl = socialLinks.find((s) => s.name === "Google")?.url ?? null;

const CONTACT = { phone: "+17207032795", phoneLabel: "(720) 703-2795", email: "info@diamondcleandetail.com" };

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null;

  const data = email
    ? await getAccountData(email)
    : { upcoming: [], past: [], vehicles: [], maintenance: null, totalSpentCents: 0, canReview: false };

  const firstName = user.firstName ?? "there";
  const next = data.upcoming[0];
  const hasHistory = data.past.length > 0 || data.upcoming.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-6 pt-12 sm:pt-16 pb-20">
      <FadeIn>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">Your Account</p>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-2">
          Hi, <span className="chrome-text">{firstName}</span>.
        </h1>
        <p className="text-muted mt-3 max-w-2xl">
          {hasHistory
            ? "Everything you've booked with us, and what's coming up."
            : "You haven't booked with us yet — when you do, it'll all show up here."}
          {email && (
            <>
              {" "}
              Matched to <span className="text-foreground">{email}</span>.
            </>
          )}
        </p>
      </FadeIn>

      {/* ---------- Next visit ---------- */}
      <FadeIn>
        <section className="mt-8 sm:mt-12">
          {next ? <NextVisitCard visit={next} /> : <NothingBookedCard hasHistory={hasHistory} />}
        </section>
      </FadeIn>

      {/* Any further upcoming visits, listed plainly beneath the headline one. */}
      {data.upcoming.length > 1 && (
        <FadeIn>
          <section className="mt-5">
            <h2 className="text-xs uppercase tracking-widest text-muted mb-3">
              Also booked
            </h2>
            <div className="grid gap-3">
              {data.upcoming.slice(1).map((v) => (
                <VisitRow key={v.key} visit={v} />
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ---------- Maintenance rhythm ---------- */}
      {data.maintenance && (
        <>
          <DiamondDivider />
          <FadeIn>
            <section>
              <SectionHeading
                align="left"
                eyebrow="Your Rhythm"
                title="Maintenance"
                accent="Plan"
                className="mb-6"
              />
              <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="chrome-text text-2xl sm:text-3xl font-black">
                    {data.maintenance.cadenceLabel}
                  </span>
                  <span className="text-sm text-muted">
                    {data.maintenance.visitCount} visit
                    {data.maintenance.visitCount === 1 ? "" : "s"} so far
                  </span>
                </div>

                {data.maintenance.lastVisit && (
                  <p className="text-sm text-muted mt-4">
                    Last visit {formatVisitDate(data.maintenance.lastVisit)}.
                    {data.maintenance.dueDate && (
                      <>
                        {" "}
                        On your cadence the next one falls around{" "}
                        <span className="text-foreground font-medium">
                          {formatVisitDate(data.maintenance.dueDate)}
                        </span>
                        {typeof data.maintenance.daysUntilDue === "number" && (
                          <>
                            {" "}
                            &mdash;{" "}
                            {data.maintenance.daysUntilDue > 0
                              ? `${data.maintenance.daysUntilDue} days away`
                              : data.maintenance.daysUntilDue === 0
                                ? "that's today"
                                : `${Math.abs(data.maintenance.daysUntilDue)} days ago`}
                          </>
                        )}
                        .
                      </>
                    )}
                  </p>
                )}

                {/* Said outright. There is no subscription behind any of this —
                    every visit is booked and paid for one at a time — and a
                    page that shows a "plan" and a due date is exactly where
                    someone would assume otherwise and then wonder why nobody
                    turned up. */}
                <p className="text-xs text-muted/80 mt-4 leading-relaxed">
                  Nothing is scheduled automatically and there is no recurring charge. The
                  date above is just your cadence counted forward &mdash; book when it suits
                  you, and we&apos;ll hold the slot.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/booking?service=maintenance-plans&package=${data.maintenance.packageSlug}`}
                    className="chrome-btn px-5 py-2.5 rounded-lg font-semibold text-sm"
                  >
                    Book the next visit &rarr;
                  </Link>
                  <Link
                    href="/services/maintenance-plans"
                    className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-border hover:border-muted transition-colors"
                  >
                    Change cadence
                  </Link>
                </div>
              </div>
            </section>
          </FadeIn>
        </>
      )}

      {/* ---------- Vehicles ---------- */}
      {data.vehicles.length > 0 && (
        <>
          <DiamondDivider />
          <FadeIn>
            <section>
              <SectionHeading
                align="left"
                eyebrow="On File"
                title="Your"
                accent={data.vehicles.length === 1 ? "Vehicle" : "Vehicles"}
                className="mb-6"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                {data.vehicles.map((v) => (
                  <div
                    key={v.label}
                    className="bg-surface border border-border rounded-xl p-5 flex flex-col"
                  >
                    <h3 className="font-semibold">{v.label}</h3>
                    <p className="text-xs text-muted mt-1">
                      Last booked {formatVisitDate(v.lastDate)}
                    </p>
                    {/* Prefilled, so a repeat booking skips the two steps they
                        have already answered once. */}
                    <Link
                      href={`/booking?vehicleInfo=${encodeURIComponent(v.label)}${v.size ? `&vehicleSize=${v.size}` : ""}`}
                      className="text-sm font-semibold mt-4 underline underline-offset-4 hover:text-accent transition-colors self-start"
                    >
                      Book something for this car &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        </>
      )}

      {/* ---------- History ---------- */}
      {data.past.length > 0 && (
        <>
          <DiamondDivider />
          <FadeIn>
            <section>
              <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
                <SectionHeading
                  align="left"
                  eyebrow="Everything So Far"
                  title="Service"
                  accent="History"
                />
                <p className="text-sm text-muted">
                  {data.past.length} visit{data.past.length === 1 ? "" : "s"} &middot;{" "}
                  <span className="text-foreground font-medium tabular-nums">
                    {formatMoney(data.totalSpentCents)}
                  </span>{" "}
                  total
                </p>
              </div>
              <div className="grid gap-3">
                {data.past.map((v) => (
                  <VisitRow key={v.key} visit={v} showRebook />
                ))}
              </div>
            </section>
          </FadeIn>
        </>
      )}

      {/* ---------- Review ---------- */}
      {data.canReview && googleUrl && (
        <>
          <DiamondDivider />
          <FadeIn>
            <section className="bg-surface border border-border rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-accent text-lg tracking-[0.3em]" aria-hidden>
                ★★★★★
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mt-3">How did we do?</h2>
              <p className="text-sm text-muted mt-2 max-w-md mx-auto">
                We&apos;re a small operation, and a Google review is genuinely the single
                most useful thing a happy customer can do for us. Takes a minute.
              </p>
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="chrome-btn inline-block mt-5 px-6 py-3 rounded-lg font-bold text-sm"
              >
                Leave a review &rarr;
              </a>
              {/* The other half of the ask. Somebody who had a bad visit should
                  reach us before they reach Google — for their sake as much as
                  ours, since we can actually fix it. */}
              <p className="text-xs text-muted/80 mt-4">
                Something not right?{" "}
                <a href={`tel:${CONTACT.phone}`} className="underline underline-offset-4">
                  Call us
                </a>{" "}
                first &mdash; we&apos;d much rather put it right than read about it.
              </p>
            </section>
          </FadeIn>
        </>
      )}

      {/* ---------- Help ---------- */}
      <DiamondDivider />
      <FadeIn>
        <section>
          <SectionHeading align="left" title="Need" accent="Anything?" className="mb-6" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm">Changing or cancelling a visit</h3>
              <p className="text-sm text-muted mt-2">
                There&apos;s no self-serve reschedule yet &mdash; call or text and we&apos;ll move
                it. We work {bookableDaysLabel().toLowerCase()} across the {serviceArea.region}.
              </p>
              <div className="flex flex-wrap gap-3 mt-4 text-sm font-semibold">
                <a href={`tel:${CONTACT.phone}`} className="underline underline-offset-4 hover:text-accent transition-colors">
                  {CONTACT.phoneLabel}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4 hover:text-accent transition-colors">
                  {CONTACT.email}
                </a>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm">Your sign-in details</h3>
              <p className="text-sm text-muted mt-2">
                Name, email, password and connected accounts live in{" "}
                <span className="text-foreground">Manage account</span>, under your profile
                picture at the top right.
              </p>
              <p className="text-xs text-muted/80 mt-3">
                Bookings are matched by email address, so if you booked under a different
                one it won&apos;t appear here &mdash; tell us and we&apos;ll join them up.
              </p>
            </div>
          </div>
          <HelpNudge label="Not sure what your car needs next?" className="max-w-2xl mx-auto" />
        </section>
      </FadeIn>
    </div>
  );
}

/** The headline card: the next time we're turning up. */
function NextVisitCard({ visit }: { visit: Visit }) {
  return (
    <div className="relative overflow-hidden bg-surface border border-accent/40 rounded-2xl p-6 sm:p-8">
      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-accent">Next visit</p>
      <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">
        {formatVisitDate(visit.date)}
      </h2>
      <p className="text-lg sm:text-xl text-muted mt-1">at {visit.time}</p>

      <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">What we&apos;re doing</p>
          <ul className="mt-2 space-y-1.5">
            {visit.lines.map((l, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold">{l.service}</span>
                <span className="text-muted"> &middot; {l.packageName}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Vehicle</p>
          <p className="text-sm mt-2">{visit.vehicle || "Not recorded"}</p>
          {visit.totalCents > 0 && (
            <p className="text-sm text-muted mt-3">
              <span className="text-foreground font-semibold tabular-nums">
                {formatMoney(visit.totalCents)}
              </span>{" "}
              total
              {visit.paidCents > 0 && visit.paidCents < visit.totalCents && (
                <> &mdash; {formatMoney(visit.paidCents)} paid, the rest on the day</>
              )}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-muted/80 mt-6 leading-relaxed">
        We come to you and bring water and power. Need to move it? Call{" "}
        <a href={`tel:${CONTACT.phone}`} className="underline underline-offset-4">
          {CONTACT.phoneLabel}
        </a>
        .
      </p>
    </div>
  );
}

function NothingBookedCard({ hasHistory }: { hasHistory: boolean }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold">
        {hasHistory ? "Nothing booked at the moment" : "Nothing here yet"}
      </h2>
      <p className="text-sm text-muted mt-2 max-w-lg">
        {hasHistory
          ? "When you book your next visit it'll show up here with the date, the vehicle and what we're doing."
          : "Book your first service and this page fills in — your appointments, your vehicles, and everything we've done."}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/booking" className="chrome-btn px-5 py-2.5 rounded-lg font-semibold text-sm">
          Book a service &rarr;
        </Link>
        <Link
          href="/services"
          className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-border hover:border-muted transition-colors"
        >
          Browse services
        </Link>
      </div>
    </div>
  );
}

function VisitRow({ visit, showRebook = false }: { visit: Visit; showRebook?: boolean }) {
  const first = visit.lines[0];
  return (
    <div className="bg-surface border border-border rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-semibold text-sm">
          {visit.lines.map((l) => l.service).join(" + ")}
        </p>
        <p className="text-xs text-muted mt-1">
          {formatVisitDate(visit.date)} &middot; {visit.time}
          {visit.vehicle && <> &middot; {visit.vehicle.split("·")[0].trim()}</>}
        </p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        {visit.totalCents > 0 && (
          <span className="text-sm font-semibold tabular-nums">
            {formatMoney(visit.totalCents)}
          </span>
        )}
        {showRebook && first && (
          <Link
            href={`/booking?service=${first.serviceSlug}&package=${first.packageSlug}${
              visit.vehicle ? `&vehicleInfo=${encodeURIComponent(visit.vehicle.split("·")[0].trim())}` : ""
            }${visit.vehicleSize ? `&vehicleSize=${visit.vehicleSize}` : ""}`}
            className="text-sm font-semibold underline underline-offset-4 hover:text-accent transition-colors whitespace-nowrap"
          >
            Book again
          </Link>
        )}
      </div>
    </div>
  );
}
