import { Reveal } from "@/components/animations/reveal";

type StorySceneProps = {
  name: string;
  headline: string | null;
  subheadline: string | null;
  body: string | null;
};

export function StoryScene({ name, headline, subheadline, body }: StorySceneProps) {
  const scenes = (body ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (scenes.length === 0) return null;

  return (
    <section className="border-y border-border/60 bg-background py-24">
      <div className="container-turaya">
        {subheadline ? (
          <Reveal>
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-terra-500/80" />
              <p className="overline text-terra-500">{subheadline}</p>
            </div>
          </Reveal>
        ) : null}
        {headline ? (
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-[18ch] font-display text-display-md">{headline ?? name}</h2>
          </Reveal>
        ) : null}
        <div className="mt-12 flex flex-col gap-10">
          {scenes.map((paragraph, index) => (
            <Reveal key={index} delay={0.1 + index * 0.06}>
              <p className="max-w-prose text-body-lg leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
