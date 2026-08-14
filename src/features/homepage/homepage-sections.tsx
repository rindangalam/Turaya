import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { ProductCard } from "@/components/products/product-card";
import { HeroTimeline } from "@/features/homepage/hero-timeline";
import { StoryScene } from "@/features/homepage/story-scene";
import { getVisibleSections } from "@/services/homepage";
import { listPublishedProducts } from "@/services/products";
import type { VisibleHomepageSection } from "@/services/homepage";

async function resolveImageUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  const supabase = await createClient();
  return supabase.storage.from("branding").getPublicUrl(path).data.publicUrl;
}

function AboutSection({ section, imageUrl }: { section: VisibleHomepageSection; imageUrl: string | null }) {
  return (
    <section className="border-t border-border/50">
      <div className="container-turaya grid gap-12 py-24 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col justify-center">
          {section.subheadline ? (
            <Reveal>
              <div className="flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-terra-500/80" />
                <p className="overline text-terra-500">{section.subheadline}</p>
              </div>
            </Reveal>
          ) : null}
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-[18ch] font-display text-display-md">
              {section.headline ?? section.name}
            </h2>
          </Reveal>
          {section.body ? (
            <Reveal delay={0.14}>
              <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </Reveal>
          ) : null}
          {section.button_label && section.button_url ? (
            <Reveal delay={0.2}>
              <div className="mt-10">
                <Button variant="outline" render={<Link href={section.button_url} />}>
                  {section.button_label}
                </Button>
              </div>
            </Reveal>
          ) : null}
        </div>

        {imageUrl ? (
          <Reveal delay={0.1}>
            <figure className="relative overflow-hidden border border-border/60">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={imageUrl}
                  alt={section.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between border-t border-border/60 px-5 py-3">
                <span className="overline text-caption text-muted-foreground">
                  {section.name}
                </span>
                <span aria-hidden className="h-px w-8 bg-terra-500/60" />
              </figcaption>
            </figure>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

async function FeaturedProductsSection() {
  const products = await listPublishedProducts();
  const featured = products.filter((product) => product.featured).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="border-t border-border/50">
      <div className="container-turaya py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-terra-500/80" />
                <p className="overline text-terra-500">Koleksi terpilih</p>
              </div>
              <h2 className="mt-6 font-display text-display-md">Produk unggulan</h2>
            </div>
            <Button variant="outline" render={<Link href="/products" />}>
              Lihat semua produk
            </Button>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function HomepageSections() {
  const sections = await getVisibleSections();

  const renderers: Record<string, (section: VisibleHomepageSection, imageUrl: string | null) => ReactNode> = {
    hero: (section, imageUrl) => (
      <HeroTimeline
        key={section.id}
        name={section.name}
        headline={section.headline}
        subheadline={section.subheadline}
        body={section.body}
        buttonLabel={section.button_label}
        buttonUrl={section.button_url}
        imageUrl={imageUrl}
      />
    ),
    story: (section) => (
      <StoryScene
        key={section.id}
        name={section.name}
        headline={section.headline}
        subheadline={section.subheadline}
        body={section.body}
      />
    ),
    about: (section, imageUrl) => (
      <AboutSection key={section.id} section={section} imageUrl={imageUrl} />
    ),
  };

  const rendered: ReactNode[] = [];

  for (const section of sections) {
    const render = renderers[section.slug];
    if (!render) continue;
    const imageUrl = await resolveImageUrl(section.image_path);
    rendered.push(render(section, imageUrl));
  }

  rendered.push(<FeaturedProductsSection key="featured-products" />);

  return <>{rendered}</>;
}

