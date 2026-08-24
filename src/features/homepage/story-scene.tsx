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
            <p className="overline text-terra-500">{subheadline}</p>
          </Reveal>
        ) : null}
        {headline ? (
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-[18ch] font-display text-display-md">{headline ?? name}</h2>
          </Reveal>
        ) : null}

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {scenes.map((paragraph, index) => (
            <Reveal key={index} delay={0.1 + index * 0.1}>
              <div className="flex flex-col gap-4 border-t-2 border-border pt-6">
                <span
                  aria-hidden
                  className="font-display text-caption tracking-[0.2em] text-terra-500"
                >
                  0{index + 1}
                </span>
                <p className="text-body-lg leading-relaxed text-muted-foreground">{paragraph}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
