import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { SplitLines } from "@/components/animations/split-lines";
import { getVisibleSections } from "@/services/homepage";
import type { VisibleHomepageSection } from "@/services/homepage";

async function resolveImageUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  const supabase = await createClient();
  return supabase.storage.from("branding").getPublicUrl(path).data.publicUrl;
}

function HeroSection({ section, imageUrl }: { section: VisibleHomepageSection; imageUrl: string | null }) {
  return (
    <section className="relative flex min-h-[70svh] flex-col items-start justify-center overflow-hidden">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={section.subheadline ?? section.name}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      ) : null}
      <div className="container-turaya relative flex flex-col items-start justify-center">
        {section.subheadline ? (
          <Reveal>
            <p className="overline mb-6 text-champagne-400">{section.subheadline}</p>
          </Reveal>
        ) : null}
        <h1 className="font-display text-display-xl">
          <SplitLines text={section.headline ?? section.name} />
        </h1>
        {section.body ? (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">{section.body}</p>
          </Reveal>
        ) : null}
        {section.button_label && section.button_url ? (
          <Reveal delay={0.24}>
            <div className="mt-10">
              <Button size="lg" render={<Link href={section.button_url} />}>
                {section.button_label}
              </Button>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function AboutSection({ section, imageUrl }: { section: VisibleHomepageSection; imageUrl: string | null }) {
  return (
    <section className="container-turaya grid gap-10 py-24 lg:grid-cols-2">
      <div>
        {section.subheadline ? (
          <Reveal>
            <p className="overline text-champagne-400">{section.subheadline}</p>
          </Reveal>
        ) : null}
        <Reveal delay={0.08}>
          <h2 className="mt-3 font-display text-display-md">{section.headline ?? section.name}</h2>
        </Reveal>
        {imageUrl ? (
          <div className="relative mt-8 h-64 w-full overflow-hidden rounded-md">
            <Image
              src={imageUrl}
              alt={section.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col justify-center">
        {section.body ? (
          <Reveal>
            <p className="text-body leading-relaxed text-muted-foreground">{section.body}</p>
          </Reveal>
        ) : null}
        {section.button_label && section.button_url ? (
          <Reveal delay={0.12}>
            <div className="mt-8">
              <Button variant="outline" render={<Link href={section.button_url} />}>
                {section.button_label}
              </Button>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

export async function HomepageSections() {
  const sections = await getVisibleSections();

  const renderers: Record<string, (section: VisibleHomepageSection, imageUrl: string | null) => ReactNode> = {
    hero: (section, imageUrl) => <HeroSection key={section.id} section={section} imageUrl={imageUrl} />,
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

  return <>{rendered}</>;
}

