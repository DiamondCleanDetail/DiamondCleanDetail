import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { SITE_ACCESS_COOKIE, hashPassphrase, isGateEnabled } from "@/lib/siteAccess";

/** Local preview escape hatch.
 *
 * Clerk's middleware runs on every route, so without real keys `next dev`
 * cannot render a single page — it redirects to Clerk's handshake and dies on
 * "Invalid host". That makes it impossible to eyeball a copy or layout change
 * locally unless you have the auth keys to hand, which is a silly thing to
 * need in order to look at the marketing pages.
 *
 * With LOCAL_PREVIEW_NO_AUTH=true in .env.local, Clerk sits out the middleware
 * and the site renders signed-out: nav shows neither the sign-in button nor the
 * avatar, and /account, /admin, /booking checkout stay broken. It is for
 * looking at pages, nothing more.
 *
 * Deliberately also gated on NODE_ENV, so `next build`/`next start` and every
 * deploy ignore the flag entirely — setting it in Vercel by accident cannot
 * turn auth off in production. */
const localPreviewNoAuth =
  process.env.NODE_ENV === "development" && process.env.LOCAL_PREVIEW_NO_AUTH === "true";

async function siteGate(req: NextRequest) {
  if (!isGateEnabled()) return NextResponse.next();

  const { pathname } = req.nextUrl;

  const isAsset = /\.[a-zA-Z0-9]+$/.test(pathname); // images, fonts, video, etc.
  if (
    isAsset ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/coming-soon" ||
    // Legal pages stay reachable behind the gate: Google's OAuth consent
    // screen links to the privacy policy and needs to resolve it.
    pathname === "/privacy"
  ) {
    return NextResponse.next();
  }

  const passphrase = process.env.SITE_UNLOCK_PASSPHRASE;
  if (!passphrase) return NextResponse.next(); // gate misconfigured — fail open, not closed

  const expected = await hashPassphrase(passphrase);
  const cookie = req.cookies.get(SITE_ACCESS_COOKIE)?.value;

  if (cookie === expected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  return NextResponse.redirect(url);
}

export const proxy = localPreviewNoAuth
  ? siteGate
  : clerkMiddleware(async (_auth, req) => siteGate(req));

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
