"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function CursorPreview() {
  const reduce = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 25, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 25, mass: 0.5 });
  const [active, setActive] = useState<string | null>(null);
  const [finePointer, setFinePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const onChange = () => setFinePointer(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduce || !finePointer) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const onEnter = (event: PointerEvent) => {
      const element = (event.target as Element | null)?.closest("[data-preview-src]");
      const src = element?.getAttribute("data-preview-src");
      if (src) setActive(src);
    };
    const onLeave = (event: PointerEvent) => {
      const element = (event.target as Element | null)?.closest("[data-preview-src]");
      if (element) setActive(null);
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onEnter);
    document.addEventListener("pointerout", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onEnter);
      document.removeEventListener("pointerout", onLeave);
    };
  }, [reduce, finePointer, x, y]);

  const show = active !== null && !reduce && finePointer;

  return (
    <motion.div
      aria-hidden
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed left-0 top-0 z-50 hidden lg:block"
    >
      <motion.div
        initial={false}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.9 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="relative h-56 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-border bg-noir-800 shadow-2xl">
          {active ? (
            <Image src={active} alt="" fill sizes="160px" className="object-cover" />
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
