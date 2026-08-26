"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { seoMetadataSchema } from "@/lib/validation/admin";
import type { ActionResult } from "@/lib/validation/action-result";

const FIELD_KEYS = ["title", "description", "canonical_url", "og_image_path", "robots"] as const;

function clean(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const key of FIELD_KEYS) {
    const value = formData.get(key);
    raw[key] =
      typeof value === "string" && value.trim() === "" ? null : (value ?? null);
  }
  return raw;
}

export async function updateSeoMetadata(
  _prev: ActionResult<{ savedAt: string }> | undefined,
  formData: FormData,
): Promise<ActionResult<{ savedAt: string }>> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Data SEO tidak ditemukan." };
  }

  const parsed = seoMetadataSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: updated, error: updateError } = await supabase
    .from("seo_metadata")
    .update(parsed.data)
    .eq("id", id)
    .select("id");

  if (updateError || !updated?.length) {
    const { error: insertError } = await supabase
      .from("seo_metadata")
      .insert({ id, page: String(formData.get("page") ?? ""), ...parsed.data });

    if (insertError) {
      console.error(`seo: failed to save ${id}: ${insertError.message}`);
      return { ok: false, formError: "Data SEO gagal disimpan. Silakan coba lagi." };
    }
  }

  revalidatePath("/admin/seo");
  return { ok: true, data: { savedAt: new Date().toISOString() } };
}
