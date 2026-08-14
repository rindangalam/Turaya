import { Reveal } from "@/components/animations/reveal";

export function PageHeader({
  overline,
  title,
  description,
}: {
  overline: string;
  title: string;
  description?: string | null;
}) {
  return (
    <section className="border-b border-border/60 bg-clay-100/40">
      <div className="container-turaya py-20 md:py-28">
        <Reveal>
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-terra-500/80" />
            <p className="overline text-terra-500">{overline}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 max-w-[18ch] font-display text-display-lg text-foreground">
            {title}
          </h1>
        </Reveal>
        {description ? (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
