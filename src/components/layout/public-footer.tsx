import Link from "next/link";
import Image from "next/image";

import type { SiteSettings } from "@/services/settings";
import { getStoragePublicUrl } from "@/lib/storage";

const FOOTER_EXPLORE: { label: string; href: string }[] = [
  { label: "Produk", href: "/products" },
  { label: "Koleksi", href: "/collections" },
  { label: "Bahan", href: "/ingredients" },
  { label: "Galeri", href: "/gallery" },
  { label: "Jurnal", href: "/journal" },
];

const FOOTER_INFO: { label: string; href: string }[] = [
  { label: "Tentang Kami", href: "/about" },
  { label: "Filosofi", href: "/philosophy" },
  { label: "Toko", href: "/stores" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontak", href: "/contact" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={`Footer — ${title}`}>
      <p className="overline text-caption text-roast-300">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-body-sm transition-colors hover:text-honey-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PublicFooter({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();
  const logoUrl = settings?.logo_path
    ? getStoragePublicUrl("branding", settings.logo_path)
    : undefined;

  return (
    <footer className="bg-noir-950 text-ivory-200">
      <div className="container-turaya">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt=""
                  aria-hidden
                  width={36}
                  height={36}
                  className="size-9 rounded-full object-cover ring-1 ring-honey-300/40"
                />
              ) : null}
              <span className="font-display text-heading-lg text-cream-100">
                {settings?.site_name ?? "Turaya"}
              </span>
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
                    className="block text-body-sm text-cream-200 transition-colors hover:text-honey-300"
                  >
                    {settings.contact_email}
                  </a>
                ) : null}
                {settings.contact_phone ? (
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="block text-body-sm text-cream-200 transition-colors hover:text-honey-300"
                  >
                    {settings.contact_phone}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <FooterColumn title="Jelajahi" links={FOOTER_EXPLORE} />
          <FooterColumn title="Informasi" links={FOOTER_INFO} />

          <div>
            <p className="overline text-caption text-roast-300">Ikuti Kami</p>
            <ul className="mt-5 space-y-3">
              {settings?.instagram_url ? (
                <li>
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm transition-colors hover:text-honey-300"
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
                    className="text-body-sm transition-colors hover:text-honey-300"
                  >
                    TikTok
                  </a>
                </li>
              ) : null}
              {!settings?.instagram_url && !settings?.tiktok_url ? (
                <li>
                  <p className="text-body-sm text-noir-300">
                    @turaya.id
                  </p>
                </li>
              ) : null}
            </ul>
            <div className="mt-8 flex flex-col gap-2">
              <Link
                href="/privacy"
                className="text-caption text-roast-300 transition-colors hover:text-cream-200"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms"
                className="text-caption text-roast-300 transition-colors hover:text-cream-200"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/40 py-6 sm:flex-row">
          <p className="text-caption text-roast-300">
            © {year} {settings?.site_name ?? "Turaya"}. Seluruh hak cipta.
          </p>
          <p className="overline text-caption text-roast-300">Diciptakan dari Nusantara</p>
        </div>
      </div>
    </footer>
  );
}
