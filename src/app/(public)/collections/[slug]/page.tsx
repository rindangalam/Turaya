import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/products/product-card";
import { getPublishedCollectionBySlug, getPublishedCollectionProducts } from "@/services/collections";
import { getStoragePublicUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getPublishedCollectionBySlug(slug);
  if (!collection) return { title: "Koleksi" };
  return {
    title: collection.name,
    description: collection.description ?? undefined,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getPublishedCollectionBySlug(slug);

  if (!collection) notFound();

  const products = await getPublishedCollectionProducts(collection.id);
  const imageUrl = collection.coverImagePath
    ? getStoragePublicUrl("collections", collection.coverImagePath)
    : null;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="container-turaya grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="overline text-champagne-400">Koleksi</p>
            <h1 className="mt-3 font-display text-display-lg text-ivory-50">{collection.name}</h1>
            {collection.description ? (
              <p className="mt-5 max-w-prose text-body-lg text-muted-foreground">
                {collection.description}
              </p>
            ) : null}
            {collection.story ? (
              <p className="mt-8 max-w-prose whitespace-pre-line text-body leading-relaxed text-muted-foreground">
                {collection.story}
              </p>
            ) : null}
          </div>
          {imageUrl ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-input/20">
              <Image
                src={imageUrl}
                alt={collection.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-t border-border/50">
        <div className="container-turaya py-16 md:py-24">
          <h2 className="font-display text-display-md text-ivory-50">Isi koleksi</h2>
          {products.length === 0 ? (
            <p className="mt-6 text-body-lg text-muted-foreground">
              Koleksi ini belum berisi produk. Silakan kembali lagi nanti.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
