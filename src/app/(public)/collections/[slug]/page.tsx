import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/products/product-card";
import { JsonLd } from "@/components/seo/jsonld";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/seo/site";
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
  return buildMetadata({
    title: collection.name,
    description: collection.description,
    path: `/collections/${slug}`,
    ogImageUrl: collection.coverImagePath
      ? getStoragePublicUrl("collections", collection.coverImagePath)
      : null,
  });
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
      <JsonLd
        data={[
          CollectionPageJsonLd({
            name: collection.name,
            description: collection.description,
            url: `${getSiteUrl()}/collections/${collection.slug}`,
            imageUrl: imageUrl,
          }),
          BreadcrumbJsonLd({
            baseUrl: getSiteUrl(),
            items: [
              { name: "Beranda", path: "/" },
              { name: "Koleksi", path: "/collections" },
              { name: collection.name, path: `/collections/${collection.slug}` },
            ],
          }),
        ]}
      />
      <section className="relative overflow-hidden">
        <div className="container-turaya grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="mb-8">
              <Link
                href="/collections"
                className="overline text-caption text-muted-foreground transition-colors hover:text-champagne-400"
              >
                ← Semua koleksi
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-champagne-500/80" />
              <p className="overline text-champagne-400">Koleksi</p>
            </div>
            <h1 className="mt-6 max-w-[18ch] font-display text-display-lg text-ivory-50">
              {collection.name}
            </h1>
            {collection.description ? (
              <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">
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
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-8 bg-champagne-500/70" />
            <h2 className="font-display text-display-md text-ivory-50">Isi koleksi</h2>
          </div>
          {products.length === 0 ? (
            <div className="mt-8 flex flex-col items-start gap-4 border border-dashed border-border/60 p-10">
              <p className="font-display text-heading-lg text-ivory-200">
                Koleksi ini masih kosong
              </p>
              <p className="max-w-md text-body-sm text-muted-foreground">
                Koleksi ini belum berisi produk. Silakan kembali lagi nanti.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
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
