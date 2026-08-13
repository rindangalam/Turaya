"use server";

import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validation/contact";
import type { ActionResult } from "@/lib/validation/action-result";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const submissions: Map<string, number[]> = new Map();

async function clientIp(): Promise<string> {
  const headerStore = await headers();
  const list = headerStore.get("x-forwarded-for") ?? headerStore.get("x-real-ip");
  if (!list) return "unknown";
  return list.split(",")[0].trim();
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (submissions.get(ip) ?? []).filter((timestamp) => timestamp > windowStart);
  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

export async function submitContactMessage(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") raw[key] = value;
  }

  const parsed = contactMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>,
    };
  }

  if (parsed.data.website) {
    return { ok: true };
  }

  if (isRateLimited(await clientIp())) {
    return {
      ok: false,
      formError: "Terlalu banyak permintaan. Silakan coba lagi dalam satu jam.",
    };
  }

  const input: ContactMessageInput = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    subject: input.subject || null,
    message: input.message,
  });

  if (error) {
    console.error(`contact: failed to insert message: ${error.message}`);
    return { ok: false, formError: "Gagal mengirim pesan. Silakan coba lagi." };
  }

  return { ok: true };
}
