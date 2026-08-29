import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { SITE_ACCESS_COOKIE, hashPassphrase, isGateEnabled } from "@/lib/siteAccess";

export const proxy = clerkMiddleware(async (_auth, req) => {
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
});

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
