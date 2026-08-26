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
      <h2 className="text-heading-md font-semibold">Terjadi kesalahan</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Terjadi kesalahan tak terduga di bagian ini. Coba lagi, dan jika masih berlanjut hubungi dukungan.
      </p>
      <Button variant="outline" size="sm" className="mt-4" onClick={() => retry()}>
        Coba lagi
      </Button>
    </div>
  );
}
