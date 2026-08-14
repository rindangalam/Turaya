import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata } from "@/services/seo";
import { listPublishedIngredients } from "@/services/ingredients";
import { getStoragePublicUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "ingredients",
    path: "/ingredients",
    fallbackTitle: "Bahan",
    fallbackDescription: "Bahan-bahan pilihan Nusantara dalam racikan Turaya.",
  });
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
            {ingredients.map((ingredient, index) => {
              const imageUrl = ingredient.image_path
                ? getStoragePublicUrl("ingredients", ingredient.image_path)
                : null;
              return (
                <article
                  key={ingredient.id}
                  className={cn(
                    "group flex flex-col overflow-hidden border border-border/40 bg-input/10 transition-colors hover:border-border/70",
                  )}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-input/20">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={ingredient.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-noir-800),var(--color-noir-950))]">
                        <div className="flex h-full items-center justify-center">
                          <span
                            aria-hidden
                            className="font-display text-[4rem] leading-none text-noir-700 transition-colors duration-500 group-hover:text-noir-600"
                          >
                            {ingredient.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    <span className="absolute right-4 top-4 text-caption tabular-nums text-ivory-300/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
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
                      <p className="mt-4 border-t border-border/40 pt-4 text-body-sm leading-relaxed text-muted-foreground">
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
