"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { settingsSchema } from "@/lib/validation/admin";
import type { ActionResult } from "@/lib/validation/action-result";

const FIELD_KEYS = [
  "site_name",
  "tagline",
  "contact_email",
  "contact_phone",
  "address",
  "instagram_url",
  "tiktok_url",
  "whatsapp_number",
  "announcement",
] as const;

function clean(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const key of FIELD_KEYS) {
    const value = formData.get(key);
    raw[key] =
      typeof value === "string" && value.trim() === "" ? null : (value ?? null);
  }
  return raw;
}

export async function updateSettings(
  _prev: ActionResult<{ savedAt: string }> | undefined,
  formData: FormData,
): Promise<ActionResult<{ savedAt: string }>> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Data pengaturan tidak ditemukan." };
  }

  const parsed = settingsSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { data: updated, error: updateError } = await supabase
    .from("site_settings")
    .update(parsed.data)
    .eq("id", id)
    .select("id");

  if (updateError || !updated?.length) {
    const { error: insertError } = await supabase
      .from("site_settings")
      .insert({ id, ...parsed.data });

    if (insertError) {
      console.error(`settings: failed to save: ${insertError.message}`);
      return { ok: false, formError: "Pengaturan gagal disimpan. Silakan coba lagi." };
    }
  }

  revalidatePath("/admin/settings");
  return { ok: true, data: { savedAt: new Date().toISOString() } };
}
