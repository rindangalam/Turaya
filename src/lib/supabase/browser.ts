import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Supabase client for client components (RLS-enforced, anon key).
 * Sessions live in cookies; the browser client manages them automatically.
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookieEncoding: "base64url" },
  );
}
