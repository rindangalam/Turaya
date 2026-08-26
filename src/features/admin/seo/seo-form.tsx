"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CharCounter } from "@/components/admin/char-counter";
import type { SeoMetadata } from "@/services/seo";
import { updateSeoMetadata } from "@/features/admin/seo/actions";

type FieldErrors = Record<string, string[] | undefined>;

function SeoField({
  errors,
  idPrefix,
  name,
  label,
  defaultValue,
  description,
  multiline = false,
}: {
  errors: FieldErrors;
  idPrefix: string;
  name: string;
  label: string;
  defaultValue?: string | null;
  description?: string;
  multiline?: boolean;
}) {
  const id = `${idPrefix}-${name}`;
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
        />
      ) : (
        <Input
          id={id}
          name={name}
          defaultValue={defaultValue ?? ""}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
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

export function SeoRowForm({ row }: { row: SeoMetadata }) {
  const [state, formAction, pending] = useActionState(updateSeoMetadata, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(`SEO ${row.page} tersimpan`);
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, row.page]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});
  const idPrefix = `seo-${row.id}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono text-sm">{row.page}</CardTitle>
        <CardDescription>Pengaturan meta untuk halaman ini.</CardDescription>
      </CardHeader>
      <form action={formAction} className="contents">
        <input type="hidden" name="id" value={row.id} />
        <input type="hidden" name="page" value={row.page} />
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-1.5">
            <SeoField
              errors={errors}
              idPrefix={idPrefix}
              name="title"
              label="Judul meta"
              defaultValue={row.title}
              description="~60 karakter direkomendasikan."
            />
            <CharCounter targetId={`${idPrefix}-title`} max={60} />
          </div>
          <SeoField
            errors={errors}
            idPrefix={idPrefix}
            name="robots"
            label="Robots"
            defaultValue={row.robots}
            description="misalnya index, follow"
          />
          <div className="md:col-span-2 grid gap-1.5">
            <SeoField
              errors={errors}
              idPrefix={idPrefix}
              name="description"
              label="Deskripsi meta"
              defaultValue={row.description}
              description="~155 karakter direkomendasikan."
              multiline
            />
            <CharCounter targetId={`${idPrefix}-description`} max={160} />
          </div>
          <SeoField
            errors={errors}
            idPrefix={idPrefix}
            name="canonical_url"
            label="Canonical URL"
            defaultValue={row.canonical_url}
          />
          <SeoField
            errors={errors}
            idPrefix={idPrefix}
            name="og_image_path"
            label="Path gambar OG"
            defaultValue={row.og_image_path}
            description="Path penyimpanan relatif terhadap bucket publik."
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Menyimpan…" : "Simpan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
