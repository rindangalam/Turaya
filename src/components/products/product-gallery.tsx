"use client";

import { useState } from "react";
import Image from "next/image";

import { getStoragePublicUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
}: {
  images: { path: string; alt: string | null }[];
  alt: string;
}) {
  const urls = images.map((image) => getStoragePublicUrl("products", image.path));
  const [active, setActive] = useState(0);

  if (urls.length === 0) {
    return (
      <div className="flex aspect-[3/4] w-full items-end bg-input/20 p-6">
        <span className="overline text-caption text-muted-foreground">{alt}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-input/20">
        <Image
          key={urls[active]}
          src={urls[active]}
          alt={images[active]?.alt ?? alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {urls.length > 1 ? (
        <div className="grid grid-cols-4 gap-3" role="group" aria-label="Galeri produk">
          {urls.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Lihat gambar ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm border bg-input/20 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                index === active
                  ? "border-champagne-400/70"
                  : "border-border/40 hover:border-border",
              )}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="(min-width: 640px) 10vw, 20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
