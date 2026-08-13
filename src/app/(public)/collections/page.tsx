import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { PageHeader } from "@/components/layout/page-header";
import { getSeoMetadata } from "@/services/seo";
import { listPublishedCollections } from "@/services/collections";
import { getStoragePublicUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("collections");
  return {
    title: seo?.title ?? "Koleksi",
    description: seo?.description ?? "Koleksi parfum dan home fragrance Turaya.",
  };
}

export default async function CollectionsPage() {
  const collections = await listPublishedCollections();
  const sorted = [...collections].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <div>
      <PageHeader
        overline="Koleksi"
        title="Koleksi"
        description="Kumpulan kecil yang dirangkai mengikuti ritme musim, bahan, dan cerita dari berbagai pelosok Nusantara."
      />

      <section className="container-turaya py-16 md:py-24">
        {sorted.length === 0 ? (
          <p className="text-body-lg text-muted-foreground">
            Koleksi belum tersedia. Silakan kembali lagi nanti.
          </p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2">
            {sorted.map((collection, index) => {
              const imageUrl = collection.coverImagePath
                ? getStoragePublicUrl("collections", collection.coverImagePath)
                : null;
              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className={cn(
                    "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    index % 2 === 1 && "sm:mt-16",
                  )}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-input/20">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={collection.name}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-end p-6">
                        <span className="overline text-caption text-muted-foreground">
                          {collection.slug}
                        </span>
                      </div>
                    )}
                    {collection.featured ? (
                      <span className="absolute left-4 top-4 rounded-full bg-noir-950/80 px-3 py-1 text-caption uppercase tracking-wider text-champagne-400 backdrop-blur">
                        Koleksi utama
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-5 font-display text-display-md text-ivory-50 transition-colors group-hover:text-champagne-400">
                    {collection.name}
                  </h2>
                  {collection.description ? (
                    <p className="mt-2 line-clamp-2 max-w-prose text-body text-muted-foreground">
                      {collection.description}
                    </p>
                  ) : null}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
