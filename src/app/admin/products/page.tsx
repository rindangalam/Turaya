import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { ProductsList } from "@/features/admin/products/products-list";
import { ProductsToolbar } from "@/features/admin/products/products-toolbar";
import { listProducts } from "@/services/products";
import { PRODUCT_STATUSES, isProductSort } from "@/lib/validation/product";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const status =
    params.status && (PRODUCT_STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : undefined;
  const sort = params.sort && isProductSort(params.sort) ? params.sort : "updated_desc";

  const products = await listProducts({ q: q || undefined, status, sort });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="Create, edit, publish and archive fragrances."
      >
        <Button size="sm" render={<Link href="/admin/products/new" />}>
          <PlusIcon aria-hidden="true" />
          New product
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <ProductsToolbar q={q} status={status ?? ""} sort={sort} />
        <nav aria-label="Product status filter" className="flex flex-wrap gap-1">
          <FilterTab
            href={statusHref(undefined, q, sort)}
            label="All"
            active={status === undefined}
          />
          {PRODUCT_STATUSES.map((candidate) => (
            <FilterTab
              key={candidate}
              href={statusHref(candidate, q, sort)}
              label={candidate}
              active={status === candidate}
            />
          ))}
        </nav>
      </div>

      <ProductsList products={products} />
    </div>
  );
}

function statusHref(status: string | undefined, q: string, sort: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (sort !== "updated_desc") params.set("sort", sort);
  const query = params.toString();
  return query ? `/admin/products?${query}` : "/admin/products";
}

function FilterTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-lg border border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active && "border-border bg-background font-medium text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
