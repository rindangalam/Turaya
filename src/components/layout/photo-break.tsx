"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Full-bleed photographic breathing room between sections.
 * The image drifts subtly against scroll (parallax); static under
 * prefers-reduced-motion.
 */
export function PhotoBreak({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <section aria-label={caption} className="relative overflow-hidden">
      <div ref={ref} className="relative h-[52vh] overflow-hidden md:h-[64vh]">
        <motion.div
          aria-hidden
          style={reduce ? undefined : { y, top: "-12%", height: "124%" }}
          className="absolute inset-x-0"
        >
          <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950/85 via-noir-950/15 to-noir-950/45" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-turaya pb-8">
            <p className="overline text-caption text-ivory-200/85">{caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
