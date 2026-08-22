"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const MAX_TILT_DEG = 5;

/**
 * 3D tilt toward the cursor with a champagne sheen sweep.
 * Disabled on touch devices and under prefers-reduced-motion.
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);

  const apply = (mx: number, my: number, rx: number, ry: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-mx", `${(mx * 100).toFixed(2)}%`);
    el.style.setProperty("--tilt-my", `${(my * 100).toFixed(2)}%`);
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    el.style.setProperty("--sheen-o", "1");
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--sheen-o", "0");
  };

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const mx = (event.clientX - rect.left) / rect.width;
    const my = (event.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      apply(mx, my, (0.5 - my) * MAX_TILT_DEG, (mx - 0.5) * MAX_TILT_DEG);
    });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn("tilt-card relative will-change-transform", className)}
      style={{ transformStyle: "preserve-3d", transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 tilt-sheen"
        style={{
          background:
            "radial-gradient(420px circle at var(--tilt-mx,50%) var(--tilt-my,50%), rgba(212,181,119,0.22), transparent 65%)",
          opacity: "var(--sheen-o, 0)",
        }}
      />
    </div>
  );
}
