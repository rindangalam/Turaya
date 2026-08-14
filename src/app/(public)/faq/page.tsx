import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/jsonld";
import { FaqPageJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/services/seo";
import { listPublishedFaq } from "@/services/faq";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "faq",
    path: "/faq",
    fallbackTitle: "FAQ",
    fallbackDescription: "Pertanyaan yang sering diajukan tentang Turaya.",
  });
}

export default async function FaqPage() {
  const items = await listPublishedFaq();

  return (
    <div>
      {items.length >= 2 ? (
        <JsonLd
          data={FaqPageJsonLd({
            items: items.map((item) => ({ question: item.question, answer: item.answer })),
          })}
        />
      ) : null}
      <PageHeader
        overline="FAQ"
        title="Pertanyaan yang Sering Diajukan"
        description="Jawaban untuk hal-hal yang paling sering ditanyakan. Belum menemukan jawaban? Hubungi kami melalui halaman kontak."
      />

      <section className="container-turaya max-w-3xl py-16 md:py-24">
        {items.length === 0 ? (
          <p className="text-body-lg text-muted-foreground">
            Belum ada pertanyaan yang dipublikasikan. Silakan kembali lagi nanti.
          </p>
        ) : (
          <div className="flex flex-col">
            {items.map((item, index) => (
              <details
                key={item.id}
                className="group border-b border-border/50 first:border-t"
              >
                <summary
                  className={cn(
                    "flex cursor-pointer list-none items-center justify-between gap-4 py-6",
                    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
                  )}
                >
                  <span className="flex items-baseline gap-5">
                    <span className="overline text-caption tabular-nums text-terra-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-heading-lg text-foreground">
                      {item.question}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative block size-6 shrink-0 text-terra-500"
                  >
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
                  </span>
                </summary>
                <div className="pb-8 pl-11">
                  <p className="max-w-prose whitespace-pre-line text-body leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
