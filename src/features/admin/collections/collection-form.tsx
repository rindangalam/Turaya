"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormCheckbox,
  FormField,
  FormSelect,
  type FieldErrors,
} from "@/features/admin/shared/form-field";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import type { ActionResult } from "@/lib/validation/action-result";
import type { Collection, CollectionProduct } from "@/services/collections";
import { ProductsEditor } from "@/features/admin/collections/products-editor";

const STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: status[0].toUpperCase() + status.slice(1),
}));

export function CollectionForm({
  action,
  collection,
  products,
  assignable,
  submitLabel,
}: {
  action: (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
  collection?: Collection | null;
  products?: CollectionProduct[];
  assignable: { id: string; name: string }[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(collection ? "Collection saved" : "Collection created");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, collection]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {collection ? <input type="hidden" name="id" value={collection.id} /> : null}

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
            defaultValue={collection?.name}
            required
          />
          <FormField
            errors={errors}
            name="slug"
            label="Slug"
            defaultValue={collection?.slug}
            required
            description="Used in the collection URL. Lowercase, hyphens."
          />
          <FormSelect
            id="collection-status"
            name="status"
            label="Status"
            defaultValue={collection?.status ?? "draft"}
            options={STATUS_OPTIONS}
          />
          <FormCheckbox
            name="featured"
            label="Featured collection"
            defaultChecked={collection?.featured ?? false}
            description="Featured collections are highlighted on the public site."
          />
          <div className="md:col-span-2">
            <FormField
              errors={errors}
              name="cover_image_path"
              label="Cover image path"
              defaultValue={collection?.cover_image_path}
              description="Storage path inside the branding bucket."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Copy</CardTitle>
          <CardDescription>Editorial content for the collection page.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <FormField
            errors={errors}
            name="description"
            label="Description"
            defaultValue={collection?.description}
            multiline
          />
          <FormField
            errors={errors}
            name="story"
            label="Story"
            defaultValue={collection?.story}
            multiline
            description="Long-form brand narrative."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Products in this collection. Order here controls how they appear.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsEditor products={assignable} initial={products ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Search metadata for this collection.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <FormField
            errors={errors}
            name="seo_title"
            label="SEO title"
            defaultValue={collection?.seo_title}
          />
          <FormField
            errors={errors}
            name="seo_description"
            label="SEO description"
            defaultValue={collection?.seo_description}
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
