import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export type Role = "super_admin" | "admin" | "editor";

export type SessionUser = {
  id: string;
  email: string | undefined;
  displayName: string | undefined;
  role: Role;
};

const STAFF_ROLES: Role[] = ["super_admin", "admin", "editor"];

function isStaffRole(value: string | null | undefined): value is Role {
  return value != null && (STAFF_ROLES as string[]).includes(value);
}

/**
 * Current authenticated user + profile role, fetched once per request.
 * Returns null when unauthenticated. Use in server components/actions/route
 * handlers — never trust a client-side auth state for authorization.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role;
  if (!isStaffRole(role)) return null;

  return {
    id: user.id,
    email: user.email ?? undefined,
    displayName: profile?.display_name ?? undefined,
    role,
  };
});
