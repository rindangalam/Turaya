"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Fragment, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/animations/magnetic";
import { MOTION } from "@/lib/motion";

type HeroTimelineProps = {
  name: string;
  headline: string | null;
  subheadline: string | null;
  body: string | null;
  buttonLabel: string | null;
  buttonUrl: string | null;
  imageUrl: string | null;
};

export function HeroTimeline({
  name,
  headline,
  subheadline,
  body,
  buttonLabel,
  buttonUrl,
  imageUrl,
}: HeroTimelineProps) {
  const rootRef = useRef<HTMLElement>(null);
  const words = (headline ?? name).split(" ");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        defaults: { ease: MOTION.easing.luxury as unknown as gsap.EaseString },
      });

      if (imageUrl) {
        tl.fromTo(
          q("[data-hero-image]"),
          { scale: 1.08 },
          { scale: 1, duration: 1.6, ease: "power2.out" },
          0,
        );
      }

      tl.fromTo(
        q("[data-hero-overline]"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: MOTION.duration.experience },
        0.1,
      );

      tl.fromTo(
        q("[data-hero-word]"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: MOTION.duration.component,
          stagger: MOTION.stagger.experience,
        },
        0.2,
      );

      if (body) {
        tl.fromTo(
          q("[data-hero-body]"),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: MOTION.duration.experience },
          "-=0.15",
        );
      }

      if (buttonLabel && buttonUrl) {
        tl.fromTo(
          q("[data-hero-cta]"),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: MOTION.duration.experience },
          "-=0.15",
        );
      }

      tl.fromTo(
        q("[data-hero-cue]"),
        { opacity: 0 },
        { opacity: 1, duration: MOTION.duration.experience },
        "+=0.3",
      );
    });

    return () => mm.revert();
  }, [headline, body, buttonLabel, buttonUrl, imageUrl]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[70svh] flex-col items-start justify-center overflow-hidden"
    >
      {imageUrl ? (
        <div data-hero-image className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={subheadline ?? name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
      <div className="container-turaya relative flex flex-col items-start justify-center">
        {subheadline ? (
          <p data-hero-overline className="overline mb-6 text-champagne-400">
            {subheadline}
          </p>
        ) : null}
        <h1 className="max-w-[16ch] font-display text-display-xl" aria-label={headline ?? name}>
          {words.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span
                aria-hidden
                className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <span data-hero-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
              {index < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h1>
        {body ? (
          <p data-hero-body className="mt-6 max-w-prose text-body-lg text-muted-foreground">
            {body}
          </p>
        ) : null}
        {buttonLabel && buttonUrl ? (
          <div data-hero-cta className="mt-10">
            <Magnetic>
              <Button size="lg" render={<Link href={buttonUrl} />}>
                {buttonLabel}
              </Button>
            </Magnetic>
          </div>
        ) : null}
      </div>

      <div
        data-hero-cue
        aria-hidden
        className="absolute bottom-8 left-0 right-0 hidden justify-center md:flex"
      >
        <div className="flex flex-col items-center gap-3 opacity-70">
          <span className="overline text-caption text-ivory-300">Gulir</span>
          <span className="relative block h-10 w-px overflow-hidden bg-border">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.4s_var(--ease-standard)_infinite] bg-champagne-400" />
          </span>
        </div>
      </div>
    </section>
  );
}
