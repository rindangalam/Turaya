import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata } from "@/services/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "privacy",
    path: "/privacy",
    fallbackTitle: "Kebijakan Privasi",
    fallbackDescription: "Kebijakan privasi Turaya.",
  });
}

export default async function PrivacyPage() {
  return (
    <div>
      <PageHeader
        overline="Legal"
        title="Kebijakan Privasi"
        description="Bagaimana Turaya mengelola data Anda dengan aman dan transparan."
      />

      <section className="container-turaya max-w-3xl py-16 md:py-24">
        <div className="flex flex-col">
          {[
            {
              title: "Data yang kami kumpulkan",
              body: "Saat Anda mengisi formulir kontak, kami mengumpulkan nama, alamat email, dan isi pesan Anda. Kami hanya menggunakannya untuk membalas pertanyaan Anda dan tidak pernah membagikannya kepada pihak ketiga tanpa izin.",
            },
            {
              title: "Bagaimana kami menyimpan",
              body: "Data disimpan pada infrastruktur yang aman dan hanya dapat diakses oleh tim Turaya untuk keperluan layanan. Kami tidak menjual data Anda.",
            },
            {
              title: "Hak Anda",
              body: "Anda berhak meminta akses, perbaikan, atau penghapusan data yang kami simpan. Hubungi kami melalui halaman kontak dan kami akan memproses permintaan Anda.",
            },
            {
              title: "Perubahan kebijakan",
              body: "Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan akan diumumkan melalui halaman ini.",
            },
          ].map((section, index) => (
            <div key={section.title} className="border-t border-border/50 py-8 first:border-t-0 first:pt-0 last:pb-0">
              <div className="flex items-baseline gap-5">
                <span className="overline text-caption tabular-nums text-champagne-500/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-heading-lg text-champagne-400">{section.title}</h2>
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
