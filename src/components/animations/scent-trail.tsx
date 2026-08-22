"use client";

import { useEffect, useRef } from "react";

type TrailParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
};

const MAX_PARTICLES = 90;

/**
 * "Jejak Kursor Emas" — a faint gold trail behind the cursor.
 * Mouse-only (fine pointer), pauses when the tab is hidden,
 * disabled under prefers-reduced-motion.
 */
export function ScentTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: TrailParticle[] = [];
    let raf = 0;
    let running = true;
    let lastX = -1;
    let lastY = -1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number) => {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.15 - Math.random() * 0.35,
        life: 0,
        maxLife: 42 + Math.random() * 30,
        r: 0.8 + Math.random() * 1.6,
      });
    };

    const onMove = (event: PointerEvent) => {
      if (lastX < 0) {
        lastX = event.clientX;
        lastY = event.clientY;
        return;
      }
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      // Spawn along the segment so fast moves stay continuous.
      const steps = Math.min(Math.floor(dist / 14), 4);
      for (let i = 1; i <= steps; i++) {
        spawn(lastX + (dx * i) / steps, lastY + (dy * i) / steps);
      }
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter((p) => p.life < p.maxLife);
      for (const p of particles) {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.006;
        const t = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * t, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 181, 119, ${(0.34 * t).toFixed(3)})`;
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(drawFrame);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(drawFrame);
      else cancelAnimationFrame(raf);
    };

    resize();
    raf = requestAnimationFrame(drawFrame);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 hidden h-full w-full md:block"
    />
  );
}
