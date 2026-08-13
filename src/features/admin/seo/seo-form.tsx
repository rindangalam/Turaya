"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SeoMetadata } from "@/services/seo";
import { updateSeoMetadata } from "@/features/admin/seo/actions";

type FieldErrors = Record<string, string[] | undefined>;

function SeoField({
  errors,
  name,
  label,
  defaultValue,
  description,
  multiline = false,
}: {
  errors: FieldErrors;
  name: string;
  label: string;
  defaultValue?: string | null;
  description?: string;
  multiline?: boolean;
}) {
  const id = `seo-${name}`;
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
      toast.success(`Saved ${row.page} SEO`);
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, row.page]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono text-sm">{row.page}</CardTitle>
        <CardDescription>Meta settings for this page.</CardDescription>
      </CardHeader>
      <form action={formAction} className="contents">
        <input type="hidden" name="id" value={row.id} />
        <input type="hidden" name="page" value={row.page} />
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SeoField
            errors={errors}
            name="title"
            label="Title"
            defaultValue={row.title}
            description="~60 characters recommended."
          />
          <SeoField
            errors={errors}
            name="robots"
            label="Robots"
            defaultValue={row.robots}
            description="e.g. index, follow"
          />
          <div className="md:col-span-2">
            <SeoField
              errors={errors}
              name="description"
              label="Description"
              defaultValue={row.description}
              description="~155 characters recommended."
              multiline
            />
          </div>
          <SeoField
            errors={errors}
            name="canonical_url"
            label="Canonical URL"
            defaultValue={row.canonical_url}
          />
          <SeoField
            errors={errors}
            name="og_image_path"
            label="OG image path"
            defaultValue={row.og_image_path}
            description="Storage path relative to the public bucket."
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
