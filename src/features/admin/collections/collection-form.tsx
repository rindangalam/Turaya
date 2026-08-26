"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AutoSlugInput } from "@/components/admin/auto-slug-input";
import { CharCounter } from "@/components/admin/char-counter";
import { DirtyGuard } from "@/components/admin/dirty-guard";
import { FormActions } from "@/components/admin/form-actions";
import {
  FormCheckbox,
  FormField,
  FormSelect,
  type FieldErrors,
} from "@/features/admin/shared/form-field";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { contentStatusLabel } from "@/lib/labels";
import type { ActionResult } from "@/lib/validation/action-result";
import type { Collection, CollectionProduct } from "@/services/collections";
import { ProductsEditor } from "@/features/admin/collections/products-editor";

const STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: contentStatusLabel(status),
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
      toast.success(collection ? "Koleksi tersimpan" : "Koleksi dibuat");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, collection]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <DirtyGuard />
      {collection ? <input type="hidden" name="id" value={collection.id} /> : null}

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
            defaultValue={collection?.name}
            required
          />
          <AutoSlugInput
            sourceId="field-name"
            id="field-slug"
            name="slug"
            label="Slug"
            defaultValue={collection?.slug}
            description="Dipakai pada URL koleksi. Huruf kecil, tanpa spasi."
            error={errors.slug?.[0]}
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
            label="Koleksi unggulan"
            defaultChecked={collection?.featured ?? false}
            description="Koleksi unggulan disorot di situs publik."
          />
          <div className="md:col-span-2">
            <FormField
              errors={errors}
              name="cover_image_path"
              label="Path gambar sampul"
              defaultValue={collection?.cover_image_path}
              description="Path penyimpanan di dalam bucket branding."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Konten</CardTitle>
          <CardDescription>Konten editorial untuk halaman koleksi.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <FormField
            errors={errors}
            name="description"
            label="Deskripsi"
            defaultValue={collection?.description}
            multiline
          />
          <FormField
            errors={errors}
            name="story"
            label="Cerita"
            defaultValue={collection?.story}
            multiline
            description="Narasi merek dalam bentuk panjang."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produk</CardTitle>
          <CardDescription>
            Produk dalam koleksi ini. Urutan di sini mengatur tampilannya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsEditor products={assignable} initial={products ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Metadata pencarian untuk koleksi ini.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="grid gap-1.5">
            <FormField
              errors={errors}
              name="seo_title"
              label="Judul SEO"
              defaultValue={collection?.seo_title}
            />
            <CharCounter targetId="field-seo_title" max={60} />
          </div>
          <div className="grid gap-1.5">
            <FormField
              errors={errors}
              name="seo_description"
              label="Deskripsi SEO"
              defaultValue={collection?.seo_description}
              multiline
            />
            <CharCounter targetId="field-seo_description" max={160} />
          </div>
        </CardContent>
      </Card>

      <FormActions pending={pending} submitLabel={submitLabel} />
    </form>
  );
}
