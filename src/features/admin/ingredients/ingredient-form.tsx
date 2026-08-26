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
import type { Ingredient } from "@/services/ingredients";

const STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: contentStatusLabel(status),
}));

export function IngredientForm({
  action,
  ingredient,
  submitLabel,
}: {
  action: (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
  ingredient?: Ingredient | null;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(ingredient ? "Bahan tersimpan" : "Bahan dibuat");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, ingredient]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <DirtyGuard />
      {ingredient ? <input type="hidden" name="id" value={ingredient.id} /> : null}

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
            defaultValue={ingredient?.name}
            required
          />
          <AutoSlugInput
            sourceId="field-name"
            id="field-slug"
            name="slug"
            label="Slug"
            defaultValue={ingredient?.slug}
            description="Dipakai pada URL bahan. Huruf kecil, tanpa spasi."
            error={errors.slug?.[0]}
          />
          <FormField
            errors={errors}
            name="origin"
            label="Asal"
            defaultValue={ingredient?.origin}
            description="Asal-usul, mis. Nusa Tenggara Timur."
          />
          <FormSelect
            id="ingredient-status"
            name="status"
            label="Status"
            defaultValue={ingredient?.status ?? "published"}
            options={STATUS_OPTIONS}
          />
          <div className="md:col-span-2">
            <FormField
              errors={errors}
              name="image_path"
              label="Path gambar"
              defaultValue={ingredient?.image_path}
              description="Path penyimpanan di dalam bucket branding."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Konten</CardTitle>
          <CardDescription>Konten editorial untuk halaman bahan.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <FormField
            errors={errors}
            name="description"
            label="Deskripsi"
            defaultValue={ingredient?.description}
            multiline
            description="Deskripsi sensorik dan faktual."
          />
          <FormField
            errors={errors}
            name="story"
            label="Cerita"
            defaultValue={ingredient?.story}
            multiline
          />
        </CardContent>
      </Card>

      <FormActions pending={pending} submitLabel={submitLabel} />
    </form>
  );
}
