import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/features/contact/contact-form";
import { getSiteSettings } from "@/services/settings";
import { buildPageMetadata } from "@/services/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "contact",
    path: "/contact",
    fallbackTitle: "Kontak",
    fallbackDescription: "Hubungi tim Turaya.",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <PageHeader
        overline="Kontak"
        title="Mari mengobrol"
        description="Pertanyaan tentang produk, kolaborasi, atau sekadar ingin berbagi cerita — kami senang mendengarnya."
      />

      <section className="container-turaya grid gap-14 py-16 md:py-24 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-10">
          {[
            {
              index: "01",
              label: "Email",
              value: settings?.contact_email ?? "halo@turaya.co.id",
              href: `mailto:${settings?.contact_email ?? "halo@turaya.co.id"}`,
            },
            settings?.contact_phone
              ? {
                  index: "02",
                  label: "Telepon / WhatsApp",
                  value: settings.contact_phone,
                  href: `tel:${settings.contact_phone}`,
                }
              : null,
          ].map(
            (entry) =>
              entry ? (
                <div key={entry.label} className="border-t border-champagne-400/40 pt-5">
                  <p className="flex items-center gap-4">
                    <span className="overline text-caption tabular-nums text-champagne-500/70">
                      {entry.index}
                    </span>
                    <span className="overline text-caption text-ivory-400">{entry.label}</span>
                  </p>
                  <a
                    href={entry.href}
                    className="mt-3 block font-display text-heading-lg text-ivory-50 transition-colors hover:text-champagne-400"
                  >
                    {entry.value}
                  </a>
                </div>
              ) : null,
          )}

          {settings?.address ? (
            <div className="border-t border-champagne-400/40 pt-5">
              <p className="flex items-center gap-4">
                <span className="overline text-caption tabular-nums text-champagne-500/70">03</span>
                <span className="overline text-caption text-ivory-400">Alamat</span>
              </p>
              <p className="mt-3 max-w-xs whitespace-pre-line text-body leading-relaxed text-muted-foreground">
                {settings.address}
              </p>
            </div>
          ) : null}

          {settings?.instagram_url ? (
            <div className="border-t border-champagne-400/40 pt-5">
              <p className="flex items-center gap-4">
                <span className="overline text-caption tabular-nums text-champagne-500/70">04</span>
                <span className="overline text-caption text-ivory-400">Media sosial</span>
              </p>
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block font-display text-heading-lg text-ivory-50 transition-colors hover:text-champagne-400"
              >
                Instagram
              </a>
            </div>
          ) : null}
        </div>

        <div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
