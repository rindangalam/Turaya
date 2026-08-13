import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { getSeoMetadata } from "@/services/seo";
import { listPublishedFaq } from "@/services/faq";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("faq");
  return {
    title: seo?.title ?? "FAQ",
    description: seo?.description ?? "Pertanyaan yang sering diajukan tentang Turaya.",
  };
}

export default async function FaqPage() {
  const items = await listPublishedFaq();

  return (
    <div>
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
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <details
                key={item.id}
                className="group border border-border/40 bg-input/10"
              >
                <summary
                  className={cn(
                    "flex cursor-pointer list-none items-center justify-between gap-4 p-6",
                    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  )}
                >
                  <span className="font-display text-heading-lg text-ivory-50">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-champagne-400 transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="whitespace-pre-line text-body leading-relaxed text-muted-foreground">
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
