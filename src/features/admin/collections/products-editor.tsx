"use client";

import { useMemo, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type InitialProduct = {
  product_id: string;
  name: string;
};

export function ProductsEditor({
  products,
  initial,
}: {
  products: { id: string; name: string }[];
  initial: InitialProduct[];
}) {
  const [selected, setSelected] = useState<string[]>(() =>
    initial.map((product) => product.product_id),
  );

  const names = useMemo(() => {
    const map = new Map(products.map((product) => [product.id, product.name]));
    for (const product of initial) {
      if (!map.has(product.product_id)) {
        map.set(product.product_id, product.name);
      }
    }
    return map;
  }, [products, initial]);

  function move(index: number, direction: -1 | 1) {
    setSelected((prev) => {
      const ids = [...prev];
      const target = index + direction;
      if (target < 0 || target >= ids.length) return prev;
      [ids[index], ids[target]] = [ids[target], ids[index]];
      return ids;
    });
  }

  function remove(index: number) {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }

  const assignable = products.filter((product) => !selected.includes(product.id));
  const [addValue, setAddValue] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="products" value={selected.join(",")} />

      {selected.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">
          No products assigned yet
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {selected.map((productId, index) => (
            <li
              key={productId}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-sm">
                {names.get(productId) ?? "Unknown"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                aria-label={`Move ${names.get(productId) ?? "product"} up`}
              >
                <ArrowUpIcon className="size-3.5" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={index === selected.length - 1}
                onClick={() => move(index, 1)}
                aria-label={`Move ${names.get(productId) ?? "product"} down`}
              >
                <ArrowDownIcon className="size-3.5" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(index)}
                aria-label={`Remove ${names.get(productId) ?? "product"}`}
              >
                <XIcon className="size-3.5" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ol>
      )}

      <div className="grid gap-1.5">
        <Label htmlFor="collection-products-add">Add product</Label>
        <select
          id="collection-products-add"
          value={addValue}
          onChange={(event) => {
            const id = event.target.value;
            if (id) {
              setSelected((prev) => [...prev, id]);
            }
            setAddValue("");
          }}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        >
          <option value="">Select…</option>
          {assignable.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
