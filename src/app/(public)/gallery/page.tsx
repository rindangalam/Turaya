import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/layout/page-header";
import { getSeoMetadata } from "@/services/seo";
import { listPublishedGalleryItems } from "@/services/gallery";
import { getStoragePublicUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("gallery");
  return {
    title: seo?.title ?? "Galeri",
    description: seo?.description ?? "Galeri suasana dan proses kreatif Turaya.",
  };
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
            <p className="font-display text-heading-lg text-ivory-200">Galeri masih kosong</p>
            <p className="max-w-md text-body-sm text-muted-foreground">
              Foto-foto suasana akan segera hadir di sini. Silakan kembali lagi nanti.
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {items.map((item) => (
              <figure key={item.id} className="group relative break-inside-avoid overflow-hidden rounded-sm bg-input/20">
                <Image
                  src={getStoragePublicUrl("gallery", item.path)}
                  alt={item.alt}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {item.caption ? (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir-950/90 to-transparent px-5 pb-4 pt-16">
                    <p className="text-body-sm text-ivory-100">{item.caption}</p>
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
