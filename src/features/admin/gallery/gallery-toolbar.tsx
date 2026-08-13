"use client";

export function GalleryToolbar({
  status,
  category,
  categories,
}: {
  status: string;
  category: string;
  categories: string[];
}) {
  return (
    <form method="get" action="/admin/gallery" className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="status" value={status} />
      <select
        name="category"
        defaultValue={category}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        aria-label="Filter gallery by category"
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
      >
        <option value="">All categories</option>
        {categories.map((candidate) => (
          <option key={candidate} value={candidate}>
            {candidate}
          </option>
        ))}
      </select>
    </form>
  );
}
