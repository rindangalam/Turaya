import { cn } from "@/lib/utils";

const INGREDIENTS = [
  "Cengkih",
  "Melati",
  "Vanili",
  "Cendana",
  "Serai Wangi",
  "Kenanga",
  "Pala",
  "Pandan",
];

/**
 * Infinite editorial ribbon of Nusantara ingredients.
 * Pure CSS animation; static under prefers-reduced-motion (globals.css).
 */
export function IngredientMarquee({ className }: { className?: string }) {
  const row = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="marquee-track flex shrink-0 items-center">
      {INGREDIENTS.map((name) => (
        <span key={`${name}-${hidden}`} className="flex items-center">
          <span className="marquee-word px-8 font-sans text-2xl font-light uppercase tracking-[0.28em] md:text-4xl">{name}</span>
          <span aria-hidden className="text-champagne-500/70">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("relative overflow-hidden py-7", className)}
      role="presentation"
    >
      <div className="marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
