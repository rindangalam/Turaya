import Link from "next/link";
import Image from "next/image";

import { getStoragePublicUrl } from "@/lib/storage";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProductCardProduct = {
  name: string;
  slug: string;
  tagline: string | null;
  price: number | null;
  categoryName?: string | null;
  images?: { path: string; alt: string | null }[];
  imagePath?: string | null;
};

export function ProductCard({ product, className }: { product: ProductCardProduct; className?: string }) {
  const imagePath = product.imagePath ?? product.images?.[0]?.path ?? null;
  const imageUrl = imagePath ? getStoragePublicUrl("products", imagePath) : null;
  const initial = (product.name ?? "T").trim().charAt(0).toUpperCase();

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-input/20">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-noir-800),var(--color-noir-950))]">
            <div className="flex h-full items-center justify-center">
              <span
                aria-hidden
                className="font-display text-[6rem] leading-none text-noir-700 transition-colors duration-500 group-hover:text-noir-600"
              >
                {initial}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
              <span className="overline text-caption text-muted-foreground">{product.slug}</span>
              <span aria-hidden className="h-px w-8 bg-champagne-500/50" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        {product.categoryName ? (
          <p className="overline text-caption text-champagne-400">{product.categoryName}</p>
        ) : null}
        <div className="mt-1.5 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-heading-lg text-ivory-50 transition-colors group-hover:text-champagne-400">
            {product.name}
          </h3>
          <span className="shrink-0 text-body-sm tabular-nums text-champagne-400">
            {formatPrice(product.price)}
          </span>
        </div>
        {product.tagline ? (
          <p className="mt-1 line-clamp-1 text-body-sm text-muted-foreground">{product.tagline}</p>
        ) : null}
      </div>
    </Link>
  );
}
