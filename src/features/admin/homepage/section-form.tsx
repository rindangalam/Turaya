"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      toast.success(section ? "Section saved" : "Section created");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, section]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {section ? <input type="hidden" name="id" value={section.id} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>The layout and copy rendered on the public homepage.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionField
            errors={errors}
            name="name"
            label="Name"
            defaultValue={section?.name}
            required
            description="Internal label, e.g. Hero, About, Featured collection."
          />
          <SectionField
            errors={errors}
            name="slug"
            label="Slug"
            defaultValue={section?.slug}
            required
            description="Identifies the rendering type. The site renders known slugs and skips the rest."
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
              label="Subheadline"
              defaultValue={section?.subheadline}
            />
          </div>
          <div className="md:col-span-2">
            <SectionField
              errors={errors}
              name="body"
              label="Body"
              defaultValue={section?.body}
              multiline
            />
          </div>
          <div className="md:col-span-2">
            <SectionField
              errors={errors}
              name="image_path"
              label="Image path"
              defaultValue={section?.image_path}
              description="Storage path inside the branding bucket, if this section shows an image."
            />
          </div>
          <SectionField
            errors={errors}
            name="button_label"
            label="Button label"
            defaultValue={section?.button_label}
          />
          <SectionField
            errors={errors}
            name="button_url"
            label="Button URL"
            defaultValue={section?.button_url}
            description="Internal path (e.g. /collections) or full URL."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
          <CardDescription>Hidden sections stay in the admin list but never render publicly.</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="visible"
              defaultChecked={section?.visible ?? true}
              className="size-4 accent-foreground"
            />
            Visible on the homepage
          </label>
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
