"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCwIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";

/**
 * Slug input that auto-fills from another text input (usually "name") while
 * untouched. Once the user edits the slug manually, auto-sync pauses; the
 * sync button resumes it from the current source value.
 */
export function AutoSlugInput({
  sourceId,
  id,
  name,
  label,
  defaultValue,
  description,
  error,
}: {
  sourceId: string;
  id: string;
  name: string;
  label: string;
  defaultValue?: string | null;
  description?: string;
  error?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const autoRef = useRef(!defaultValue);

  useEffect(() => {
    const source = document.getElementById(sourceId) as HTMLInputElement | null;
    if (!source) return;

    const sync = () => {
      if (autoRef.current) setValue(slugify(source.value));
    };
    sync();
    source.addEventListener("input", sync);
    return () => source.removeEventListener("input", sync);
  }, [sourceId]);

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-5 gap-1 px-1.5 text-xs text-muted-foreground"
          onClick={() => {
            const source = document.getElementById(sourceId) as HTMLInputElement | null;
            if (!source) return;
            autoRef.current = true;
            setValue(slugify(source.value));
          }}
        >
          <RefreshCwIcon className="size-3" aria-hidden="true" />
          Sinkron
        </Button>
      </div>
      <Input
        id={id}
        name={name}
        value={value}
        onChange={(event) => {
          autoRef.current = false;
          setValue(event.target.value);
        }}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="font-mono"
        required
      />
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
