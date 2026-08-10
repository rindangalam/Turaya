"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { MOTION } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={
        reduce
          ? undefined
          : {
              duration: MOTION.duration.experience,
              ease: MOTION.easing.luxury,
              delay,
            }
      }
    >
      {children}
    </motion.div>
  );
}
