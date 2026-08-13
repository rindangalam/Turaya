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
      {settings?.announcement ? (
        <div className="bg-noir-900 px-4 py-2 text-center">
          <p className="text-caption text-ivory-100">{settings.announcement}</p>
        </div>
      ) : null}
      <PublicNav siteName={settings?.site_name ?? "Turaya"} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <PublicFooter settings={settings} />
    </>
  );
}
