"use client";

import { useMemo, useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Tag = { id: string; name: string };

export function TagsEditor({
  tags,
  initial,
}: {
  tags: Tag[];
  initial: Tag[];
}) {
  const [selected, setSelected] = useState<string[]>(() => initial.map((tag) => tag.id));
  const [pending, setPending] = useState<string[]>(() =>
    initial
      .filter((tag) => !tags.some((candidate) => candidate.id === tag.id))
      .map((tag) => tag.name),
  );
  const [draft, setDraft] = useState("");

  const names = useMemo(() => {
    const map = new Map(tags.map((tag) => [tag.id, tag.name]));
    for (const tag of initial) {
      if (!map.has(tag.id)) {
        map.set(tag.id, tag.name);
      }
    }
    return map;
  }, [tags, initial]);

  const taken = new Set([...selected, ...pending.map((name) => name.toLowerCase())]);
  const assignable = tags.filter((tag) => !taken.has(tag.id));

  function add(id: string) {
    if (!id) return;
    setSelected((prev) => [...prev, id]);
  }

  function remove(id: string) {
    setSelected((prev) => prev.filter((candidate) => candidate !== id));
  }

  function queueNew() {
    const name = draft.trim();
    if (!name) return;
    if (taken.has(name.toLowerCase())) {
      setDraft("");
      return;
    }
    setPending((prev) => [...prev, name]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="tags" value={selected.join(",")} />
      <input type="hidden" name="new_tags" value={pending.join(",")} />

      <ol className="flex flex-wrap items-center gap-1.5">
        {selected.length === 0 && pending.length === 0 ? (
          <li className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
            No tags yet. Pick from the list or create a new one.
          </li>
        ) : (
          <>
            {selected.map((id) => (
              <li
                key={id}
                className="flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-sm"
              >
                <span>{names.get(id) ?? "Unknown"}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(id)}
                  aria-label={`Remove ${names.get(id) ?? "tag"}`}
                >
                  <XIcon className="size-3" aria-hidden="true" />
                </Button>
              </li>
            ))}
            {pending.map((name) => (
              <li
                key={name}
                className="flex items-center gap-1 rounded-full border border-dashed border-champagne-500/60 bg-champagne-500/10 px-2.5 py-1 text-sm"
              >
                <span>{name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setPending((prev) => prev.filter((candidate) => candidate !== name))}
                  aria-label={`Remove new tag ${name}`}
                >
                  <XIcon className="size-3" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </>
        )}
      </ol>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <div className="grid gap-1.5">
          <Label htmlFor="journal-tag-add">Add existing tag</Label>
          <select
            id="journal-tag-add"
            value=""
            onChange={(event) => {
              add(event.target.value);
              event.currentTarget.value = "";
            }}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            <option value="">Select…</option>
            {assignable.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="journal-tag-new">New tag</Label>
          <div className="flex items-center gap-2">
            <Input
              id="journal-tag-new"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  queueNew();
                }
              }}
              placeholder="e.g. bahan-lokal"
              className="w-40"
            />
            <Button type="button" variant="outline" size="icon" onClick={queueNew} aria-label="Add new tag">
              <PlusIcon className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
