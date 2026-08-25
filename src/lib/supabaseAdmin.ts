import { createClient } from "@supabase/supabase-js";

// Server-only client using the service_role key — bypasses RLS.
// Never import this from a "use client" component.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase env vars (URL or service role key).");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
