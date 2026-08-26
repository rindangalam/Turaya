"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

/**
 * Sticky bottom action bar for admin forms. Stays visible while scrolling
 * long forms so Save/Cancel are always within reach.
 */
export function FormActions({
  pending,
  submitLabel,
  children,
}: {
  pending: boolean;
  submitLabel: string;
  children?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-10 mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background/95 px-4 py-3 shadow-sm backdrop-blur">
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={pending}
        >
          Batal
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
