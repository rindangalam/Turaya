"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong",
  description = "The data could not be loaded. Try again, or check your connection.",
}: {
  title?: string;
  description?: string;
}) {
  const router = useRouter();

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-12 text-center"
    >
      <h3 className="text-sm font-medium">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      <Button variant="outline" size="sm" className="mt-4" onClick={() => router.refresh()}>
        Try again
      </Button>
    </div>
  );
}
