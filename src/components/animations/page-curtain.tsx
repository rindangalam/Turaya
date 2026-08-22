"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * "Selimut Noir" — a two-panel curtain that sweeps across the screen
 * on every route change (and on first load). Entrance-only; never blocks
 * clicks. Disabled under prefers-reduced-motion and in /admin.
 */
export function PageCurtain() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();
  const [covering, setCovering] = useState(true);
  const prevPath = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduce) return;
    if (pathname.startsWith("/admin")) return;

    const isRouteChange = prevPath.current !== null && prevPath.current !== pathname;
    prevPath.current = pathname;
    if (!isRouteChange) {
      setCovering(false);
      return;
    }

    // Cover instantly, then reveal with staggered panels.
    setCovering(true);
    timers.current.push(
      window.setTimeout(() => setCovering(false), 90),
      window.setTimeout(() => setCovering(false), 120),
    );
  }, [pathname, reduce]);

  useEffect(
    () => () => {
      for (const id of timers.current) window.clearTimeout(id);
      timers.current = [];
    },
    [],
  );

  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-95">
      {[0, 1].map((index) => (
        <span
          key={index}
          className="absolute inset-y-0 w-1/2 bg-noir-950"
          style={{
            left: index === 0 ? "0%" : "50%",
            transform: covering ? "translateY(0%)" : `translateY(${index === 0 ? "-102%" : "102%"})`,
            transition: covering
              ? "none"
              : "transform 780ms cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: covering ? "0ms" : `${index * 70}ms`,
          }}
        />
      ))}
    </div>
  );
}
