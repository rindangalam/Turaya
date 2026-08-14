import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata } from "@/services/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "philosophy",
    path: "/philosophy",
    fallbackTitle: "Filosofi",
    fallbackDescription: "Pemikiran di balik racikan Turaya.",
  });
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
        <div className="flex flex-col gap-14 text-body-lg leading-relaxed">
          <div className="border-l-2 border-terra-500/60 pl-6">
            <p className="text-muted-foreground">
              Setiap wewangian menyimpan dua hal sekaligus: molekul aroma yang bisa diuraikan, dan
              perasaan yang tidak bisa dijelaskan dengan kata. Filosofi Turaya tumbuh di antara
              keduanya — menghormati sains dalam meracik, sekaligus memberi ruang bagi keajaiban.
            </p>
          </div>

          <div>
            <div className="flex items-baseline gap-4">
              <span className="overline text-caption tabular-nums text-terra-500/70">01</span>
              <h2 className="font-display text-heading-lg text-terra-500">Lambat dan sadar</h2>
            </div>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Kami tidak mengejar kecepatan. Bahan-bahan terbaik membutuhkan waktu — untuk tumbuh,
              dikeringkan, dan diekstraksi dengan cara yang tidak merusaknya. Membuat dalam jumlah
              kecil memberi kami kebebasan untuk menunggu, mengamati, dan memperbaiki.
            </p>
          </div>

          <div>
            <div className="flex items-baseline gap-4">
              <span className="overline text-caption tabular-nums text-terra-500/70">02</span>
              <h2 className="font-display text-heading-lg text-terra-500">Menghormati sumber</h2>
            </div>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">
              Nusantara bukan sekadar tempat kami mengambil bahan. Ia adalah guru kami. Dengan
              bekerja langsung bersama petani dan perajin, kami memastikan setiap botol membawa
              kebaikan bagi orang-orang yang membuatnya mungkin.
            </p>
          </div>

          <div>
            <div className="flex items-baseline gap-4">
              <span className="overline text-caption tabular-nums text-terra-500/70">03</span>
              <h2 className="font-display text-heading-lg text-terra-500">
                Sederhana, tidak sederhana-pura
              </h2>
            </div>
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
