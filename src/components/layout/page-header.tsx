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
    <section className="border-b border-border/50 bg-input/10">
      <div className="container-turaya py-16 md:py-24">
        <Reveal>
          <p className="overline text-champagne-400">{overline}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-3 font-display text-display-lg text-ivory-50">{title}</h1>
        </Reveal>
        {description ? (
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-2xl text-body-lg text-muted-foreground">{description}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
