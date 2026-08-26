"use server";

import { revalidatePath } from "next/cache";

import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/validation/action-result";

export async function inviteUser(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireSuperAdmin();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim() || null;
  const role = String(formData.get("role") ?? "editor");

  if (!email) {
    return { ok: false, fieldErrors: { email: ["Email wajib diisi."] } };
  }
  if (!password || password.length < 6) {
    return {
      ok: false,
      fieldErrors: { password: ["Password minimal 6 karakter."] },
    };
  }
  if (!["editor", "admin", "super_admin"].includes(role)) {
    return { ok: false, formError: "Role tidak valid." };
  }

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });

  if (error) {
    if (error.message?.includes("already")) {
      return {
        ok: false,
        fieldErrors: { email: ["Email sudah terdaftar."] },
      };
    }
    console.error(`users: failed to create: ${error.message}`);
    return { ok: false, formError: "Gagal membuat pengguna. Silakan coba lagi." };
  }

  if (role !== "editor" && data.user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- set_user_role exists in migration 000009 but types not yet regenerated
    await (admin as any).rpc("set_user_role", {
      target_id: data.user.id,
      new_role: role,
    });
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateUserRole(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireSuperAdmin();

  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!id) {
    return { ok: false, formError: "Pengguna tidak ditemukan." };
  }
  if (!["editor", "admin", "super_admin"].includes(role)) {
    return { ok: false, formError: "Role tidak valid." };
  }

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- set_user_role exists in migration 000009 but types not yet regenerated
  const { error } = await (admin as any).rpc("set_user_role", {
    target_id: id,
    new_role: role,
  });

  if (error) {
    console.error(`users: failed to update role ${id}: ${error.message}`);
    return { ok: false, formError: "Gagal mengubah role. Silakan coba lagi." };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function removeUser(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireSuperAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Pengguna tidak ditemukan." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) {
    console.error(`users: failed to delete ${id}: ${error.message}`);
    return { ok: false, formError: "Gagal menghapus pengguna. Silakan coba lagi." };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}
