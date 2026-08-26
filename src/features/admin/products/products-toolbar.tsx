"use client";

import { Input } from "@/components/ui/input";
import { PRODUCT_SORTS } from "@/lib/validation/product";

const SORT_LABELS: Record<string, string> = {
  updated_desc: "Terbaru diperbarui",
  updated_asc: "Terlama diperbarui",
  name_asc: "Nama A-Z",
  name_desc: "Nama Z-A",
  price_desc: "Harga tinggi-rendah",
  price_asc: "Harga rendah-tinggi",
};

export function ProductsToolbar({
  q,
  status,
  sort,
}: {
  q: string;
  status: string;
  sort: string;
}) {
  return (
    <form method="get" action="/admin/products" className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="status" value={status} />
      <Input
        name="q"
        defaultValue={q}
        placeholder="Cari nama atau slug…"
        aria-label="Cari produk"
        className="w-64"
      />
      <select
        name="sort"
        defaultValue={sort}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        aria-label="Urutkan produk"
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
      >
        {PRODUCT_SORTS.map((option) => (
          <option key={option.value} value={option.value}>
            {SORT_LABELS[option.value] ?? option.label}
          </option>
        ))}
      </select>
    </form>
  );
}
