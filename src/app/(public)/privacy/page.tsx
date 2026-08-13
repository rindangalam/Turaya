import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { getSeoMetadata } from "@/services/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("privacy");
  return {
    title: seo?.title ?? "Kebijakan Privasi",
    description: seo?.description ?? "Kebijakan privasi Turaya.",
  };
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
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Data yang kami kumpulkan</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Saat Anda mengisi formulir kontak, kami mengumpulkan nama, alamat email, dan isi pesan
              Anda. Kami hanya menggunakannya untuk membalas pertanyaan Anda dan tidak pernah
              membagikannya kepada pihak ketiga tanpa izin.
            </p>
          </div>

          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Bagaimana kami menyimpan</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Data disimpan pada infrastruktur yang aman dan hanya dapat diakses oleh tim Turaya
              untuk keperluan layanan. Kami tidak menjual data Anda.
            </p>
          </div>

          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Hak Anda</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Anda berhak meminta akses, perbaikan, atau penghapusan data yang kami simpan. Hubungi
              kami melalui halaman kontak dan kami akan memproses permintaan Anda.
            </p>
          </div>

          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Perubahan kebijakan</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan akan diumumkan melalui
              halaman ini.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
