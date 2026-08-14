"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { MOTION } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type StorySceneProps = {
  name: string;
  headline: string | null;
  subheadline: string | null;
  body: string | null;
};

export function StoryScene({ name, headline, subheadline, body }: StorySceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const scenes = (body ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .slice(0, 3);

  useEffect(() => {
    const root = rootRef.current;
    if (reduce || scenes.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-story-scene]", root);
      if (items.length === 0) return;

      gsap.fromTo(
        "[data-story-progress]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: `+=${items.length * 100}%`,
            scrub: true,
          },
        },
      );

      const tl = gsap.timeline({
        defaults: { ease: MOTION.easing.soft as unknown as gsap.EaseString },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${items.length * 100}%`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });

      items.forEach((item, index) => {
        if (index === 0) return;
        const previous = items[index - 1];
        const position = (index - 1) * 0.5;
        tl.to(previous, { autoAlpha: 0, y: -24, duration: 0.5 }, position)
          .fromTo(item, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5 }, position);
      });
    });

    return () => mm.revert();
  }, [reduce, scenes.length]);

  if (scenes.length === 0) return null;

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-y border-border/60 bg-background py-24"
    >
      <div className="container-turaya relative">
        {subheadline ? (
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-champagne-500/80" />
            <p className="overline text-champagne-400">{subheadline}</p>
          </div>
        ) : null}
        {headline ? (
          <h2 className="mt-6 max-w-[18ch] font-display text-display-md">{headline ?? name}</h2>
        ) : null}
      </div>

      {reduce ? (
        <div className="container-turaya mt-12 flex flex-col gap-10">
          {scenes.map((paragraph, index) => (
            <p key={index} className="max-w-prose text-body leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <div className="container-turaya relative mt-12 flex h-[65svh] items-start justify-center">
          <div className="relative h-full w-full">
            {scenes.map((paragraph, index) => (
              <div
                key={index}
                data-story-scene
                className="absolute inset-0 flex items-start justify-start"
              >
                <p className="max-w-prose text-body-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              </div>
            ))}
            <div className="absolute bottom-8 left-0 h-px w-full overflow-hidden bg-border">
              <div data-story-progress className="h-full origin-left scale-x-0 bg-champagne-400" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
