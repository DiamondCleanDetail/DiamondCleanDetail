import { NextRequest, NextResponse } from "next/server";
import { lookupGiftBalance } from "@/lib/giftRedemption";

// Read-only balance check for the booking wizard. It never reserves or spends
// anything — the authoritative apply happens in /api/booking/start, which
// re-checks and decrements. This just lets the form show "−$X applied" before
// the customer commits.
export async function POST(req: NextRequest) {
  let body: { code?: unknown };
  try {
    body = (await req.json()) as { code?: unknown };
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code : "";
  if (!code.trim()) {
    return NextResponse.json({ valid: false });
  }

  const card = await lookupGiftBalance(code);
  if (!card) {
    return NextResponse.json({ valid: false });
  }
  return NextResponse.json({ valid: true, balanceCents: card.balanceCents });
}
