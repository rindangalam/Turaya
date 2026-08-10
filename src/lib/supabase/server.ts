import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Supabase client for server components, server actions, and route handlers.
 * Reads the session from the request cookies; RLS-enforced via anon key.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookieEncoding: "base64url",
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component (render phase): cookies can only be
            // set in Server Actions or Route Handlers. Session refresh there is
            // handled by src/proxy.ts instead.
          }
        },
      },
    },
  );
}
