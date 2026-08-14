import type { Metadata } from "next";

import { buildPageMetadata } from "@/services/seo";
import { HomepageSections } from "@/features/homepage/homepage-sections";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "home",
    path: "/",
    fallbackTitle: "Turaya",
    fallbackDescription:
      "Parfum lokal dari bahan Indonesia — wewangian dengan karakter negeri sendiri.",
  });
}

export default async function Home() {
  return <HomepageSections />;
}
