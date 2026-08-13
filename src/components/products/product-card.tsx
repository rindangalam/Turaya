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
  images?: { path: string; alt: string | null }[];
  imagePath?: string | null;
};

export function ProductCard({ product, className }: { product: ProductCardProduct; className?: string }) {
  const imagePath = product.imagePath ?? product.images?.[0]?.path ?? null;
  const imageUrl = imagePath ? getStoragePublicUrl("products", imagePath) : null;

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
          <div className="flex h-full items-end p-5">
            <span className="overline text-caption text-muted-foreground">{product.slug}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-heading-lg text-ivory-50 transition-colors group-hover:text-champagne-400">
          {product.name}
        </h3>
        <span className="shrink-0 text-body-sm text-champagne-400">{formatPrice(product.price)}</span>
      </div>
      {product.tagline ? (
        <p className="mt-1 line-clamp-1 text-body-sm text-muted-foreground">{product.tagline}</p>
      ) : null}
    </Link>
  );
}
