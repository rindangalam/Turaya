"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  swaySpeed: number;
  phase: number;
  alpha: number;
};

const PARTICLE_COUNT = 46;

/**
 * "Kabut Aroma" — slow-rising gold dust in the hero background.
 * Pure canvas, pauses when the tab is hidden, disabled entirely under
 * prefers-reduced-motion.
 */
export function ScentMist() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;

    const seedParticle = (randomY: boolean): Particle => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + Math.random() * 40,
      r: 0.7 + Math.random() * 2.2,
      vy: 0.12 + Math.random() * 0.35,
      sway: 8 + Math.random() * 26,
      swaySpeed: 0.15 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.08 + Math.random() * 0.22,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: PARTICLE_COUNT }, () => seedParticle(true));
    };

    const drawFrame = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.vy;
        p.phase += p.swaySpeed * 0.016;
        if (p.y < -12 || width === 0) Object.assign(p, seedParticle(false));
        const x = p.x + Math.sin(p.phase) * p.sway * 0.16;
        const flicker = 0.75 + 0.25 * Math.sin(elapsed * 0.0012 + p.phase * 3);
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 181, 119, ${(p.alpha * flicker).toFixed(3)})`;
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

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
