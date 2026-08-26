"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AutoSlugInput } from "@/components/admin/auto-slug-input";
import { DirtyGuard } from "@/components/admin/dirty-guard";
import { FormActions } from "@/components/admin/form-actions";
import type { ActionResult } from "@/lib/validation/action-result";
import type { HomepageSection } from "@/services/homepage";

type FieldErrors = Record<string, string[] | undefined>;

function SectionField({
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
  const id = `section-${name}`;
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

export function SectionForm({
  action,
  section,
  submitLabel,
}: {
  action: (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
  section?: HomepageSection | null;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(section ? "Bagian tersimpan" : "Bagian dibuat");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, section]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <DirtyGuard />
      {section ? <input type="hidden" name="id" value={section.id} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>Konten</CardTitle>
          <CardDescription>Tata letak dan teks yang dirender di halaman utama publik.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionField
            errors={errors}
            name="name"
            label="Nama"
            defaultValue={section?.name}
            required
            description="Label internal, mis. Hero, Tentang, Koleksi unggulan."
          />
          <AutoSlugInput
            sourceId="section-name"
            id="section-slug"
            name="slug"
            label="Slug"
            defaultValue={section?.slug}
            description="Mengidentifikasi jenis render. Situs merender slug yang dikenal dan melewati sisanya."
            error={errors.slug?.[0]}
          />
          <div className="md:col-span-2">
            <SectionField
              errors={errors}
              name="headline"
              label="Headline"
              defaultValue={section?.headline}
            />
          </div>
          <div className="md:col-span-2">
            <SectionField
              errors={errors}
              name="subheadline"
              label="Subjudul"
              defaultValue={section?.subheadline}
            />
          </div>
          <div className="md:col-span-2">
            <SectionField
              errors={errors}
              name="body"
              label="Isi"
              defaultValue={section?.body}
              multiline
            />
          </div>
          <div className="md:col-span-2">
            <SectionField
              errors={errors}
              name="image_path"
              label="Path gambar"
              defaultValue={section?.image_path}
              description="Path penyimpanan di dalam bucket branding, jika bagian ini menampilkan gambar."
            />
          </div>
          <SectionField
            errors={errors}
            name="button_label"
            label="Label tombol"
            defaultValue={section?.button_label}
          />
          <SectionField
            errors={errors}
            name="button_url"
            label="URL tombol"
            defaultValue={section?.button_url}
            description="Path internal (mis. /collections) atau URL lengkap."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibilitas</CardTitle>
          <CardDescription>Bagian tersembunyi tetap ada di daftar admin tetapi tidak pernah dirender secara publik.</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="visible"
              defaultChecked={section?.visible ?? true}
              className="size-4 accent-foreground"
            />
            Tampil di halaman utama
          </label>
        </CardContent>
      </Card>

      <FormActions pending={pending} submitLabel={submitLabel} />
    </form>
  );
}
