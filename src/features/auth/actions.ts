"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { writeAudit } from "@/lib/auth/audit";
import {
  clearLoginFailures,
  loginRateLimit,
  recordLoginFailure,
} from "@/lib/auth/rate-limit";
import { getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = { error?: string } | undefined;

const GENERIC_ERROR = "Invalid credentials.";

function clientIp() {
  // Supabase local/self-hosted & Vercel convention: forwarded for header.
  return headers().then((h) => h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null);
}

function safeNextPath(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  return value;
}

export async function login(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!email || !password) {
    return { error: GENERIC_ERROR };
  }

  const ip = await clientIp();

  const limit = loginRateLimit(email, ip);
  if (!limit.allowed) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    recordLoginFailure(email, ip);
    await writeAudit({
      action: "auth.login_failed",
      resource: "auth",
      metadata: { email },
    });
    return { error: GENERIC_ERROR };
  }

  clearLoginFailures(email, ip);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await writeAudit({
    action: "auth.login",
    actorId: user?.id ?? null,
    resource: "auth",
    resourceId: user?.id ?? null,
    metadata: { email },
  });

  redirect(next ?? "/admin");
}

export async function logout() {
  const user = await getSessionUser();
  if (user) {
    await writeAudit({
      action: "auth.logout",
      actorId: user.id,
      resource: "auth",
      resourceId: user.id,
    });
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/");
}

export async function sendPasswordReset(
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Enter your email address." };
  }

  const supabase = await createClient();

  // Always succeed (or return a neutral error) so the endpoint cannot be
  // used to enumerate registered emails.
  const origin = (await headers()).get("origin") ?? "http://127.0.0.1:3000";
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm`,
  });

  return undefined;
}

export async function updatePassword(
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Could not update the password. Try again." };
  }

  redirect("/admin");
}
