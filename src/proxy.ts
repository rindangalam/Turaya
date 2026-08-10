import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createProxyClient } from "@/lib/supabase/proxy";

const STAFF_ROLES = ["super_admin", "admin", "editor"] as const;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { client, response } = createProxyClient(request);

  // Refresh the session (validates JWT; rotates when close to expiry).
  const {
    data: { user },
  } = await client.auth.getUser();

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }

    // All authenticated users are staff; enforce the role defensively.
    const { data: profile } = await client
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role;
    if (!role || !(STAFF_ROLES as readonly string[]).includes(role)) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }

    if (pathname.startsWith("/admin/users") && !["admin", "super_admin"].includes(role)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except the ones starting with:
     * - _next/static, _next/image (static assets / image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
