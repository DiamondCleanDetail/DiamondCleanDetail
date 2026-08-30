import { serviceArea } from "@/data/serviceArea";
import { bookableDaysLabel } from "@/lib/scheduling";

/**
 * A small set of campaign emails, written to be sent one a week.
 *
 * Two rules shape all of them. Nothing claims a service, a price or an offer
 * the site does not already make — a campaign that promises something the
 * booking flow cannot honour costs more than it earns. And every one leads
 * with a reason to care rather than with the business: "your paint is full of
 * scratches you have never seen" earns a read in a way "check out our
 * services" does not.
 *
 * Discounts are deliberately absent. Any figure here would be one nobody has
 * authorised, and a made-up discount is the one marketing mistake you cannot
 * quietly walk back once it is in someone's inbox.
 */

const siteUrl = "https://diamondcleandetail.com";

// Duplicated from globals.css on purpose: mail clients don't load stylesheets
// and don't resolve CSS variables.
//
// A light palette, on purpose. The dark version looked right in preview but
// several clients (Gmail especially) drop the <body>/table background and paint
// the email on their own white — which left the light chrome wordmark invisible
// on white. A light email is the one thing every client renders the same, so
// the header uses the black wordmark and the body stays dark-on-light.
const colors = {
  background: "#eef0f2",
  surface: "#ffffff",
  surface2: "#f5f6f7",
  foreground: "#0f1012",
  muted: "#54575e",
  border: "#e4e6ea",
  accent: "#111214",
};

export type MarketingEmail = {
  slug: string;
  /** Week in the rotation, for scheduling. */
  week: number;
  subject: string;
  /** The grey line under the subject in most inboxes. Wasting it on "View in
   * browser" is the most common way a good subject line gets thrown away. */
  preheader: string;
  eyebrow: string;
  title: string;
  /** One idea per paragraph. */
  body: string[];
  /** Optional bordered aside — a fact worth pulling out of the flow. */
  callout?: { label: string; text: string };
  cta: { label: string; href: string };
  /** Small print under the button. */
  footNote?: string;
};

export const marketingEmails: MarketingEmail[] = [
  {
    slug: "swirls",
    week: 1,
    subject: "Your paint has scratches you've never seen",
    preheader:
      "They only show up in direct sun — and once you've seen them you can't unsee them.",
    eyebrow: "Paint Correction",
    title: "The damage a car wash leaves behind",
    body: [
      "Park in direct sunlight and look at your bonnet from a low angle. Those fine circular scratches spreading out from the reflection are swirl marks, and almost every car on the road has them.",
      "They come from washing — brushes at a tunnel wash, a gritty sponge, a towel that picked up dirt off the ground. Each pass leaves scratches too fine to see head-on, until the light hits at the wrong angle and the paint looks hazy instead of deep.",
      "Machine polishing levels that top layer of clear coat and takes them out. It's the difference between a car that's clean and a car that looks new.",
    ],
    callout: {
      label: "Why you've probably never noticed",
      text: "Swirls are nearly invisible on silver and white, and obvious on black and dark grey. Same damage — the colour just hides it.",
    },
    cta: { label: "See the difference", href: `${siteUrl}/services/paint-correction` },
  },
  {
    slug: "winter-salt",
    week: 2,
    subject: "What Colorado roads do to your paint",
    preheader: "Mag chloride doesn't wash off with rain. It sits there.",
    eyebrow: "Ceramic Coating",
    title: "Salt, sun, and a mile of altitude",
    body: [
      "Denver is a hard place to keep a car looking good. The UV up here is stronger than the numbers suggest, the year runs from hail season into months of road treatment, and magnesium chloride clings to paint long after the roads dry out.",
      "A ceramic coating is the layer that takes all of that instead of your clear coat. It blocks the UV that oxidises paint, sheds water before it can dry into spots, and gives salt and grit nothing to key into — so what used to need scrubbing comes off with a rinse.",
      "It is not armour. It won't stop a rock chip or a hailstone; that's what paint protection film is for. What it does is stop the slow chemical wear that makes a five-year-old car look ten.",
    ],
    cta: { label: "How coatings work", href: `${siteUrl}/services/ceramic-coating` },
  },
  {
    slug: "we-come-to-you",
    week: 3,
    subject: "You don't have to go anywhere",
    preheader: "We bring the water, the power, and everything else.",
    eyebrow: "Mobile Detailing",
    title: "The whole thing happens on your driveway",
    body: [
      "The reason most people put off detailing isn't the money. It's the afternoon: dropping the car off, arranging a lift, going back for it.",
      "We turn up where the car already is — your house, your office car park — with water, power and everything else in the van. Nothing is needed from you. You book a time online, we confirm the address, and you carry on with your day.",
      // Generated from the scheduling rule rather than written out, so the
      // campaign cannot promise days the booking form will not offer.
      `We cover the ${serviceArea.region} and work ${bookableDaysLabel()}.`,
    ],
    cta: { label: "Book a time", href: `${siteUrl}/booking` },
  },
  {
    slug: "interior",
    week: 4,
    subject: "The part of your car you actually touch",
    preheader: "Leather dries out from the outside in, and the driver's seat goes first.",
    eyebrow: "Interior & Leather",
    title: "Your driver's seat is the oldest-looking part of your car",
    body: [
      "Everyone slides across the same bolster getting in and out, thousands of times. Add sun through the side window and the leather there dries, cracks and fades years before the rest of the interior does.",
      "It's fixable, and it's not a reupholster. Deep cleaning lifts the embedded oils that make leather feel stiff, conditioning puts the moisture back, and full restoration can recolour leather that's already faded.",
      "The same visit deals with everything else you touch — the wheel, the console, the door cards.",
    ],
    callout: {
      label: "Worth knowing",
      text: "Conditioning is prevention, not repair. It's much cheaper to keep leather supple than to bring it back once it has cracked.",
    },
    cta: { label: "Interior services", href: `${siteUrl}/services/leather-restoration` },
  },
  {
    slug: "tint",
    week: 5,
    subject: "See your tint before you commit to it",
    preheader: "Pick the shade on a real car, not off a chart on a wall.",
    eyebrow: "Window Tinting",
    title: "Nobody should choose tint from a percentage",
    body: [
      "\"35%\" means nothing until you see it on a car. Most people pick a number, then spend the drive home deciding it was too dark or not dark enough.",
      "Our tint page shows every shade on an actual vehicle so you can compare them side by side before booking. Teslas get their own previews, since the glass is different and so is the price.",
      "The film matters as much as the shade. A cheap dyed film goes purple; a ceramic film keeps the cabin genuinely cooler without going darker than you want.",
    ],
    cta: { label: "Preview the shades", href: `${siteUrl}/window-tinting` },
  },
];

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Renders one campaign email.
 *
 * Table-based and inline-styled throughout, because Outlook still renders
 * mail with Word's engine: flexbox, grid and external stylesheets are all
 * unavailable, and a layout that relies on them arrives as a single column of
 * unstyled text.
 */
export function renderMarketingEmail(
  email: MarketingEmail,
  opts: { unsubscribeUrl?: string } = {}
): string {
  const { unsubscribeUrl } = opts;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(email.subject)}</title>
  </head>
  <body style="margin:0; padding:0; background:${colors.background};">
    <!-- Preheader: shown next to the subject in the inbox, hidden in the body.
         The trailing whitespace stops the client filling the rest of the
         preview with the first line of the email. -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      ${esc(email.preheader)}
      ${"&#8199;&#65279;&#847; ".repeat(60)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.background}; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%; background:${colors.surface}; border:1px solid ${colors.border}; border-radius:16px; overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 24px; text-align:center; border-bottom:1px solid ${colors.border};">
                <img src="${siteUrl}/brand/logo-dark.png" width="36" height="36" alt="" style="display:block; margin:0 auto 14px;" />
                <img src="${siteUrl}/brand/wordmark-dark.png" width="206" height="21" alt="Diamond Clean Detail" style="display:block; margin:0 auto; max-width:206px;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 6px; font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${colors.muted};">
                  ${esc(email.eyebrow)}
                </p>
                <h1 style="margin:0 0 20px; font-family:Arial,Helvetica,sans-serif; font-size:24px; line-height:1.25; font-weight:700; color:${colors.foreground};">
                  ${esc(email.title)}
                </h1>

                ${email.body
                  .map(
                    (p) =>
                      `<p style="margin:0 0 16px; font-family:Arial,Helvetica,sans-serif; font-size:15px; line-height:1.65; color:${colors.muted};">${esc(p)}</p>`
                  )
                  .join("\n                ")}

                ${
                  email.callout
                    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.surface2}; border:1px solid ${colors.border}; border-radius:12px; margin:4px 0 24px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <p style="margin:0 0 6px; font-family:Arial,Helvetica,sans-serif; font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:${colors.muted};">${esc(email.callout.label)}</p>
                      <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:${colors.foreground};">${esc(email.callout.text)}</p>
                    </td>
                  </tr>
                </table>`
                    : ""
                }

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 0;">
                  <tr>
                    <td style="background:${colors.accent}; border-radius:8px;">
                      <a href="${email.cta.href}" style="display:inline-block; padding:13px 26px; font-family:Arial,Helvetica,sans-serif; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none;">${esc(email.cta.label)}</a>
                    </td>
                  </tr>
                </table>

                ${
                  email.footNote
                    ? `<p style="margin:18px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:1.6; color:${colors.muted};">${esc(email.footNote)}</p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px 28px; border-top:1px solid ${colors.border}; text-align:center;">
                <p style="margin:0 0 6px; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${colors.foreground};">
                  <a href="tel:${serviceArea.phone.replace(/[^\d+]/g, "")}" style="color:${colors.foreground}; text-decoration:none;">${esc(serviceArea.phone)}</a>
                </p>
                <p style="margin:0 0 14px; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:${colors.muted};">
                  Mobile detailing across the ${esc(serviceArea.region)}
                </p>
                <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:11px; color:${colors.muted};">
                  ${
                    // Required by CAN-SPAM on any promotional mail, and the
                    // thing that keeps the sending domain out of spam folders.
                    unsubscribeUrl
                      ? `<a href="${unsubscribeUrl}" style="color:${colors.muted};">Unsubscribe</a> &nbsp;&middot;&nbsp; `
                      : `<span style="color:#7a2f22;">[unsubscribe link goes here]</span> &nbsp;&middot;&nbsp; `
                  }
                  <a href="${siteUrl}" style="color:${colors.muted};">diamondcleandetail.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** The plain-text alternative. Sending HTML alone is a reliable way into a
 * spam folder, and some people genuinely read mail this way. */
export function renderMarketingText(email: MarketingEmail): string {
  return [
    email.title.toUpperCase(),
    "",
    ...email.body,
    email.callout ? `\n${email.callout.label.toUpperCase()}\n${email.callout.text}` : "",
    "",
    `${email.cta.label}: ${email.cta.href}`,
    "",
    "—",
    `Diamond Clean Detail · ${serviceArea.phone}`,
    `Mobile detailing across the ${serviceArea.region}`,
  ]
    .filter(Boolean)
    .join("\n");
}
