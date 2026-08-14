import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata } from "@/services/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "terms",
    path: "/terms",
    fallbackTitle: "Syarat & Ketentuan",
    fallbackDescription: "Syarat dan ketentuan penggunaan situs Turaya.",
  });
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
        <div className="flex flex-col">
          {[
            {
              title: "Penggunaan situs",
              body: "Situs ini menyajikan informasi tentang produk dan layanan Turaya. Informasi di dalamnya dapat berubah sewaktu-waktu tanpa pemberitahuan.",
            },
            {
              title: "Konten",
              body: "Seluruh teks, gambar, dan identitas visual yang tampil di situs ini merupakan milik Turaya. Penggunaan tanpa izin tidak diizinkan.",
            },
            {
              title: "Komunikasi",
              body: "Pesan yang Anda kirimkan melalui formulir kontak digunakan semata-mata untuk menanggapi pertanyaan Anda. Kami tidak mengirim komunikasi pemasaran tanpa persetujuan.",
            },
            {
              title: "Batasan tanggung jawab",
              body: "Turaya tidak bertanggung jawab atas kerugian yang timbul dari penggunaan informasi di situs ini. Untuk keputusan penting, silakan hubungi kami langsung.",
            },
          ].map((section, index) => (
            <div key={section.title} className="border-t border-border/50 py-8 first:border-t-0 first:pt-0 last:pb-0">
              <div className="flex items-baseline gap-5">
                <span className="overline text-caption tabular-nums text-terra-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-heading-lg text-terra-500">{section.title}</h2>
              </div>
              <p className="mt-4 max-w-prose pl-11 text-body leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
