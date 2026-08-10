"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function LenisProvider({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ autoRaf: true });
    const onVisibilityChange = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      lenis.destroy();
    };
  }, [reduce]);

  return <>{children}</>;
}
