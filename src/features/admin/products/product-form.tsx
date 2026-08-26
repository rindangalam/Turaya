"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AutoSlugInput } from "@/components/admin/auto-slug-input";
import { CharCounter } from "@/components/admin/char-counter";
import { DirtyGuard } from "@/components/admin/dirty-guard";
import { FormActions } from "@/components/admin/form-actions";
import type { ActionResult } from "@/lib/validation/action-result";
import { PRODUCT_STATUSES } from "@/lib/validation/product";
import { contentStatusLabel } from "@/lib/labels";
import type { Product, ProductImage, ProductNote } from "@/services/products";
import { NotesEditor } from "@/features/admin/products/notes-editor";
import { ProductImagesEditor } from "@/features/admin/products/product-images-editor";

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
      toast.success(product ? "Produk tersimpan" : "Produk dibuat");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, product]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <DirtyGuard />
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Detail</CardTitle>
          <CardDescription>Informasi inti produk yang tampil di katalog.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <ProductField
              errors={errors}
              name="name"
              label="Nama"
              defaultValue={product?.name}
              required
            />
          </div>
          <AutoSlugInput
            sourceId="product-name"
            id="product-slug"
            name="slug"
            label="Slug"
            defaultValue={product?.slug}
            description="Dipakai pada URL produk. Huruf kecil, tanpa spasi."
            error={errors.slug?.[0]}
          />
          <ProductField
            errors={errors}
            name="size"
            label="Ukuran"
            defaultValue={product?.size}
            description="mis. 50 ml, 100 ml."
          />
          <div className="md:col-span-2">
            <ProductField
              errors={errors}
              name="tagline"
              label="Tagline"
              defaultValue={product?.tagline}
              description="Inti wewangian dalam satu baris."
            />
          </div>
          <SelectField
            id="product-category"
            name="category_id"
            label="Kategori"
            defaultValue={product?.category_id}
            options={categories}
            emptyLabel="Tanpa kategori"
          />
          <SelectField
            id="product-collection"
            name="collection_id"
            label="Koleksi"
            defaultValue={product?.collection_id}
            options={collections}
            emptyLabel="Tanpa koleksi"
          />
          <ProductField
            errors={errors}
            name="price"
            label="Harga"
            defaultValue={product?.price != null ? String(product.price) : null}
            description="Angka saja, hingga 2 desimal. Kosongkan jika tanpa harga."
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
                  {contentStatusLabel(status)}
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
            Produk unggulan
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Konten</CardTitle>
          <CardDescription>Konten editorial untuk halaman produk.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <ProductField
            errors={errors}
            name="description"
            label="Deskripsi"
            defaultValue={product?.description}
            multiline
            description="Ringkasan editorial singkat yang tampil di daftar dan ikhtisar."
          />
          <ProductField
            errors={errors}
            name="story"
            label="Cerita"
            defaultValue={product?.story}
            multiline
            description="Narasi wewangian dalam bentuk panjang."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nada wewangian</CardTitle>
          <CardDescription>
            Susun piramida wewangian — nada atas, tengah, dan dasar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotesEditor ingredients={ingredients} initial={notes ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gambar</CardTitle>
          <CardDescription>
            Atur urutan, teks alternatif, dan keterangan. Gambar baru diunggah saat formulir disimpan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ProductImagesEditor images={images ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Metadata pencarian khusus produk ini.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="grid gap-1.5">
            <ProductField
              errors={errors}
              name="seo_title"
              label="Judul SEO"
              defaultValue={product?.seo_title}
            />
            <CharCounter targetId="product-seo_title" max={60} />
          </div>
          <div className="grid gap-1.5">
            <ProductField
              errors={errors}
              name="seo_description"
              label="Deskripsi SEO"
              defaultValue={product?.seo_description}
              multiline
            />
            <CharCounter targetId="product-seo_description" max={160} />
          </div>
        </CardContent>
      </Card>

      <FormActions pending={pending} submitLabel={submitLabel} />
    </form>
  );
}
