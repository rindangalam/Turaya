import Link from "next/link";
import Image from "next/image";
import { BoxIcon, PencilIcon, StarIcon } from "lucide-react";

import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { ProductStatusBadge } from "@/features/admin/products/product-status-badge";
import { DeleteProductButton } from "@/features/admin/products/delete-product-button";
import { formatDateTime, formatPrice } from "@/lib/format";
import { getStoragePublicUrl } from "@/lib/storage";
import type { ProductListItem } from "@/services/products";

export function ProductsList({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<BoxIcon className="size-6" aria-hidden="true" />}
        title="No products found"
        description="Adjust your search or create your first product."
        action={
          <Button size="sm" render={<Link href="/admin/products/new" />}>
            New product
          </Button>
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">
              Product
            </th>
            <th scope="col" className="hidden px-4 py-2 font-medium md:table-cell">
              Category
            </th>
            <th scope="col" className="hidden px-4 py-2 font-medium sm:table-cell">
              Price
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Status
            </th>
            <th scope="col" className="hidden px-4 py-2 font-medium lg:table-cell">
              Updated
            </th>
            <th scope="col" className="px-4 py-2">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-muted/40">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {product.imagePath ? (
                    <Image
                      src={getStoragePublicUrl("products", product.imagePath)}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                      <BoxIcon className="size-4" aria-hidden="true" />
                    </span>
                  )}
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="block min-w-0 focus-visible:outline-none focus-visible:underline"
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="truncate">{product.name}</span>
                      {product.featured ? (
                        <StarIcon className="size-3.5 shrink-0 text-champagne-500" aria-label="Featured" />
                      ) : null}
                    </span>
                    <span className="block truncate font-mono text-xs text-muted-foreground">
                      {product.slug}
                    </span>
                  </Link>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                {product.categoryName ?? "—"}
              </td>
              <td className="hidden px-4 py-3 tabular-nums text-muted-foreground sm:table-cell">
                {formatPrice(product.price)}
              </td>
              <td className="px-4 py-3">
                <ProductStatusBadge status={product.status} />
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                {formatDateTime(product.updated_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={<Link href={`/admin/products/${product.id}/edit`} />}
                    aria-label={`Edit ${product.name}`}
                  >
                    <PencilIcon className="size-3.5" aria-hidden="true" />
                  </Button>
                  <DeleteProductButton id={product.id} name={product.name} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
