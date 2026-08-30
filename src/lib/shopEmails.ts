import { resendClient, EMAIL_FROM } from "@/lib/resend";
import { serviceArea } from "@/data/serviceArea";

// A light email shell on purpose: several clients (Gmail especially) drop a
// dark <body> background and repaint on white, which is what made the old
// wordmark vanish. Dark text on a white card is the one thing every client
// renders the same, so the shop's transactional mail uses it.

const siteUrl = "https://diamondcleandetail.com";

const colors = {
  background: "#eef0f2",
  surface: "#ffffff",
  surface2: "#f5f6f7",
  foreground: "#0f1012",
  muted: "#54575e",
  border: "#e4e6ea",
  accent: "#111214",
};

export type ShopLine = {
  name: string;
  qty: number;
  unitCents: number;
  kind: "supply" | "gift-card";
};

export type ShopShipping = {
  name?: string | null;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export type IssuedGiftCard = { code: string; amountCents: number };

export type ShopOrder = {
  customerName: string | null;
  customerEmail: string | null;
  items: ShopLine[];
  giftCards: IssuedGiftCard[];
  shipping: ShopShipping | null;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  /** Stripe session id, for the owner to reconcile against the dashboard. */
  reference: string;
};

function money(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function itemRows(items: ShopLine[]): string {
  return items
    .map(
      (i, idx) => `
      <tr>
        <td style="padding:12px 0; border-top:${idx === 0 ? "none" : `1px solid ${colors.border}`}; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:${colors.foreground};">
          ${esc(i.name)}${i.qty > 1 ? ` <span style="color:${colors.muted};">&times; ${i.qty}</span>` : ""}
        </td>
        <td style="padding:12px 0; border-top:${idx === 0 ? "none" : `1px solid ${colors.border}`}; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:${colors.foreground}; text-align:right; white-space:nowrap;">
          ${money(i.unitCents * i.qty)}
        </td>
      </tr>`
    )
    .join("");
}

function totalsRows(order: ShopOrder): string {
  const line = (label: string, value: string, bold = false) => `
    <tr>
      <td style="padding:4px 0; font-family:Arial,Helvetica,sans-serif; font-size:${bold ? "16px" : "13px"}; color:${bold ? colors.foreground : colors.muted}; ${bold ? "font-weight:700;" : ""}">${esc(label)}</td>
      <td style="padding:4px 0; font-family:Arial,Helvetica,sans-serif; font-size:${bold ? "16px" : "13px"}; color:${bold ? colors.foreground : colors.muted}; ${bold ? "font-weight:700;" : ""} text-align:right;">${esc(value)}</td>
    </tr>`;
  return (
    line("Subtotal", money(order.subtotalCents)) +
    (order.shippingCents > 0 ? line("Shipping", money(order.shippingCents)) : "") +
    line("Total", money(order.totalCents), true)
  );
}

function giftCardsBlock(cards: IssuedGiftCard[]): string {
  if (cards.length === 0) return "";
  const rows = cards
    .map(
      (c) => `
      <tr>
        <td style="padding:10px 14px; font-family:'Courier New',monospace; font-size:18px; letter-spacing:0.06em; color:${colors.foreground};">${esc(c.code)}</td>
        <td style="padding:10px 14px; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:${colors.muted}; text-align:right;">${money(c.amountCents)}</td>
      </tr>`
    )
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px; background:${colors.surface2}; border:1px solid ${colors.border}; border-radius:12px; overflow:hidden;">
      <tr><td colspan="2" style="padding:14px 14px 4px; font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${colors.muted};">Your gift card${cards.length > 1 ? "s" : ""}</td></tr>
      ${rows}
      <tr><td colspan="2" style="padding:4px 14px 14px; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:1.6; color:${colors.muted};">Mention the code when you book and we'll apply the balance to your service.</td></tr>
    </table>`;
}

function shippingBlock(shipping: ShopShipping | null): string {
  if (!shipping || !shipping.line1) return "";
  const parts = [
    shipping.name,
    shipping.line1,
    shipping.line2,
    [shipping.city, shipping.state, shipping.postalCode].filter(Boolean).join(", "),
    shipping.country,
  ].filter(Boolean) as string[];
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px; background:${colors.surface2}; border:1px solid ${colors.border}; border-radius:12px;">
      <tr><td style="padding:14px 14px 6px; font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${colors.muted};">Ship to</td></tr>
      <tr><td style="padding:0 14px 14px; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:${colors.foreground};">${parts.map(esc).join("<br />")}</td></tr>
    </table>`;
}

function shell(opts: { eyebrow: string; title: string; intro: string; body: string }): string {
  return `<!doctype html>
<html>
  <body style="margin:0; padding:0; background:${colors.background};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.background}; padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%; background:${colors.surface}; border:1px solid ${colors.border}; border-radius:16px; overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px; text-align:center; border-bottom:1px solid ${colors.border};">
              <img src="${siteUrl}/brand/logo.png" width="36" height="36" alt="" style="display:block; margin:0 auto 14px;" />
              <img src="${siteUrl}/brand/wordmark-dark.png" width="206" height="21" alt="Diamond Clean Detail" style="display:block; margin:0 auto; max-width:206px;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 6px; font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${colors.muted};">${esc(opts.eyebrow)}</p>
              <h1 style="margin:0 0 16px; font-family:Arial,Helvetica,sans-serif; font-size:24px; font-weight:700; color:${colors.foreground};">${esc(opts.title)}</h1>
              <p style="margin:0 0 24px; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:${colors.muted};">${esc(opts.intro)}</p>
              ${opts.body}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px; border-top:1px solid ${colors.border}; text-align:center;">
              <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:${colors.muted};">
                Diamond Clean Detail · ${serviceArea.region}<br />
                <a href="tel:${serviceArea.phoneHref}" style="color:${colors.foreground}; text-decoration:none;">${serviceArea.phone}</a>
                &nbsp;·&nbsp;
                <a href="mailto:${serviceArea.email}" style="color:${colors.foreground}; text-decoration:none;">${serviceArea.email}</a>
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function orderTable(order: ShopOrder): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      ${itemRows(order.items)}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${colors.border}; margin-top:8px; padding-top:8px;">
      ${totalsRows(order)}
    </table>`;
}

// Same reason as bookingEmails: Resend reports failures in the response body,
// not by throwing, so a bare catch would miss a rejected key or recipient.
function report(label: string, res: { error?: unknown; data?: { id?: string } | null } | void) {
  if (!res) return;
  if (res.error) {
    console.error(`Resend rejected the ${label}:`, res.error);
    return;
  }
  console.log(`Sent ${label} (${res.data?.id ?? "no id"})`);
}

/** Emails the owner (always) and the customer (if we have their address).
 * Never throws — the payment already succeeded, so a failed email is logged,
 * not surfaced. */
export async function sendShopEmails(order: ShopOrder): Promise<void> {
  const resend = resendClient();
  if (!resend) {
    console.error("RESEND_API_KEY not configured — skipping shop emails.");
    return;
  }

  const hasGift = order.giftCards.length > 0;
  const hasPhysical = order.items.some((i) => i.kind === "supply");

  const ownerBody =
    orderTable(order) +
    (order.shipping ? shippingBlock(order.shipping) : "") +
    (hasGift
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">${order.giftCards
          .map(
            (c) =>
              `<tr><td style="padding:6px 0; font-family:'Courier New',monospace; font-size:15px; color:${colors.foreground};">${esc(c.code)}</td><td style="padding:6px 0; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${colors.muted}; text-align:right;">${money(c.amountCents)} issued</td></tr>`
          )
          .join("")}</table>`
      : "");

  const ownerSend = resend.emails
    .send({
      from: EMAIL_FROM,
      to: process.env.OWNER_NOTIFICATION_EMAIL || serviceArea.email,
      subject: `New shop order — ${money(order.totalCents)}${hasPhysical ? " (to ship)" : ""}`,
      html: shell({
        eyebrow: "Staff Alert",
        title: "New Shop Order",
        intro: `${order.customerName || "A customer"}${order.customerEmail ? ` (${order.customerEmail})` : ""} just checked out.${hasPhysical ? " Ship the physical items to the address below." : ""}${hasGift ? " Gift card codes issued below — honor these when booked." : ""}`,
        body: ownerBody,
      }),
      text: `New shop order — ${money(order.totalCents)}\nRef: ${order.reference}\n\n${order.items.map((i) => `- ${i.name} x${i.qty} — ${money(i.unitCents * i.qty)}`).join("\n")}\n${order.giftCards.map((c) => `Gift code ${c.code} — ${money(c.amountCents)}`).join("\n")}`,
    })
    .then((res) => report("owner shop alert", res))
    .catch((err) => console.error("Failed to send owner shop alert:", err));

  const customerSend = order.customerEmail
    ? resend.emails
        .send({
          from: EMAIL_FROM,
          to: order.customerEmail,
          subject: "Your Diamond Clean Detail order",
          html: shell({
            eyebrow: "Order Confirmation",
            title: "Thanks for your order!",
            intro: `Thanks${order.customerName ? `, ${order.customerName}` : ""} — here's your receipt.${hasPhysical ? " Your items are on their way." : ""}`,
            body: giftCardsBlock(order.giftCards) + orderTable(order),
          }),
          text: `Thanks for your order!\n\n${order.items.map((i) => `- ${i.name} x${i.qty} — ${money(i.unitCents * i.qty)}`).join("\n")}\nTotal: ${money(order.totalCents)}\n${order.giftCards.map((c) => `Gift card: ${c.code} (${money(c.amountCents)})`).join("\n")}`,
        })
        .then((res) => report("customer order receipt", res))
        .catch((err) => console.error("Failed to send customer order receipt:", err))
    : Promise.resolve();

  await Promise.all([ownerSend, customerSend]);
}
