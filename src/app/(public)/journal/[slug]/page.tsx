import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getPublishedPostBySlug, listPublishedPosts } from "@/services/journal";
import { getStoragePublicUrl } from "@/lib/storage";
import { formatRelativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Jurnal" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  const allPosts = await listPublishedPosts();
  const nextPost = allPosts.find(
    (candidate) => candidate.id !== post.id && candidate.publishedAt && post.publishedAt
      ? candidate.publishedAt < post.publishedAt
      : false,
  );
  const previousPost = [...allPosts]
    .reverse()
    .find((candidate) =>
      candidate.id !== post.id && candidate.publishedAt && post.publishedAt
        ? candidate.publishedAt > post.publishedAt
        : false,
    );

  const imageUrl = post.coverImagePath ? getStoragePublicUrl("journal", post.coverImagePath) : null;

  return (
    <div>
      <article className="container-turaya max-w-3xl py-16 md:py-20">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/journal"
            className="text-caption uppercase tracking-wider text-muted-foreground transition-colors hover:text-champagne-400"
          >
            ← Jurnal
          </Link>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-caption uppercase tracking-wider text-muted-foreground">
          {post.categoryName ? <span className="text-champagne-400">{post.categoryName}</span> : null}
          {post.publishedAt ? <time dateTime={post.publishedAt}>{formatRelativeTime(post.publishedAt)}</time> : null}
        </div>
        <h1 className="mt-4 font-display text-display-lg text-ivory-50">{post.title}</h1>
        {post.excerpt ? (
          <p className="mt-6 text-body-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
        ) : null}

        {imageUrl ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden bg-input/20">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-12 whitespace-pre-line font-serif text-body-lg leading-relaxed text-ivory-200">
          {post.body}
        </div>

        {post.tagNames.length > 0 ? (
          <footer className="mt-14 border-t border-border/50 pt-8">
            <h2 className="overline text-caption text-muted-foreground">Tag</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tagNames.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border/60 px-3 py-1 text-body-sm text-ivory-200"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </footer>
        ) : null}
      </article>

      {previousPost || nextPost ? (
        <section className="border-t border-border/50">
          <div className="container-turaya grid gap-8 py-12 sm:grid-cols-2">
            {previousPost ? (
              <Link
                href={`/journal/${previousPost.slug}`}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <p className="overline text-caption text-muted-foreground">Tulisan berikutnya</p>
                <p className="mt-2 font-display text-heading-lg text-ivory-50 transition-colors group-hover:text-champagne-400">
                  {previousPost.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {nextPost ? (
              <Link
                href={`/journal/${nextPost.slug}`}
                className="group block text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <p className="overline text-caption text-muted-foreground">Tulisan sebelumnya</p>
                <p className="mt-2 font-display text-heading-lg text-ivory-50 transition-colors group-hover:text-champagne-400">
                  {nextPost.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
