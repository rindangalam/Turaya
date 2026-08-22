import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";

import { MotionProvider } from "@/components/animations/motion-provider";
import { JsonLd } from "@/components/seo/jsonld";
import { OrganizationJsonLd } from "@/lib/seo/jsonld";
import { getSiteUrl } from "@/lib/seo/site";
import { getStoragePublicUrl } from "@/lib/storage";
import { getSiteSettings } from "@/services/settings";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: "Turaya",
      template: "%s — Turaya",
    },
    description: settings?.tagline
      ? `Parfum dan home fragrance lokal dari bahan Nusantara — ${settings.tagline}.`
      : "Parfum lokal dari bahan Indonesia — wewangian dengan karakter negeri sendiri.",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl();

  const sameAs = [settings?.instagram_url, settings?.tiktok_url].filter(
    (url): url is string => Boolean(url),
  );

  const organization = OrganizationJsonLd({
    name: settings?.site_name ?? "Turaya",
    url: siteUrl,
    logoUrl: settings?.logo_path ? getStoragePublicUrl("branding", settings.logo_path) : undefined,
    contactEmail: settings?.contact_email,
    sameAs,
  });

  return (
    <html
      lang="id"
      className={`dark ${fraunces.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={organization} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
