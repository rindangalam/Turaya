import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Supabase client for src/proxy.ts (Next 16 proxy convention).
 * Cookies are read from the request and written back onto the outgoing
 * response so session refresh survives the request lifecycle.
 */
export function createProxyClient(request: NextRequest) {
  let response = NextResponse.next({ request });

  const client = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookieEncoding: "base64url",
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  return { client, response };
}
