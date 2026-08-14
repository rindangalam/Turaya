type JsonLdRecord = Record<string, unknown>;

export function OrganizationJsonLd({
  name,
  url,
  logoUrl,
  contactEmail,
  sameAs,
}: {
  name: string;
  url: string;
  logoUrl?: string | null;
  contactEmail?: string | null;
  sameAs?: string[];
}): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name,
    url,
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(contactEmail ? { email: contactEmail } : {}),
    ...(sameAs && sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function BreadcrumbJsonLd({
  items,
  baseUrl,
}: {
  items: { name: string; path: string }[];
  baseUrl: string;
}): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}

export function ProductJsonLd({
  name,
  description,
  url,
  imageUrl,
  sku,
  price,
  currency = "IDR",
}: {
  name: string;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
  sku?: string;
  price?: number | null;
  currency?: string;
}): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(description ? { description } : {}),
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(sku ? { sku } : {}),
    ...(price != null
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            availability: "https://schema.org/InStock",
            url,
          },
        }
      : {}),
  };
}

export function CollectionPageJsonLd({
  name,
  description,
  url,
  imageUrl,
}: {
  name: string;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
}): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    ...(description ? { description } : {}),
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    isPartOf: {
      "@id": `${url.split("/collections")[0]}/#organization`,
    },
  };
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  publisherName,
  publisherUrl,
  publisherLogoUrl,
}: {
  headline: string;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName: string;
  publisherName: string;
  publisherUrl: string;
  publisherLogoUrl?: string | null;
}): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    ...(description ? { description } : {}),
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: { "@type": "Organization", name: authorName, url: publisherUrl },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      url: publisherUrl,
      ...(publisherLogoUrl ? { logo: { "@type": "ImageObject", url: publisherLogoUrl } } : {}),
    },
  };
}

export function FaqPageJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
