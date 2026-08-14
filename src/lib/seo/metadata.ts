import type { Metadata } from "next";

import { getSiteUrl } from "./site";

type OgImage =
  | { url: string; alt?: string; width?: number; height?: number }
  | { url: string; alt?: string; width?: number; height?: number }[];

type BuildMetadataArgs = {
  title: string;
  description?: string | null;
  /** Site-relative path, e.g. "/products/turaya-no-1". Defaults to "/". */
  path?: string;
  /** Absolute URL. Defaults to the canonical path on the configured site URL. */
  canonicalUrl?: string | null;
  /** Absolute image URL for Open Graph/Twitter. Falls back to /api/og brand card. */
  ogImageUrl?: string | null;
  /** Raw robots directive from CMS ("index, follow", "noindex"...) or null for default. */
  robots?: string | null;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
};

const DEFAULT_OG_IMAGE = (title: string): string =>
  `${getSiteUrl()}/api/og?title=${encodeURIComponent(title)}`;

export function buildMetadata({
  title,
  description,
  path = "/",
  canonicalUrl,
  ogImageUrl,
  robots,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataArgs): Metadata {
  const base = getSiteUrl();
  const canonical = canonicalUrl ?? `${base}${path === "/" ? "/" : path}`;
  const ogType = type === "article" ? "article" : "website";
  const ogImage: OgImage =
    ogImageUrl
      ? { url: ogImageUrl, width: 1200, height: 630, alt: title }
      : { url: DEFAULT_OG_IMAGE(title), width: 1200, height: 630, alt: title };

  const metadata: Metadata = {
    title,
    description: description ?? undefined,
    alternates: { canonical },
    robots: robots ?? { index: true, follow: true },
    openGraph: {
      title,
      description: description ?? undefined,
      url: canonical,
      type: ogType,
      siteName: "Turaya",
      images: ogImage,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
      images: [ogImageUrl ?? DEFAULT_OG_IMAGE(title)],
    },
  };

  return metadata;
}
