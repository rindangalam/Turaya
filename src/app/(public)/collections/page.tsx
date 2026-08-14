import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { PageHeader } from "@/components/layout/page-header";
import { CursorPreview } from "@/components/animations/cursor-preview";
import { buildPageMetadata } from "@/services/seo";
import { listPublishedCollections } from "@/services/collections";
import { getStoragePublicUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "collections",
    path: "/collections",
    fallbackTitle: "Koleksi",
    fallbackDescription: "Koleksi parfum dan home fragrance Turaya.",
  });
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

      <CursorPreview />

      <section className="container-turaya py-16 md:py-24">
        {sorted.length === 0 ? (
          <p className="text-body-lg text-muted-foreground">
            Koleksi belum tersedia. Silakan kembali lagi nanti.
          </p>
        ) : (
          <div className="grid gap-12 sm:grid-cols-2 sm:gap-x-10">
            {sorted.map((collection, index) => {
              const imageUrl = collection.coverImagePath
                ? getStoragePublicUrl("collections", collection.coverImagePath)
                : null;
              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  data-preview-src={imageUrl ?? undefined}
                  className={cn(
                    "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    index % 2 === 1 && "sm:mt-20",
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
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-noir-800),var(--color-noir-950))]">
                        <div className="flex h-full items-center justify-center">
                          <span
                            aria-hidden
                            className="font-display text-[5rem] leading-none text-noir-700 transition-colors duration-500 group-hover:text-noir-600"
                          >
                            {collection.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    {collection.featured ? (
                      <span className="absolute left-4 top-4 rounded-full bg-noir-950/80 px-3 py-1 text-caption uppercase tracking-wider text-champagne-400 backdrop-blur">
                        Koleksi utama
                      </span>
                    ) : null}
                    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-champagne-500/0 via-champagne-500/60 to-champagne-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-6">
                    <h2 className="font-display text-display-md text-ivory-50 transition-colors group-hover:text-champagne-400">
                      {collection.name}
                    </h2>
                    <span
                      aria-hidden
                      className="overline text-caption tabular-nums text-muted-foreground"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
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
