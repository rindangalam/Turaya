"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitContactMessage } from "./actions";
import type { ActionResult } from "@/lib/validation/action-result";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-caption text-destructive">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    submitContactMessage,
    null,
  );

  if (state?.ok) {
    return (
      <div
        role="status"
        className="flex h-full min-h-72 flex-col items-start justify-center border border-border/60 bg-input/20 p-8"
      >
        <div className="flex items-center gap-4">
          <span aria-hidden className="inline-block size-2 rotate-45 bg-champagne-400" />
          <p className="overline text-champagne-400">Terkirim</p>
        </div>
        <h2 className="mt-5 font-display text-display-md text-ivory-50">
          Terima kasih telah menghubungi kami
        </h2>
        <p className="mt-4 max-w-sm text-body leading-relaxed text-muted-foreground">
          Pesan Anda sudah kami terima. Tim kami akan segera membalas melalui email.
        </p>
      </div>
    );
  }

  const fieldErrors = state?.ok ? undefined : state?.fieldErrors;
  const formError = state?.ok ? undefined : state?.formError;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Nama</Label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors?.name)}
            className="mt-2 h-10"
          />
          <FieldError message={fieldErrors?.name?.[0]} />
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldErrors?.email)}
            className="mt-2 h-10"
          />
          <FieldError message={fieldErrors?.email?.[0]} />
        </div>
      </div>

      <div>
        <Label htmlFor="contact-subject">Subjek</Label>
        <Input
          id="contact-subject"
          name="subject"
          autoComplete="off"
          aria-invalid={Boolean(fieldErrors?.subject)}
          className="mt-2 h-10"
        />
        <FieldError message={fieldErrors?.subject?.[0]} />
      </div>

      <div>
        <Label htmlFor="contact-message">Pesan</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(fieldErrors?.message)}
          className="mt-2"
        />
        <FieldError message={fieldErrors?.message?.[0]} />
      </div>

      <div className="sr-only" aria-hidden="true">
        <Label htmlFor="contact-website">Website</Label>
        <Input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {formError ? (
        <p role="alert" className="text-body-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <div>
        <Button type="submit" size="lg" disabled={pending} className={cn("w-full sm:w-auto")}>
          {pending ? "Mengirim…" : "Kirim Pesan"}
          {!pending ? (
            <span aria-hidden className="transition-transform duration-300 group-hover/button:translate-x-0.5">
              →
            </span>
          ) : null}
        </Button>
      </div>
    </form>
  );
}
