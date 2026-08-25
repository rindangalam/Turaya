"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  // Lenis must not run on /admin at all: lenis.stop() freezes scrolling
  // (wheel preventDefault + `.lenis-stopped { overflow: hidden }`), which
  // made admin pages unscrollable. Destroy it there instead; native
  // scrolling applies, and Lenis is recreated on return to the public site.
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (reduce || isAdmin) return;

    const lenis = new Lenis({ autoRaf: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onVisibilityChange = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce, isAdmin]);

  useEffect(() => {
    if (reduce || isAdmin) return;
    lenisRef.current?.start();
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, reduce, isAdmin]);

  return <>{children}</>;
}
