"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AutoSlugInput } from "@/components/admin/auto-slug-input";
import { DirtyGuard } from "@/components/admin/dirty-guard";
import { FormActions } from "@/components/admin/form-actions";
import {
  FormField,
  FormSelect,
  type FieldErrors,
} from "@/features/admin/shared/form-field";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { contentStatusLabel } from "@/lib/labels";
import type { ActionResult } from "@/lib/validation/action-result";
import type { Category } from "@/services/categories";

const STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: contentStatusLabel(status),
}));

export function CategoryForm({
  action,
  category,
  submitLabel,
}: {
  action: (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
  category?: Category | null;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(category ? "Kategori tersimpan" : "Kategori dibuat");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, category]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <DirtyGuard />
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Detail</CardTitle>
          <CardDescription>Identitas dan pengaturan publikasi.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            errors={errors}
            name="name"
            label="Nama"
            defaultValue={category?.name}
            required
          />
          <AutoSlugInput
            sourceId="field-name"
            id="field-slug"
            name="slug"
            label="Slug"
            defaultValue={category?.slug}
            description="Dipakai pada URL kategori. Huruf kecil, tanpa spasi."
            error={errors.slug?.[0]}
          />
          <FormSelect
            id="category-status"
            name="status"
            label="Status"
            defaultValue={category?.status ?? "published"}
            options={STATUS_OPTIONS}
          />
          <div className="md:col-span-2">
            <FormField
              errors={errors}
              name="description"
              label="Deskripsi"
              defaultValue={category?.description}
              multiline
            />
          </div>
        </CardContent>
      </Card>

      <FormActions pending={pending} submitLabel={submitLabel} />
    </form>
  );
}
