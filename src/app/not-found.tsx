import Link from "next/link";

export default function RootNotFound() {
  return (
    <main id="main" className="container-turaya flex min-h-[60svh] flex-col items-start justify-center py-24">
      <p className="overline text-champagne-400">404 — Tidak ditemukan</p>
      <h1 className="mt-4 font-display text-display-lg text-ivory-50">
        Halaman yang Anda cari tidak ada
      </h1>
      <p className="mt-5 max-w-md text-body-lg text-muted-foreground">
        Alamat mungkin salah, atau halaman telah dipindahkan. Mari kembali ke beranda untuk
        melanjutkan menjelajah.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}
