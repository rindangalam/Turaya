import "server-only";

import { redirect } from "next/navigation";

import { getSessionUser, type Role, type SessionUser } from "@/lib/auth/session";

/**
 * Authorization guards for server components, server actions, and route
 * handlers. They throw a redirect rather than returning a value so callers
 * can't forget to check. The database (RLS) remains the authority; these
 * guards enforce route/action-level boundaries.
 */

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(allowed: Role[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowed.includes(user.role)) {
    redirect("/admin");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  return requireRole(["admin", "super_admin"]);
}

export async function requireSuperAdmin(): Promise<SessionUser> {
  return requireRole(["super_admin"]);
}
