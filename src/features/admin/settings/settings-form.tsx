"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DirtyGuard } from "@/components/admin/dirty-guard";
import { FormActions } from "@/components/admin/form-actions";
import type { SiteSettings } from "@/services/settings";
import { updateSettings } from "@/features/admin/settings/actions";

type FieldErrors = Record<string, string[] | undefined>;

function FieldError({ errors, id }: { errors: FieldErrors; id: string }) {
  const message = errors[id]?.[0];
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

function Field({
  errors,
  name,
  label,
  defaultValue,
  type = "text",
  description,
  required = false,
  multiline = false,
}: {
  errors: FieldErrors;
  name: string;
  label: string;
  defaultValue?: string | null;
  type?: "text" | "email" | "tel" | "url";
  description?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const id = `settings-${name}`;
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
          aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
          required={required}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
          required={required}
        />
      )}
      {description && !error ? (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      <FieldError errors={errors} id={name} />
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction, pending] = useActionState(updateSettings, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success("Pengaturan tersimpan");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction}>
      <DirtyGuard />
      <input type="hidden" name="id" value={settings?.id ?? "00000000-0000-0000-0000-000000000001"} />
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Identitas merek</CardTitle>
            <CardDescription>
              Nama, tagline, dan pengumuman yang tampil di seluruh situs publik.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              errors={errors}
              name="site_name"
              label="Nama situs"
              defaultValue={settings?.site_name}
              required
            />
            <Field
              errors={errors}
              name="tagline"
              label="Tagline"
              defaultValue={settings?.tagline}
            />
            <div className="md:col-span-2">
              <Field
                errors={errors}
                name="announcement"
                label="Pengumuman"
                defaultValue={settings?.announcement}
                description="Teks banner singkat yang tampil di halaman beranda."
                multiline
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail kontak</CardTitle>
            <CardDescription>Cara pengunjung menghubungi studio.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              errors={errors}
              name="contact_email"
              label="Email kontak"
              type="email"
              defaultValue={settings?.contact_email}
            />
            <Field
              errors={errors}
              name="contact_phone"
              label="Telepon kontak"
              type="tel"
              defaultValue={settings?.contact_phone}
            />
            <div className="md:col-span-2">
              <Field
                errors={errors}
                name="address"
                label="Alamat"
                defaultValue={settings?.address}
                multiline
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tautan sosial</CardTitle>
            <CardDescription>URL lengkap yang diawali dengan http(s)://</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field
              errors={errors}
              name="instagram_url"
              label="URL Instagram"
              type="url"
              defaultValue={settings?.instagram_url}
            />
            <Field
              errors={errors}
              name="tiktok_url"
              label="URL TikTok"
              type="url"
              defaultValue={settings?.tiktok_url}
            />
            <Field
              errors={errors}
              name="whatsapp_number"
              label="Nomor WhatsApp"
              type="tel"
              defaultValue={settings?.whatsapp_number}
            />
          </CardContent>
        </Card>

        <FormActions pending={pending} submitLabel="Simpan pengaturan" />
      </div>
    </form>
  );
}
