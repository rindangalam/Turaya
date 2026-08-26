"use client";

import { useMemo, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const STAGES = [
  {
    value: "top",
    label: "Atas",
    description: "Kesan pertama — menguap dengan cepat.",
  },
  {
    value: "heart",
    label: "Tengah",
    description: "Karakter inti dari wewangian.",
  },
  {
    value: "base",
    label: "Dasar",
    description: "Fondasi yang bertahan paling lama.",
  },
] as const;

type InitialNote = {
  ingredient_id: string;
  name: string;
  note_stage: string;
};

export function NotesEditor({
  ingredients,
  initial,
}: {
  ingredients: { id: string; name: string }[];
  initial: InitialNote[];
}) {
  const [byStage, setByStage] = useState<Record<string, string[]>>(() => {
    const groups: Record<string, string[]> = { top: [], heart: [], base: [] };
    for (const note of initial) {
      if (note.note_stage in groups) {
        groups[note.note_stage].push(note.ingredient_id);
      }
    }
    return groups;
  });

  const names = useMemo(() => {
    const map = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient.name]));
    for (const note of initial) {
      if (!map.has(note.ingredient_id)) {
        map.set(note.ingredient_id, note.name);
      }
    }
    return map;
  }, [ingredients, initial]);

  function add(stage: string, ingredientId: string) {
    if (!ingredientId) return;
    setByStage((prev) => ({
      ...prev,
      [stage]: [...prev[stage], ingredientId],
    }));
  }

  function move(stage: string, index: number, direction: -1 | 1) {
    setByStage((prev) => {
      const ids = [...prev[stage]];
      const target = index + direction;
      if (target < 0 || target >= ids.length) return prev;
      [ids[index], ids[target]] = [ids[target], ids[index]];
      return { ...prev, [stage]: ids };
    });
  }

  function remove(stage: string, index: number) {
    setByStage((prev) => ({
      ...prev,
      [stage]: prev[stage].filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {STAGES.map((stage) => {
        const ids = byStage[stage.value];
        const assignable = ingredients.filter(
          (ingredient) =>
            !Object.values(byStage).some((stageIds) => stageIds.includes(ingredient.id)),
        );

        return (
          <section key={stage.value} className="flex flex-col gap-3">
            <input type="hidden" name={`notes_${stage.value}`} value={ids.join(",")} />
            <div>
              <h3 className="text-sm font-medium">{stage.label}</h3>
              <p className="text-xs text-muted-foreground">{stage.description}</p>
            </div>

            {ids.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                Belum ada bahan
              </p>
            ) : (
              <ol className="flex flex-col gap-2">
                {ids.map((ingredientId, index) => (
                  <li
                    key={ingredientId}
                    className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-2"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {names.get(ingredientId) ?? "Tidak dikenal"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === 0}
                      onClick={() => move(stage.value, index, -1)}
                      aria-label={`Naikkan ${names.get(ingredientId) ?? "bahan"}`}
                    >
                      <ArrowUpIcon className="size-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === ids.length - 1}
                      onClick={() => move(stage.value, index, 1)}
                      aria-label={`Turunkan ${names.get(ingredientId) ?? "bahan"}`}
                    >
                      <ArrowDownIcon className="size-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(stage.value, index)}
                      aria-label={`Hapus ${names.get(ingredientId) ?? "bahan"}`}
                    >
                      <XIcon className="size-3.5" aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ol>
            )}

            <AddIngredientSelect
              id={`notes-${stage.value}-add`}
              label={`Tambah ke nada ${stage.label.toLowerCase()}`}
              options={assignable}
              onSelect={(id) => add(stage.value, id)}
            />
          </section>
        );
      })}
    </div>
  );
}

function AddIngredientSelect({
  id,
  label,
  options,
  onSelect,
}: {
  id: string;
  label: string;
  options: { id: string; name: string }[];
  onSelect: (id: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          onSelect(event.target.value);
          setValue("");
        }}
        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
      >
        <option value="">Pilih…</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
