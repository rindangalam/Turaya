import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { Pagination } from "@/components/admin/pagination";
import { Button } from "@/components/ui/button";
import { ProductsList } from "@/features/admin/products/products-list";
import { ProductsToolbar } from "@/features/admin/products/products-toolbar";
import { countProducts, getProductStatusCounts, listProducts } from "@/services/products";
import { PRODUCT_STATUSES, isProductSort } from "@/lib/validation/product";
import { contentStatusLabel } from "@/lib/labels";

export const metadata: Metadata = { title: "Produk" };

const PAGE_SIZE = 20;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string; page?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const status =
    params.status && (PRODUCT_STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : undefined;
  const sort = params.sort && isProductSort(params.sort) ? params.sort : "updated_desc";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const [products, total, statusCounts] = await Promise.all([
    listProducts({ q: q || undefined, status, sort, page, pageSize: PAGE_SIZE }),
    countProducts({ q: q || undefined, status }),
    getProductStatusCounts(),
  ]);
  const statusTotal = PRODUCT_STATUSES.reduce(
    (sum, candidate) => sum + (statusCounts[candidate] ?? 0),
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Produk"
        description="Buat, edit, terbitkan, dan arsipkan parfum."
      >
        <Button size="sm" render={<Link href="/admin/products/new" />}>
          <PlusIcon aria-hidden="true" />
          Produk baru
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <ProductsToolbar q={q} status={status ?? ""} sort={sort} />
        <FilterTabs
          label="Filter status produk"
          items={[
            {
              href: statusHref(undefined, q, sort),
              label: "Semua",
              count: statusTotal,
              active: status === undefined,
            },
            ...PRODUCT_STATUSES.map((candidate) => ({
              href: statusHref(candidate, q, sort),
              label: contentStatusLabel(candidate),
              count: statusCounts[candidate] ?? 0,
              active: status === candidate,
            })),
          ]}
        />
      </div>

      <ProductsList products={products} />

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        label="produk"
        hrefFor={(target) => pageHref(target, q, status, sort)}
      />
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

function pageHref(page: number, q: string, status: string | undefined, sort: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (sort !== "updated_desc") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/products?${query}` : "/admin/products";
}
