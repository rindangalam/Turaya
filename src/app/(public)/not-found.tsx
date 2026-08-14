import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-turaya flex min-h-[65svh] flex-col items-start justify-center py-24">
        <span
          aria-hidden
          className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 select-none font-display text-[20vw] leading-none text-roast-700/55"
        >
          404
        </span>
        <div className="relative">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-terra-500/80" />
            <p className="overline text-terra-500">404 — Tidak ditemukan</p>
          </div>
          <h1 className="mt-6 max-w-[18ch] font-display text-display-lg text-foreground">
            Halaman yang Anda cari tidak ada
          </h1>
          <p className="mt-6 max-w-md text-body-lg text-muted-foreground">
            Alamat mungkin salah, atau halaman telah dipindahkan. Mari kembali ke beranda untuk
            melanjutkan menjelajah.
          </p>
          <div className="mt-10">
            <Button size="lg" render={<Link href="/" />}>
              Kembali ke beranda
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
