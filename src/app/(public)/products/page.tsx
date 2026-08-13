import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { ProductCard } from "@/components/products/product-card";
import { getSeoMetadata } from "@/services/seo";
import { listPublishedProducts } from "@/services/products";
import { listPublishedCategories } from "@/services/categories";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("products");
  return {
    title: seo?.title ?? "Produk",
    description: seo?.description ?? "Koleksi parfum dan home fragrance Turaya.",
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.kategori?.trim() || undefined;

  const [products, categories] = await Promise.all([
    listPublishedProducts(),
    listPublishedCategories(),
  ]);

  const validCategory =
    selectedCategory && categories.some((c) => c.slug === selectedCategory)
      ? selectedCategory
      : undefined;

  const filtered = validCategory
    ? products.filter((product) => product.categorySlug === validCategory)
    : products;

  const categoryHref = (slug: string | undefined) =>
    slug ? `/products?kategori=${slug}` : "/products";

  return (
    <div>
      <PageHeader
        overline="Katalog"
        title="Produk"
        description="Setiap wangi kami racik dari bahan-bahan pilihan Nusantara — dibuat dalam jumlah kecil, dengan tangan dan kesabaran."
      />

      {categories.length > 0 ? (
        <div className="border-b border-border/50">
          <div className="container-turaya flex flex-wrap gap-2 py-6">
            <CategoryChip
              href={categoryHref(undefined)}
              label="Semua"
              active={!validCategory}
            />
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                href={categoryHref(category.slug)}
                label={category.name}
                active={validCategory === category.slug}
              />
            ))}
          </div>
        </div>
      ) : null}

      <section className="container-turaya py-16 md:py-24">
        {filtered.length === 0 ? (
          <p className="text-body-lg text-muted-foreground">
            Belum ada produk pada kategori ini. Silakan kembali lagi nanti.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CategoryChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border border-border/60 px-4 py-1.5 text-body-sm text-muted-foreground transition-colors hover:border-champagne-400/60 hover:text-champagne-400 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active && "border-champagne-400/60 bg-champagne-400/10 text-champagne-400",
      )}
    >
      {label}
    </Link>
  );
}
