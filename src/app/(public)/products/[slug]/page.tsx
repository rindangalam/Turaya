import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/products/product-gallery";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { getPublishedProductBySlug, listPublishedProducts } from "@/services/products";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const NOTE_STAGE_LABELS: Record<string, string> = {
  top: "Top",
  middle: "Heart",
  base: "Base",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) return { title: "Produk" };
  return {
    title: product.name,
    description: product.tagline ?? product.description ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) notFound();

  const allProducts = await listPublishedProducts();
  const related = allProducts
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        (candidate.collectionSlug === product.collectionSlug ||
          candidate.categorySlug === product.categorySlug),
    )
    .slice(0, 4);

  const noteStages: { top: typeof product.notes; middle: typeof product.notes; base: typeof product.notes } =
    { top: [], middle: [], base: [] };
  for (const note of product.notes) {
    const stage = (NOTE_STAGE_LABELS[note.noteStage] ?? "").toLowerCase();
    if (stage === "top") noteStages.top.push(note);
    else if (stage === "heart") noteStages.middle.push(note);
    else if (stage === "base") noteStages.base.push(note);
  }

  return (
    <div>
      <div className="container-turaya py-16 md:py-24">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-2 text-caption uppercase tracking-wider text-muted-foreground">
            <li>
              <Link href="/products" className="transition-colors hover:text-champagne-400">
                Produk
              </Link>
            </li>
            {product.categorySlug ? (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/products?kategori=${product.categorySlug}`}
                    className="transition-colors hover:text-champagne-400"
                  >
                    {product.categoryName}
                  </Link>
                </li>
              </>
            ) : null}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ivory-200">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} alt={product.name} />

          <div className="flex flex-col">
            <p className="overline text-champagne-400">Turaya</p>
            <h1 className="mt-3 font-display text-display-md text-ivory-50">{product.name}</h1>
            {product.tagline ? (
              <p className="mt-4 text-body-lg text-muted-foreground">{product.tagline}</p>
            ) : null}

            <div className="mt-8 flex items-baseline gap-4 border-y border-border/50 py-6">
              <span className="font-display text-heading-lg text-champagne-400">
                {formatPrice(product.price)}
              </span>
              {product.size ? (
                <span className="text-body-sm text-muted-foreground">{product.size}</span>
              ) : null}
            </div>

            {product.description ? (
              <p className="mt-8 whitespace-pre-line text-body leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            ) : null}

            {product.notes.length > 0 ? (
              <section aria-label="Piramida wangi" className="mt-10">
                <h2 className="overline text-caption text-ivory-400">Piramida wangi</h2>
                <dl className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {(["top", "middle", "base"] as const).map((stage) => (
                    <div key={stage} className="border-t border-border/60 pt-4">
                      <dt className="text-caption uppercase tracking-wider text-muted-foreground">
                        {NOTE_STAGE_LABELS[stage]} notes
                      </dt>
                      <dd className="mt-2">
                        {noteStages[stage].length > 0 ? (
                          <ul className="flex flex-wrap gap-2">
                            {noteStages[stage].map((note) => (
                              <li
                                key={note.name}
                                className="rounded-full border border-border/60 px-3 py-1 text-body-sm text-ivory-200"
                              >
                                {note.name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-body-sm text-muted-foreground">—</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {product.story ? (
              <section className="mt-10">
                <h2 className="overline text-caption text-ivory-400">Kisah</h2>
                <p className="mt-4 whitespace-pre-line text-body leading-relaxed text-muted-foreground">
                  {product.story}
                </p>
              </section>
            ) : null}

            {product.collectionSlug ? (
              <div className="mt-10">
                <Button variant="outline" render={<Link href={`/collections/${product.collectionSlug}`} />}>
                  Jelajahi koleksi {product.collectionName}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-border/50">
          <div className="container-turaya py-16 md:py-20">
            <h2 className="font-display text-display-md text-ivory-50">Anda mungkin juga suka</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
