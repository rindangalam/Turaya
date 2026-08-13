import { getSiteSettings } from "@/services/settings";
import { HomepageSections } from "@/features/homepage/homepage-sections";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: settings?.site_name ?? "Turaya",
    description: settings?.tagline ?? undefined,
  };
}

export default async function Home() {
  return <HomepageSections />;
}
