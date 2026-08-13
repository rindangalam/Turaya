"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField, FormSelect } from "@/features/admin/shared/form-field";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { getStoragePublicUrl } from "@/lib/storage";
import type { ActionResult } from "@/lib/validation/action-result";
import type { GalleryItem } from "@/services/gallery";

const STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: status[0].toUpperCase() + status.slice(1),
}));

export function GalleryForm({
  action,
  item,
  categories,
  submitLabel,
}: {
  action: (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
  item?: GalleryItem | null;
  categories: string[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(item ? "Gallery item saved" : "Gallery item created");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, item]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Image</CardTitle>
          <CardDescription>
            JPEG, PNG, WebP or AVIF, up to 8 MB.{item ? " Replace the image to swap it." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {item ? (
            <Image
              src={getStoragePublicUrl("gallery", item.path)}
              alt={item.alt}
              width={480}
              height={320}
              className="w-full max-w-96 rounded-lg border border-border object-cover"
            />
          ) : null}
          <div className="grid gap-1.5">
            <Label htmlFor="gallery-image">{item ? "Replace image" : "Upload image"}</Label>
            <input
              id="gallery-image"
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>How this image is described on the public gallery.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField
              errors={errors}
              name="alt"
              label="Alt text"
              defaultValue={item?.alt}
              required
              description="Describes the image for screen readers and search engines."
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              errors={errors}
              name="caption"
              label="Caption"
              defaultValue={item?.caption}
              description="Optional editorial caption shown with the image."
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="gallery-category">Category</Label>
            <Input
              id="gallery-category"
              name="category"
              defaultValue={item?.category ?? ""}
              list="gallery-category-options"
              aria-invalid={!!errors.category?.[0]}
              aria-describedby={errors.category?.[0] ? "gallery-category-error" : undefined}
              placeholder="e.g. atelier, materials, campaign"
            />
            <datalist id="gallery-category-options">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            {errors.category?.[0] ? (
              <p id="gallery-category-error" className="text-sm text-destructive" role="alert">
                {errors.category[0]}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Existing categories are suggested; you can type a new one.
              </p>
            )}
          </div>
          <FormSelect
            id="gallery-status"
            name="status"
            label="Status"
            defaultValue={item?.status ?? "draft"}
            options={STATUS_OPTIONS}
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

type FieldErrors = Record<string, string[] | undefined>;
