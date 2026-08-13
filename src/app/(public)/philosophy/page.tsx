import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { getSeoMetadata } from "@/services/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("philosophy");
  return {
    title: seo?.title ?? "Filosofi",
    description: seo?.description ?? "Pemikiran di balik racikan Turaya.",
  };
}

export default async function PhilosophyPage() {
  return (
    <div>
      <PageHeader
        overline="Filosofi"
        title="Filosofi"
        description="Aroma adalah memori paling cepat sampai ke hati. Kami meracik untuk menghidupkan kembali ingatan tentang tanah kita."
      />

      <section className="container-turaya max-w-3xl py-16 md:py-24">
        <div className="flex flex-col gap-8 text-body-lg leading-relaxed">
          <p className="text-ivory-200">
            Setiap wewangian menyimpan dua hal sekaligus: molekul aroma yang bisa diuraikan, dan
            perasaan yang tidak bisa dijelaskan dengan kata. Filosofi Turaya tumbuh di antara
            keduanya — menghormati sains dalam meracik, sekaligus memberi ruang bagi keajaiban.
          </p>

          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Lambat dan sadar</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Kami tidak mengejar kecepatan. Bahan-bahan terbaik membutuhkan waktu — untuk tumbuh,
              dikeringkan, dan diekstraksi dengan cara yang tidak merusaknya. Membuat dalam jumlah
              kecil memberi kami kebebasan untuk menunggu, mengamati, dan memperbaiki.
            </p>
          </div>

          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Menghormati sumber</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Nusantara bukan sekadar tempat kami mengambil bahan. Ia adalah guru kami. Dengan
              bekerja langsung bersama petani dan perajin, kami memastikan setiap botol membawa
              kebaikan bagi orang-orang yang membuatnya mungkin.
            </p>
          </div>

          <div>
            <h2 className="font-display text-heading-lg text-champagne-400">Sederhana, tidak sederhana-pura</h2>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Kami percaya kemewahan sejati ada pada kejujuran bahan, bukan pada kemasan yang
              berlebihan. Aroma yang baik tidak perlu berteriak — ia cukup hadir, dan mengingatkan
              Anda tentang sesuatu yang sudah lama Anda kenal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
