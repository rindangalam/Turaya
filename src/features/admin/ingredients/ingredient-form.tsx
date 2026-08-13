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
import type { Ingredient } from "@/services/ingredients";

const STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: status[0].toUpperCase() + status.slice(1),
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
      toast.success(ingredient ? "Ingredient saved" : "Ingredient created");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, ingredient]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {ingredient ? <input type="hidden" name="id" value={ingredient.id} /> : null}

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
            defaultValue={ingredient?.name}
            required
          />
          <FormField
            errors={errors}
            name="slug"
            label="Slug"
            defaultValue={ingredient?.slug}
            required
            description="Used in the ingredient URL. Lowercase, hyphens."
          />
          <FormField
            errors={errors}
            name="origin"
            label="Origin"
            defaultValue={ingredient?.origin}
            description="Provenance, e.g. Nusa Tenggara Timur."
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
              label="Image path"
              defaultValue={ingredient?.image_path}
              description="Storage path inside the branding bucket."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Copy</CardTitle>
          <CardDescription>Editorial content for the ingredient page.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <FormField
            errors={errors}
            name="description"
            label="Description"
            defaultValue={ingredient?.description}
            multiline
            description="Sensory and factual description."
          />
          <FormField
            errors={errors}
            name="story"
            label="Story"
            defaultValue={ingredient?.story}
            multiline
          />
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
