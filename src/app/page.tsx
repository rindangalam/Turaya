import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/animations/magnetic";
import { Parallax } from "@/components/animations/parallax";
import { Reveal } from "@/components/animations/reveal";
import { SplitLines } from "@/components/animations/split-lines";

const palette = [
  { name: "noir-950", value: "#0B0B0C" },
  { name: "noir-900", value: "#141416" },
  { name: "noir-800", value: "#1D1D21" },
  { name: "noir-700", value: "#26262B" },
  { name: "noir-600", value: "#3A3A41" },
  { name: "noir-300", value: "#8E8E96" },
  { name: "ivory-50", value: "#F5F2EC" },
  { name: "ivory-100", value: "#ECE7DD" },
  { name: "ivory-200", value: "#DDD6C8" },
  { name: "ivory-300", value: "#C9C1B0" },
  { name: "champagne-300", value: "#E3C98F" },
  { name: "champagne-400", value: "#D4B577" },
  { name: "champagne-500", value: "#C9A96A" },
  { name: "champagne-600", value: "#A8894F" },
];

const typeScale = [
  { step: "display-xl", className: "font-display text-display-xl" },
  { step: "display-lg", className: "font-display text-display-lg" },
  { step: "display-md", className: "font-display text-display-md" },
  { step: "heading-lg", className: "font-sans text-heading-lg" },
  { step: "body-lg", className: "font-sans text-body-lg" },
  { step: "body", className: "font-sans text-body" },
  { step: "overline", className: "overline" },
  { step: "caption", className: "font-sans text-caption" },
];

export default function Home() {
  return (
    <>
      <header className="border-b border-border">
        <div className="container-turaya flex items-center justify-between py-6">
          <span className="font-display text-heading-lg">Turaya</span>
          <span className="overline text-muted-foreground">
            [PLACEHOLDER — navigation]
          </span>
        </div>
      </header>

      <main id="main" className="flex-1">
        <section className="container-turaya flex min-h-[80svh] flex-col items-start justify-center">
          <Reveal>
            <p className="overline mb-6 text-champagne-400">
              [PLACEHOLDER — maison overline]
            </p>
          </Reveal>
          <h1 className="font-display text-display-xl">
            <SplitLines text="Turaya" />
          </h1>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">
              [PLACEHOLDER — one line that carries the feeling of the brand]
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Magnetic>
                <Button size="lg">[PLACEHOLDER — primary action]</Button>
              </Magnetic>
              <Button size="lg" variant="outline">
                [PLACEHOLDER — secondary action]
              </Button>
            </div>
          </Reveal>
        </section>

        <section className="container-turaya grid gap-12 py-24">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              <Parallax speed={0.2} className="h-56 rounded-md bg-noir-800" />
              <Parallax speed={0.05} className="h-56 rounded-md bg-noir-800" />
              <Parallax speed={0.3} className="h-56 rounded-md bg-noir-800" />
            </div>
          </Reveal>
          <p className="overline text-muted-foreground">
            Parallax — desktop scroll, disabled under reduced motion
          </p>
        </section>

        <section className="container-turaya py-24">
          <Reveal>
            <h2 className="font-display text-display-md">Colour</h2>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {palette.map((swatch, index) => (
              <Reveal key={swatch.name} delay={index * 0.04}>
                <li className="rounded-md border border-border p-3">
                  <div
                    className="h-16 rounded-sm border border-border"
                    style={{ backgroundColor: swatch.value }}
                  />
                  <p className="mt-3 text-caption text-muted-foreground">
                    {swatch.name}
                  </p>
                  <p className="text-caption text-muted-foreground">
                    {swatch.value}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="container-turaya py-24">
          <Reveal>
            <h2 className="font-display text-display-md">Type</h2>
          </Reveal>
          <ul className="mt-10 divide-y divide-border">
            {typeScale.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.04}>
                <li className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className={item.className}>
                    {item.step === "overline" ? "Overline — label" : "The scent of quiet"}
                  </span>
                  <span className="overline text-muted-foreground">{item.step}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="container-turaya py-24">
          <Reveal>
            <h2 className="font-display text-display-md">Motion</h2>
          </Reveal>
          <p className="mt-4 max-w-prose text-body text-muted-foreground">
            Reveal, SplitLines, Magnetic, Parallax, and Lenis smooth scroll are
            live on this page. Disable OS motion preferences to verify the
            reduced-motion path.
          </p>
        </section>
      </main>

      <footer className="bg-noir-950 text-ivory-50">
        <div className="container-turaya flex flex-col gap-6 py-16">
          <span className="font-display text-heading-lg">Turaya</span>
          <p className="max-w-prose text-body-sm text-ivory-300">
            [PLACEHOLDER — design-system scaffold page. The production homepage
            is composed from CMS sections in Sprint 11.]
          </p>
        </div>
      </footer>
    </>
  );
}
