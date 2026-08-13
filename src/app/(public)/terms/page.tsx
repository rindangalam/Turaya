import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { getSeoMetadata } from "@/services/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("terms");
  return {
    title: seo?.title ?? "Syarat & Ketentuan",
    description: seo?.description ?? "Syarat dan ketentuan penggunaan situs Turaya.",
  };
}

export default async function TermsPage() {
  return (
    <div>
      <PageHeader
        overline="Legal"
        title="Syarat & Ketentuan"
        description="Ketentuan penggunaan situs dan layanan Turaya."
      />

      <section className="container-turaya max-w-3xl py-16 md:py-24">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Penggunaan situs</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Situs ini menyajikan informasi tentang produk dan layanan Turaya. Informasi di dalamnya
              dapat berubah sewaktu-waktu tanpa pemberitahuan.
            </p>
          </div>

          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Konten</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Seluruh teks, gambar, dan identitas visual yang tampil di situs ini merupakan milik
              Turaya. Penggunaan tanpa izin tidak diizinkan.
            </p>
          </div>

          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Komunikasi</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Pesan yang Anda kirimkan melalui formulir kontak digunakan semata-mata untuk menanggapi
              pertanyaan Anda. Kami tidak mengirim komunikasi pemasaran tanpa persetujuan.
            </p>
          </div>

          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Batasan tanggung jawab</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Turaya tidak bertanggung jawab atas kerugian yang timbul dari penggunaan informasi di
              situs ini. Untuk keputusan penting, silakan hubungi kami langsung.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
