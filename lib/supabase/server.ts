import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service_role key.
 * Never import this from a Client Component — the `server-only` package
 * makes any such attempt fail at build time.
 *
 * Every table has RLS enabled with no policies, so the service_role key
 * (which bypasses RLS) is the only way anything in this app reads/writes
 * data. Nothing public-facing ever touches Supabase directly.
 */
// No generated Database type exists for this project, so the client is
// created with an explicit `any` schema generic. Without it, recent
// @supabase/supabase-js versions infer .insert()/.update() payloads as
// `never` rather than falling back to a permissive type. Row shapes are
// still fully typed at the call sites in lib/db/* via each module's own
// Row interfaces and mapping functions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- see note above: `any` restores permissive .insert()/.update() typing without a generated Database type
let cachedClient: ReturnType<typeof createClient<any>> | null = null;

export function getSupabaseAdmin() {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. Copy .env.local.example to .env.local and fill in real values."
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see note above
  cachedClient = createClient<any>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedClient;
}
