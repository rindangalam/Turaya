import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata, getSeoMetadata } from "@/services/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "about",
    path: "/about",
    fallbackTitle: "Tentang",
    fallbackDescription: "Kisah di balik Turaya.",
  });
}

const VALUES = [
  {
    title: "Bahan nyata",
    body: "Kami memilih bahan langsung dari sumbernya di Nusantara — tanpa jalan pintas, tanpa kompromi pada kualitas.",
  },
  {
    title: "Membuat dalam jumlah kecil",
    body: "Setiap racikan dibuat dalam batch kecil agar karakter aroma terjaga dan dapat kami kendalikan dari awal hingga akhir.",
  },
  {
    title: "Menghargai tangan pembuat",
    body: "Di balik setiap botol ada petani, pemetik, dan perajin. Keberlanjutan bagi mereka adalah bagian dari resep kami.",
  },
];

export default async function AboutPage() {
  const seo = await getSeoMetadata("about");

  return (
    <div>
      <PageHeader
        overline="Tentang"
        title="Tentang Turaya"
        description={
          seo?.description ??
          "Turaya lahir dari kecintaan pada aroma Nusantara — menghadirkan kembali wangi-wangi yang tumbuh di tanah kita, dalam bentuk yang pantas untuk dirasakan hari ini."
        }
      />

      <section className="container-turaya grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p className="overline text-terra-500">01</p>
          <h2 className="mt-6 max-w-[14ch] font-display text-display-md text-foreground">
            Dari mana kami berasal
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-body-lg leading-relaxed text-muted-foreground">
            Turaya bermula dari sebuah pertanyaan sederhana: mengapa sebagian besar parfum yang kita
            kenal berasal dari jarak ribuan kilometer, padahal tanah kita sendiri kaya akan aroma?
          </p>
          <p className="text-body leading-relaxed text-muted-foreground">
            Kami memulai dengan menjelajahi kebun, pasar, dan rumah-rumah para perajang wewangian
            di berbagai wilayah Indonesia. Dari sana kami mengumpulkan bahan — cendana, vanila,
            melati, dan banyak lagi — dan mempelajari cara mereka diperlakukan dengan hormat oleh
            orang-orang yang telah bekerja dengannya selama bergenerasi.
          </p>
          <p className="text-body leading-relaxed text-muted-foreground">
            Hari ini, Turaya meracik parfum dan home fragrance dalam jumlah kecil, dengan standar
            yang sama: bahan nyata, proses yang jujur, dan cerita yang layak untuk dibagikan.
          </p>
        </div>
      </section>

      <section className="border-t border-border/50">
        <div className="container-turaya py-16 md:py-24">
          <p className="overline text-terra-500">02</p>
          <h2 className="mt-6 font-display text-display-md text-foreground">Yang kami pegang teguh</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {VALUES.map((value, index) => (
              <div key={value.title} className="border-t border-terra-500/30 pt-6">
                <p className="overline text-caption tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-heading-lg text-terra-500">
                  {value.title}
                </h3>
                <p className="mt-3 text-body leading-relaxed text-muted-foreground">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
