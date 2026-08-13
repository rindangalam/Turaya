"use client";

import { Button } from "@/components/ui/button";

export default function PublicError({ reset }: { reset: () => void }) {
  return (
    <section className="container-turaya flex min-h-[60svh] flex-col items-start justify-center py-24">
      <p className="overline text-champagne-400">Terjadi kesalahan</p>
      <h1 className="mt-4 font-display text-display-lg text-ivory-50">
        Maaf, ada yang tidak beres
      </h1>
      <p className="mt-5 max-w-md text-body-lg text-muted-foreground">
        Terjadi gangguan saat memuat halaman. Silakan coba kembali — jika masalah berlanjut,
        hubungi kami melalui halaman kontak.
      </p>
      <div className="mt-10 flex gap-4">
        <Button size="lg" onClick={reset}>
          Coba lagi
        </Button>
      </div>
    </section>
  );
}
