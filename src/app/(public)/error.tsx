"use client";

import { Button } from "@/components/ui/button";

export default function PublicError({ reset }: { reset: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="container-turaya flex min-h-[65svh] flex-col items-start justify-center py-24">
        <p className="overline text-terra-500">Terjadi kesalahan</p>
        <h1 className="mt-6 max-w-[18ch] font-display text-display-lg text-foreground">
          Maaf, ada yang tidak beres
        </h1>
        <p className="mt-6 max-w-md text-body-lg text-muted-foreground">
          Terjadi gangguan saat memuat halaman. Silakan coba kembali — jika masalah berlanjut,
          hubungi kami melalui halaman kontak.
        </p>
        <div className="mt-10 flex gap-4">
          <Button size="lg" onClick={reset}>
            Coba lagi
          </Button>
        </div>
      </div>
    </section>
  );
}
