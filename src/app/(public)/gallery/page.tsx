import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata } from "@/services/seo";
import { listPublishedGalleryItems } from "@/services/gallery";
import { getStoragePublicUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "gallery",
    path: "/gallery",
    fallbackTitle: "Galeri",
    fallbackDescription: "Galeri suasana dan proses kreatif Turaya.",
  });
}

export default async function GalleryPage() {
  const items = await listPublishedGalleryItems();

  return (
    <div>
      <PageHeader
        overline="Galeri"
        title="Galeri"
        description="Potongan suasana, atelier, dan bahan yang menginspirasi setiap racikan."
      />

      <section className="container-turaya py-16 md:py-24">
        {items.length === 0 ? (
          <div className="flex flex-col items-start gap-4 border border-dashed border-border/60 p-10">
            <p className="font-display text-heading-lg text-foreground">Galeri masih kosong</p>
            <p className="max-w-md text-body-sm text-muted-foreground">
              Foto-foto suasana akan segera hadir di sini. Silakan kembali lagi nanti.
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {items.map((item, index) => (
              <figure key={item.id} className="group relative break-inside-avoid overflow-hidden bg-input/20">
                <Image
                  src={getStoragePublicUrl("gallery", item.path)}
                  alt={item.alt}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-roast-800/90 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 pb-5">
                  {item.caption ? (
                    <p className="text-body-sm leading-relaxed text-cream-100">{item.caption}</p>
                  ) : (
                    <span />
                  )}
                  <span aria-hidden className="overline text-caption tabular-nums text-honey-300/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
