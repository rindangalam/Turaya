"use client";

import { useState, useTransition, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Drag-and-drop wrapper for server-rendered ordered rows. Renders rows in a
 * local optimistic order, persists the new order through the given server
 * action on drop, and re-syncs whenever the server order changes.
 */
export function SortableList({
  ids,
  action,
  children,
}: {
  ids: string[];
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode[];
}) {
  const idsKey = ids.join(",");
  const [order, setOrder] = useState<string[]>(ids);
  const [prevIdsKey, setPrevIdsKey] = useState(idsKey);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  if (prevIdsKey !== idsKey) {
    setPrevIdsKey(idsKey);
    setOrder(ids);
  }

  const childById = new Map(ids.map((id, index) => [id, children[index]]));

  const commit = (next: string[]) => {
    setOrder(next);
    const formData = new FormData();
    for (const id of next) formData.append("ids", id);
    startTransition(() => {
      void action(formData);
    });
  };

  const handleDrop = (target: number) => {
    const source = dragIndex;
    setDragIndex(null);
    setOverIndex(null);
    if (source === null || source === target) return;
    const next = [...order];
    const [moved] = next.splice(source, 1);
    next.splice(target, 0, moved);
    commit(next);
  };

  return (
    <ol className="flex flex-col gap-3">
      {order.map((id, index) => (
        <li
          key={id}
          draggable={dragIndex === null || dragIndex === index}
          onDragStart={() => setDragIndex(index)}
          onDragOver={(event) => {
            event.preventDefault();
            setOverIndex(index);
          }}
          onDragLeave={() => setOverIndex((prev) => (prev === index ? null : prev))}
          onDrop={(event) => {
            event.preventDefault();
            handleDrop(index);
          }}
          onDragEnd={() => {
            setDragIndex(null);
            setOverIndex(null);
          }}
          className={cn(
            "group/row relative cursor-grab active:cursor-grabbing",
            dragIndex === index && "opacity-40",
            overIndex === index && dragIndex !== null && dragIndex !== index && "rounded-xl ring-2 ring-ring/50",
          )}
        >
          {childById.get(id)}
        </li>
      ))}
    </ol>
  );
}
