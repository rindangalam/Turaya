"use client";

import { useActionState, useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/features/admin/shared/form-field";
import { inviteUser } from "./actions";

export function InviteUserForm() {
  const [state, formAction, pending] = useActionState(inviteUser, undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      toast.success("Pengguna berhasil dibuat");
      window.setTimeout(() => setOpen(false), 0);
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state]);

  const errors = state?.ok ? {} : (state?.fieldErrors ?? {});

  if (!open) {
    return (
      <Button size="sm" render={<button type="button" onClick={() => setOpen(true)} />}>
        <PlusIcon className="size-4" aria-hidden="true" />
        Pengguna baru
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Pengguna</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <FormField
            errors={errors}
            name="email"
            label="Email"
            required
          />
          <FormField
            errors={errors}
            name="password"
            label="Password"
            description="Minimal 6 karakter."
            required
          />
          <FormField
            errors={errors}
            name="display_name"
            label="Nama Tampilan"
          />
          <div className="grid gap-1.5">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue="editor"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Membuat…" : "Buat Pengguna"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
