"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormSelect,
  type FieldErrors,
} from "@/features/admin/shared/form-field";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import type { ActionResult } from "@/lib/validation/action-result";
import type { Category } from "@/services/categories";

const STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: status[0].toUpperCase() + status.slice(1),
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
      toast.success(category ? "Category saved" : "Category created");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, category]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Identity and publishing settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            errors={errors}
            name="name"
            label="Name"
            defaultValue={category?.name}
            required
          />
          <FormField
            errors={errors}
            name="slug"
            label="Slug"
            defaultValue={category?.slug}
            required
            description="Used in the category URL. Lowercase, hyphens."
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
              label="Description"
              defaultValue={category?.description}
              multiline
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
