import { getSiteSettings } from "@/services/settings";
import { HomepageSections } from "@/features/homepage/homepage-sections";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <header className="border-b border-border">
        <div className="container-turaya flex items-center justify-between py-6">
          <span className="font-display text-heading-lg">Turaya</span>
          <span className="overline text-muted-foreground">
            [PLACEHOLDER — navigation]
          </span>
        </div>
      </header>

      <main id="main" className="flex-1">
        {settings?.announcement ? (
          <div className="border-b border-border bg-noir-900 px-4 py-2 text-center">
            <p className="text-caption text-ivory-100">{settings.announcement}</p>
          </div>
        ) : null}
        <HomepageSections />
      </main>

      <footer className="bg-noir-950 text-ivory-50">
        <div className="container-turaya flex flex-col gap-6 py-16">
          <span className="font-display text-heading-lg">Turaya</span>
          <p className="max-w-prose text-body-sm text-ivory-300">
            [PLACEHOLDER — footer. Navigation and full footer ship with the public
            site sprint.]
          </p>
        </div>
      </footer>
    </>
  );
}
