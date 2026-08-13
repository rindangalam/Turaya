"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/validation/action-result";
import { getStoragePublicUrl } from "@/lib/storage";
import { PRODUCT_STATUSES } from "@/lib/validation/product";
import type { Product, ProductImage, ProductNote } from "@/services/products";
import { NotesEditor } from "@/features/admin/products/notes-editor";

type FieldErrors = Record<string, string[] | undefined>;

type Option = { id: string; name: string };

function ProductField({
  errors,
  name,
  label,
  defaultValue,
  description,
  multiline = false,
  required = false,
}: {
  errors: FieldErrors;
  name: string;
  label: string;
  defaultValue?: string | null;
  description?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  const id = `product-${name}`;
  const error = errors[name]?.[0];
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea
          id={id}
          name={name}
          defaultValue={defaultValue ?? ""}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        />
      ) : (
        <Input
          id={id}
          name={name}
          defaultValue={defaultValue ?? ""}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  defaultValue,
  options,
  emptyLabel,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | null;
  options: Option[];
  emptyLabel: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ProductForm({
  action,
  product,
  images,
  categories,
  collections,
  ingredients,
  notes,
  submitLabel,
}: {
  action: (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
  product?: Product | null;
  images?: ProductImage[];
  categories: Option[];
  collections: Option[];
  ingredients: Option[];
  notes?: ProductNote[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(product ? "Product saved" : "Product created");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, product]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Core product information shown in catalog listings.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <ProductField
              errors={errors}
              name="name"
              label="Name"
              defaultValue={product?.name}
              required
            />
          </div>
          <ProductField
            errors={errors}
            name="slug"
            label="Slug"
            defaultValue={product?.slug}
            required
            description="Used in the product URL. Lowercase, hyphens."
          />
          <ProductField
            errors={errors}
            name="size"
            label="Size"
            defaultValue={product?.size}
            description="e.g. 50 ml, 100 ml."
          />
          <div className="md:col-span-2">
            <ProductField
              errors={errors}
              name="tagline"
              label="Tagline"
              defaultValue={product?.tagline}
              description="One-line essence of the fragrance."
            />
          </div>
          <SelectField
            id="product-category"
            name="category_id"
            label="Category"
            defaultValue={product?.category_id}
            options={categories}
            emptyLabel="No category"
          />
          <SelectField
            id="product-collection"
            name="collection_id"
            label="Collection"
            defaultValue={product?.collection_id}
            options={collections}
            emptyLabel="No collection"
          />
          <ProductField
            errors={errors}
            name="price"
            label="Price"
            defaultValue={product?.price != null ? String(product.price) : null}
            description="Numbers only, up to 2 decimals. Leave blank for no price."
          />
          <div className="grid gap-1.5">
            <Label htmlFor="product-status">Status</Label>
            <select
              id="product-status"
              name="status"
              defaultValue={product?.status ?? "draft"}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            >
              {PRODUCT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status[0].toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="size-4 accent-foreground"
            />
            Featured product
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Copy</CardTitle>
          <CardDescription>Editorial content for the product page.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <ProductField
            errors={errors}
            name="description"
            label="Description"
            defaultValue={product?.description}
            multiline
            description="Short editorial summary shown in listings and overviews."
          />
          <ProductField
            errors={errors}
            name="story"
            label="Story"
            defaultValue={product?.story}
            multiline
            description="Long-form fragrance narrative."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fragrance notes</CardTitle>
          <CardDescription>
            Build the fragrance pyramid — top, heart and base notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotesEditor ingredients={ingredients} initial={notes ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>
            JPEG, PNG or WebP, up to 5 MB each, at most {images && images.length > 0 ? "5 new" : "5"} at a time.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {images && images.length > 0 ? (
            <>
              {images.map((image, index) => (
                <div key={image.id} className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row">
                  <Image
                    src={getStoragePublicUrl("products", image.path)}
                    alt={image.alt}
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 rounded-md object-cover"
                  />
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <input type="hidden" name={`existing_image_id_${index}`} value={image.id} />
                    <input type="hidden" name={`existing_image_path_${index}`} value={image.path} />
                    <div className="grid gap-1.5">
                      <Label htmlFor={`image-alt-${image.id}`}>Alt text</Label>
                      <Input
                        id={`image-alt-${image.id}`}
                        name={`alt_${index}`}
                        defaultValue={image.alt}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor={`image-caption-${image.id}`}>Caption</Label>
                      <Input
                        id={`image-caption-${image.id}`}
                        name={`caption_${index}`}
                        defaultValue={image.caption ?? ""}
                      />
                    </div>
                  </div>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      name={`remove_${index}`}
                      className="mt-0.5 size-4 accent-foreground"
                    />
                    Remove
                  </label>
                </div>
              ))}
              <input type="hidden" name="existing_count" value={images.length} />
            </>
          ) : null}
          <div className="grid gap-1.5">
            <Label htmlFor="product-new-images">Upload images</Label>
            <input
              id="product-new-images"
              type="file"
              name="new_images"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Search metadata specific to this product.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <ProductField
            errors={errors}
            name="seo_title"
            label="SEO title"
            defaultValue={product?.seo_title}
          />
          <ProductField
            errors={errors}
            name="seo_description"
            label="SEO description"
            defaultValue={product?.seo_description}
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
