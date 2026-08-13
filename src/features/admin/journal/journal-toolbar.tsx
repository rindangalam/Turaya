"use client";

import { Input } from "@/components/ui/input";

export function JournalToolbar({
  q,
  status,
  category,
  categories,
}: {
  q: string;
  status: string;
  category: string;
  categories: { id: string; name: string }[];
}) {
  return (
    <form method="get" action="/admin/journal" className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="status" value={status} />
      <Input
        name="q"
        defaultValue={q}
        placeholder="Search title, slug or excerpt…"
        aria-label="Search journal posts"
        className="w-64"
      />
      <select
        name="category"
        defaultValue={category}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        aria-label="Filter journal posts by category"
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
      >
        <option value="">All categories</option>
        {categories.map((candidate) => (
          <option key={candidate.id} value={candidate.id}>
            {candidate.name}
          </option>
        ))}
      </select>
    </form>
  );
}
