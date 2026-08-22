"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

const STAGES = [
  { key: "top", label: "Top notes", width: "56%", tone: "var(--color-honey-300)" },
  { key: "middle", label: "Heart notes", width: "78%", tone: "var(--color-champagne-400)" },
  { key: "base", label: "Base notes", width: "100%", tone: "var(--color-champagne-600)" },
] as const;

type NoteStage = "top" | "middle" | "base";

/**
 * "Piramida Aroma" — the olfactory pyramid builds itself tier by tier
 * as it enters the viewport. Static list fallback under reduced motion.
 */
export function AromaPyramid({
  noteStages,
}: {
  noteStages: Record<NoteStage, { name: string }[]>;
}) {
  const reduce = useReducedMotion();
  const hasAny = STAGES.some((stage) => (noteStages[stage.key]?.length ?? 0) > 0);
  if (!hasAny) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      {STAGES.map((stage, index) => {
        const notes = noteStages[stage.key] ?? [];
        const style: CSSProperties = { width: stage.width };
        return (
          <motion.div
            key={stage.key}
            style={style}
            initial={reduce ? false : { opacity: 0, y: 26 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={
              reduce
                ? undefined
                : {
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.16,
                  }
            }
            className="w-full border border-border/60 bg-input/20 px-4 py-4 text-center"
          >
            <p
              className="overline text-caption"
              style={{ color: stage.tone }}
            >
              {stage.label}
            </p>
            <p className="mt-2 font-display text-body-lg text-foreground">
              {notes.length > 0
                ? notes.map((note) => note.name).join(" · ")
                : "—"}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
