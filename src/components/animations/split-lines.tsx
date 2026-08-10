"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";
import { MOTION } from "@/lib/motion";

type SplitLinesProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function SplitLines({ text, className, delay = 0 }: SplitLinesProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className} aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: MOTION.duration.component,
                ease: MOTION.easing.luxury,
                delay: delay + index * MOTION.stagger.experience,
              }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
