"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-16 text-center"
    >
      <h2 className="text-heading-md font-semibold">Something went wrong</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred in this section. Try again, and if it persists contact support.
      </p>
      <Button variant="outline" size="sm" className="mt-4" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
