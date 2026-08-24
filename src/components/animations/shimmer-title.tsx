"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Section title with a one-time champagne shimmer sweep
 * when it enters the viewport. Settles on solid champagne gold
 * so the text stays readable after the animation.
 */
export function ShimmerTitle({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={className}
      style={{
        backgroundImage:
          "linear-gradient(110deg, var(--color-terra-500) 38%, var(--color-honey-300) 50%, var(--color-terra-500) 62%)",
        backgroundSize: "220% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
      initial={reduce ? undefined : { backgroundPosition: "140% 0%" }}
      whileInView={reduce ? undefined : { backgroundPosition: "-40% 0%" }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  );
}
