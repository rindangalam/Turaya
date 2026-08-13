import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/layout/page-header";
import { getSeoMetadata } from "@/services/seo";
import { listPublishedIngredients } from "@/services/ingredients";
import { getStoragePublicUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("ingredients");
  return {
    title: seo?.title ?? "Bahan",
    description: seo?.description ?? "Bahan-bahan pilihan Nusantara dalam racikan Turaya.",
  };
}

export default async function IngredientsPage() {
  const ingredients = await listPublishedIngredients();

  return (
    <div>
      <PageHeader
        overline="Bahan"
        title="Bahan-bahan Nusantara"
        description="Kami bekerja langsung dengan petani dan pemetik di berbagai wilayah Indonesia. Setiap bahan datang dengan ceritanya sendiri."
      />

      <section className="container-turaya py-16 md:py-24">
        {ingredients.length === 0 ? (
          <p className="text-body-lg text-muted-foreground">
            Daftar bahan belum tersedia. Silakan kembali lagi nanti.
          </p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {ingredients.map((ingredient) => {
              const imageUrl = ingredient.image_path
                ? getStoragePublicUrl("ingredients", ingredient.image_path)
                : null;
              return (
                <article
                  key={ingredient.id}
                  className={cn(
                    "flex flex-col overflow-hidden rounded-sm border border-border/40 bg-input/10 transition-colors hover:border-border/70",
                  )}
                >
                  {imageUrl ? (
                    <div className="relative aspect-[16/10] w-full bg-input/20">
                      <Image
                        src={imageUrl}
                        alt={ingredient.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] w-full items-end bg-input/20 p-5">
                      <span className="overline text-caption text-muted-foreground">
                        {ingredient.slug}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-heading-lg text-ivory-50">{ingredient.name}</h2>
                      {ingredient.origin ? (
                        <span className="shrink-0 text-caption uppercase tracking-wider text-champagne-400">
                          {ingredient.origin}
                        </span>
                      ) : null}
                    </div>
                    {ingredient.description ? (
                      <p className="mt-3 text-body text-muted-foreground">{ingredient.description}</p>
                    ) : null}
                    {ingredient.story ? (
                      <p className="mt-4 text-body-sm leading-relaxed text-ivory-300/70">
                        {ingredient.story}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
