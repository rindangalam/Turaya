import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata } from "@/services/seo";
import { listPublishedStores } from "@/services/stores";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "stores",
    path: "/stores",
    fallbackTitle: "Toko",
    fallbackDescription: "Temukan Turaya di toko terdekat.",
  });
}

function formatHours(hours: unknown): string[] {
  if (typeof hours === "string" && hours.trim()) return [hours.trim()];
  if (hours && typeof hours === "object") {
    const entries = Object.entries(hours).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string" && Boolean(entry[1].trim()),
    );
    return entries.map(([day, time]) => `${day}: ${time}`);
  }
  return [];
}

export default async function StoresPage() {
  const stores = await listPublishedStores();

  return (
    <div>
      <PageHeader
        overline="Toko"
        title="Temukan Kami"
        description="Kunjungi butik Turaya untuk merasakan langsung setiap racikan dan berkonsultasi bersama tim kami."
      />

      <section className="container-turaya py-16 md:py-24">
        {stores.length === 0 ? (
          <p className="text-body-lg text-muted-foreground">
            Informasi toko belum tersedia. Silakan kembali lagi nanti.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {stores.map((store, index) => {
              const hours = formatHours(store.hours);
              return (
                <article
                  key={store.id}
                  className="flex flex-col gap-6 border border-border/40 bg-input/10 p-8"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <div>
                      <p className="overline text-caption text-champagne-400">{store.city}</p>
                      <h2 className="mt-2 font-display text-display-md text-ivory-50">
                        {store.name}
                      </h2>
                    </div>
                    <span
                      aria-hidden
                      className="overline text-caption tabular-nums text-muted-foreground"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-body leading-relaxed text-muted-foreground">
                    {store.address}
                    <br />
                    {store.city}, {store.country}
                  </p>
                  {hours.length > 0 ? (
                    <dl className="space-y-1.5">
                      {hours.map((line) => {
                        const [day, ...rest] = line.split(":");
                        return (
                          <div key={day} className="flex justify-between gap-6 border-b border-border/20 pb-1.5 text-body-sm">
                            <dt className="text-muted-foreground">{day}</dt>
                            <dd className="tabular-nums text-ivory-200">{rest.join(":").trim()}</dd>
                          </div>
                        );
                      })}
                    </dl>
                  ) : null}
                  <div className="mt-auto flex flex-wrap gap-x-8 gap-y-2 border-t border-border/40 pt-6">
                    {store.phone ? (
                      <a
                        href={`tel:${store.phone}`}
                        className="text-body-sm text-ivory-100 transition-colors hover:text-champagne-400"
                      >
                        {store.phone}
                      </a>
                    ) : null}
                    {store.email ? (
                      <a
                        href={`mailto:${store.email}`}
                        className="text-body-sm text-ivory-100 transition-colors hover:text-champagne-400"
                      >
                        {store.email}
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
