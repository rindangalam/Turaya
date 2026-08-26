"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { messageStatusSchema } from "@/lib/validation/admin";
import type { ActionResult } from "@/lib/validation/action-result";
import type { MessageStatus } from "@/services/messages";

export async function updateMessageStatus(
  _prev: ActionResult<{ status: MessageStatus }> | undefined,
  formData: FormData,
): Promise<ActionResult<{ status: MessageStatus }>> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  const parsedStatus = messageStatusSchema.safeParse(status);
  if (!parsedStatus.success || !id) {
    return { ok: false, formError: "Permintaan tidak valid." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status: parsedStatus.data })
    .eq("id", id)
    .select("status")
    .single();

  if (error || !data) {
    console.error(`messages: failed to update ${id}: ${error?.message ?? "no row returned"}`);
    return { ok: false, formError: "Pesan gagal diperbarui. Silakan coba lagi." };
  }

  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
  return { ok: true, data: { status: data.status } };
}
