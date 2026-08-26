"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DirtyGuard } from "@/components/admin/dirty-guard";
import { FormActions } from "@/components/admin/form-actions";
import { FormField, FormSelect } from "@/features/admin/shared/form-field";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { contentStatusLabel } from "@/lib/labels";
import { getStoragePublicUrl } from "@/lib/storage";
import type { ActionResult } from "@/lib/validation/action-result";
import type { GalleryItem } from "@/services/gallery";

const STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: contentStatusLabel(status),
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
      toast.success(item ? "Item galeri tersimpan" : "Item galeri dibuat");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, item]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <DirtyGuard />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Gambar</CardTitle>
          <CardDescription>
            JPEG, PNG, WebP atau AVIF, hingga 8 MB.{item ? " Ganti gambar untuk menukarnya." : ""}
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
            <Label htmlFor="gallery-image">{item ? "Ganti gambar" : "Unggah gambar"}</Label>
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
          <CardTitle>Detail</CardTitle>
          <CardDescription>Bagaimana gambar ini dideskripsikan di galeri publik.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField
              errors={errors}
              name="alt"
              label="Teks alternatif"
              defaultValue={item?.alt}
              required
              description="Menjelaskan gambar untuk pembaca layar dan mesin pencari."
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              errors={errors}
              name="caption"
              label="Keterangan"
              defaultValue={item?.caption}
              description="Keterangan editorial opsional yang tampil bersama gambar."
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="gallery-category">Kategori</Label>
            <Input
              id="gallery-category"
              name="category"
              defaultValue={item?.category ?? ""}
              list="gallery-category-options"
              aria-invalid={!!errors.category?.[0]}
              aria-describedby={errors.category?.[0] ? "gallery-category-error" : undefined}
              placeholder="mis. atelier, bahan, kampanye"
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
                Kategori yang sudah ada disarankan; Anda bisa mengetik yang baru.
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

      <FormActions pending={pending} submitLabel={submitLabel} />
    </form>
  );
}

type FieldErrors = Record<string, string[] | undefined>;
