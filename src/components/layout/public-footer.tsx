import Link from "next/link";

import type { SiteSettings } from "@/services/settings";
import { PUBLIC_NAV_ITEMS } from "./nav-items";

const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "Tentang Kami", href: "/about" },
  { label: "Filosofi", href: "/philosophy" },
  { label: "Bahan", href: "/ingredients" },
  { label: "Galeri", href: "/gallery" },
];

const FOOTER_SUPPORT: { label: string; href: string }[] = [
  { label: "Jurnal", href: "/journal" },
  { label: "Toko", href: "/stores" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontak", href: "/contact" },
];

export function PublicFooter({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-noir-950 text-ivory-300">
      <div className="container-turaya">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="font-display text-heading-lg text-ivory-50">
              {settings?.site_name ?? "Turaya"}
            </Link>
            <p className="mt-4 max-w-xs text-body-sm leading-relaxed">
              {settings?.tagline ??
                "Parfum dan home fragrance dari bahan-bahan pilihan Nusantara."}
            </p>
            {settings?.contact_email || settings?.contact_phone ? (
              <div className="mt-6 space-y-1">
                {settings.contact_email ? (
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="block text-body-sm text-ivory-100 transition-colors hover:text-champagne-400"
                  >
                    {settings.contact_email}
                  </a>
                ) : null}
                {settings.contact_phone ? (
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="block text-body-sm text-ivory-100 transition-colors hover:text-champagne-400"
                  >
                    {settings.contact_phone}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <nav aria-label="Footer — Menu">
            <p className="overline text-caption text-ivory-500">Menu</p>
            <ul className="mt-5 space-y-3">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm transition-colors hover:text-champagne-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer — Lainnya">
            <p className="overline text-caption text-ivory-500">Informasi</p>
            <ul className="mt-5 space-y-3">
              {[...FOOTER_LINKS, ...FOOTER_SUPPORT].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm transition-colors hover:text-champagne-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="overline text-caption text-ivory-500">Ikuti Kami</p>
            <ul className="mt-5 space-y-3">
              {settings?.instagram_url ? (
                <li>
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm transition-colors hover:text-champagne-400"
                  >
                    Instagram
                  </a>
                </li>
              ) : null}
              {settings?.tiktok_url ? (
                <li>
                  <a
                    href={settings.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm transition-colors hover:text-champagne-400"
                  >
                    TikTok
                  </a>
                </li>
              ) : null}
            </ul>
            <div className="mt-8 flex flex-col gap-2">
              <Link
                href="/privacy"
                className="text-caption text-ivory-500 transition-colors hover:text-ivory-200"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms"
                className="text-caption text-ivory-500 transition-colors hover:text-ivory-200"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/40 py-6 sm:flex-row">
          <p className="text-caption text-ivory-500">
            © {year} {settings?.site_name ?? "Turaya"}. Seluruh hak cipta.
          </p>
          <p className="overline text-caption text-ivory-600">Diciptakan dari Nusantara</p>
        </div>
      </div>
    </footer>
  );
}
