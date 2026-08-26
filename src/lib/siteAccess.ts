export const SITE_ACCESS_COOKIE = "dcd_access";
export const ADMIN_ACCESS_COOKIE = "dcd_admin_access";
export const SITE_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // ~6 months

/** Works in both the Node.js and Edge runtimes — no `Buffer`, no `node:crypto`. */
export async function hashPassphrase(passphrase: string): Promise<string> {
  const data = new TextEncoder().encode(passphrase);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isGateEnabled(): boolean {
  return process.env.SITE_GATE_ENABLED !== "false";
}
