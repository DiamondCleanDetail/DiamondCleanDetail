import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ACCESS_COOKIE, SITE_ACCESS_MAX_AGE_SECONDS, hashPassphrase } from "@/lib/siteAccess";

export async function POST(req: NextRequest) {
  const { passphrase } = (await req.json()) as { passphrase?: string };
  const expectedPassphrase = process.env.ADMIN_UNLOCK_PASSPHRASE;

  if (!expectedPassphrase || !passphrase || passphrase !== expectedPassphrase) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_ACCESS_COOKIE, await hashPassphrase(expectedPassphrase), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: SITE_ACCESS_MAX_AGE_SECONDS,
  });
  return res;
}
