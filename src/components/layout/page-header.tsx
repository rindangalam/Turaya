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
    <section className="bg-clay-100/40">
      <div className="container-turaya py-12 md:py-28">
        <Reveal>
          <p className="overline text-terra-500">{overline}</p>
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
