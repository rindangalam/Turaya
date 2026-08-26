"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Live character counter for an uncontrolled input/textarea, addressed by
 * its DOM id. Renders nothing until mounted so SSR markup stays stable.
 */
export function CharCounter({ targetId, max }: { targetId: string; max: number }) {
  const [length, setLength] = useState<number | null>(null);

  useEffect(() => {
    const target = document.getElementById(targetId) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (!target) return;

    const update = () => setLength(target.value.length);
    update();
    target.addEventListener("input", update);
    return () => target.removeEventListener("input", update);
  }, [targetId]);

  if (length === null) return null;

  return (
    <p
      aria-live="polite"
      className={cn(
        "text-xs tabular-nums",
        length > max ? "font-medium text-destructive" : "text-muted-foreground",
      )}
    >
      {length}/{max} karakter
    </p>
  );
}
