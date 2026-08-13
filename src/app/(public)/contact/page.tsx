import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/features/contact/contact-form";
import { getSiteSettings } from "@/services/settings";
import { getSeoMetadata } from "@/services/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("contact");
  return {
    title: seo?.title ?? "Kontak",
    description: seo?.description ?? "Hubungi tim Turaya.",
  };
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
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="overline text-caption text-ivory-400">Email</h2>
            <a
              href={`mailto:${settings?.contact_email ?? "halo@turaya.co.id"}`}
              className="mt-3 block font-display text-heading-lg text-ivory-50 transition-colors hover:text-champagne-400"
            >
              {settings?.contact_email ?? "halo@turaya.co.id"}
            </a>
          </div>

          {settings?.contact_phone ? (
            <div>
              <h2 className="overline text-caption text-ivory-400">Telepon / WhatsApp</h2>
              <a
                href={`tel:${settings.contact_phone}`}
                className="mt-3 block font-display text-heading-lg text-ivory-50 transition-colors hover:text-champagne-400"
              >
                {settings.contact_phone}
              </a>
            </div>
          ) : null}

          {settings?.address ? (
            <div>
              <h2 className="overline text-caption text-ivory-400">Alamat</h2>
              <p className="mt-3 max-w-xs whitespace-pre-line text-body leading-relaxed text-muted-foreground">
                {settings.address}
              </p>
            </div>
          ) : null}

          {settings?.instagram_url ? (
            <div>
              <h2 className="overline text-caption text-ivory-400">Media sosial</h2>
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
