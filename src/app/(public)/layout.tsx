import { getSiteSettings } from "@/services/settings";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <header>
        {settings?.announcement ? (
          <div className="border-b border-border/60 bg-roast-700 px-4 py-2.5 text-center">
            <p className="overline text-caption text-cream-200">
              <span aria-hidden className="mr-2 inline-block size-1.5 rounded-full bg-honey-300" />
              {settings.announcement}
            </p>
          </div>
        ) : null}
        <PublicNav siteName={settings?.site_name ?? "Turaya"} />
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <PublicFooter settings={settings} />
    </>
  );
}
