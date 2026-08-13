import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-turaya flex min-h-[60svh] flex-col items-start justify-center py-24">
      <p className="overline text-champagne-400">404 — Tidak ditemukan</p>
      <h1 className="mt-4 font-display text-display-lg text-ivory-50">
        Halaman yang Anda cari tidak ada
      </h1>
      <p className="mt-5 max-w-md text-body-lg text-muted-foreground">
        Alamat mungkin salah, atau halaman telah dipindahkan. Mari kembali ke beranda untuk
        melanjutkan menjelajah.
      </p>
      <div className="mt-10">
        <Button size="lg" render={<Link href="/" />}>
          Kembali ke beranda
        </Button>
      </div>
    </section>
  );
}
