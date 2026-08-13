import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { PageHeader } from "@/components/layout/page-header";
import { getSeoMetadata } from "@/services/seo";
import { listPublishedPosts } from "@/services/journal";
import { getStoragePublicUrl } from "@/lib/storage";
import { formatRelativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("journal");
  return {
    title: seo?.title ?? "Jurnal",
    description: seo?.description ?? "Catatan, kisah, dan perjalanan Turaya.",
  };
}

export default async function JournalPage() {
  const posts = await listPublishedPosts();

  return (
    <div>
      <PageHeader
        overline="Jurnal"
        title="Jurnal"
        description="Catatan perjalanan, kisah bahan, dan pemikiran tentang wangi Nusantara."
      />

      <section className="container-turaya py-16 md:py-24">
        {posts.length === 0 ? (
          <p className="text-body-lg text-muted-foreground">
            Jurnal belum memiliki tulisan. Silakan kembali lagi nanti.
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const imageUrl = post.coverImagePath
                ? getStoragePublicUrl("journal", post.coverImagePath)
                : null;
              return (
                <Link
                  key={post.id}
                  href={`/journal/${post.slug}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-input/20">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-end p-5">
                        <span className="overline text-caption text-muted-foreground">{post.slug}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3 text-caption uppercase tracking-wider text-muted-foreground">
                    {post.categoryName ? <span className="text-champagne-400">{post.categoryName}</span> : null}
                    {post.publishedAt ? <time dateTime={post.publishedAt}>{formatRelativeTime(post.publishedAt)}</time> : null}
                  </div>
                  <h2 className="mt-3 font-display text-heading-lg text-ivory-50 transition-colors group-hover:text-champagne-400">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-body-sm text-muted-foreground">{post.excerpt}</p>
                  ) : null}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
