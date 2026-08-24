import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/jsonld";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/seo/site";
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
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/journal/${slug}`,
    type: "article",
    ogImageUrl: post.coverImagePath
      ? getStoragePublicUrl("journal", post.coverImagePath)
      : null,
    publishedTime: post.publishedAt ?? undefined,
  });
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
      <JsonLd
        data={[
          ArticleJsonLd({
            headline: post.title,
            description: post.excerpt,
            url: `${getSiteUrl()}/journal/${post.slug}`,
            imageUrl: imageUrl,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            authorName: "Turaya",
            publisherName: "Turaya",
            publisherUrl: getSiteUrl(),
            publisherLogoUrl: null,
          }),
          BreadcrumbJsonLd({
            baseUrl: getSiteUrl(),
            items: [
              { name: "Beranda", path: "/" },
              { name: "Jurnal", path: "/journal" },
              { name: post.title, path: `/journal/${post.slug}` },
            ],
          }),
        ]}
      />
      <article className="container-turaya max-w-3xl py-16 md:py-20">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-caption uppercase tracking-wider text-muted-foreground transition-colors hover:text-terra-500"
          >
            Jurnal
          </Link>
        </nav>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption uppercase tracking-wider text-muted-foreground">
          {post.categoryName ? (
            <span className="text-terra-500">{post.categoryName}</span>
          ) : null}
          {post.publishedAt ? (
            <time dateTime={post.publishedAt}>{formatRelativeTime(post.publishedAt)}</time>
          ) : null}
          <span aria-hidden className="text-terra-500/40">·</span>
          <span>{(post.body.length / 1200).toFixed(1)} menit baca</span>
        </div>
        <h1 className="mt-5 max-w-[18ch] font-display text-display-lg text-foreground">
          {post.title}
        </h1>
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

        <div className="mt-12 whitespace-pre-line font-serif text-body-lg leading-loose text-foreground">
          {post.body}
        </div>

        {post.tagNames.length > 0 ? (
          <footer className="mt-14">
            <h2 className="overline text-caption text-muted-foreground">Tag</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tagNames.map((tag) => (
                <li
                  key={tag}
                  className="rounded-sm border border-border/60 px-3 py-1 text-body-sm text-muted-foreground"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </footer>
        ) : null}
      </article>

      {previousPost || nextPost ? (
        <section>
          <div className="container-turaya grid gap-10 py-14 sm:grid-cols-2 sm:gap-8">
            <div className={nextPost ? "sm:pr-8" : ""}>
              {previousPost ? (
                <Link
                  href={`/journal/${previousPost.slug}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="overline text-caption text-muted-foreground">
                    Tulisan berikutnya
                  </p>
                  <p className="mt-2 max-w-prose font-display text-heading-lg text-foreground transition-colors group-hover:text-terra-500">
                    {previousPost.title}
                  </p>
                </Link>
              ) : null}
            </div>
            <div className="sm:text-right">
              {nextPost ? (
                <Link
                  href={`/journal/${nextPost.slug}`}
                  className="group block text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="overline text-caption text-muted-foreground">
                    Tulisan sebelumnya
                  </p>
                  <p className="mt-2 max-w-prose font-display text-heading-lg text-foreground transition-colors group-hover:text-terra-500">
                    {nextPost.title}
                  </p>
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
