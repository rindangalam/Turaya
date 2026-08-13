"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function LenisProvider({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduce) return;
    // Smooth scroll is a public-site experience; the admin surface scrolls natively.
    if (pathname.startsWith("/admin")) return;
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
  }, [reduce, pathname]);

  return <>{children}</>;
}
