"use client";

import Link from "@/components/L";
import type { SeoDoc } from "@/lib/seo";
import { siteUrl } from "@/lib/seo";
import { PageHeader } from "./PageHeader";
import { CtaBand } from "./sections/CtaBand";
import { Check, Arrow } from "./ui";
import { JsonLd } from "./JsonLd";
import { useContent } from "@/components/I18n";

export function SeoPage({ doc }: { doc: SeoDoc }) {
  const { site } = useContent();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: doc.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <PageHeader title={doc.h1} sub={doc.answer} />

      <section className="bg-paper py-12 text-ink sm:py-28">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-4 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 className="text-[30px] leading-tight sm:text-[48px]">How it works</h2>
            <ol className="mt-6 space-y-5">
              {doc.steps.map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-display text-[16px] text-accent">{i + 1}</span>
                  <div>
                    <h3 className="text-[20px] leading-tight">{s.t}</h3>
                    <p className="mt-1 text-[16px] leading-relaxed text-slate">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {doc.list ? (
            <div className="rounded-[1.75rem] bg-white p-6 sm:p-10">
              <h2 className="text-[26px] leading-tight sm:text-[34px]">{doc.list.title}</h2>
              <ul className="mt-5 space-y-3">
                {doc.list.items.map((t) => (
                  <li key={t} className="flex gap-3 text-[16px] leading-snug">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-live text-ink">
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Link href={site.quizHref} className="mt-7 inline-flex items-center gap-2 font-semibold underline underline-offset-4">
                {site.quizLabel}
                <Arrow className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="rounded-[1.75rem] bg-ink p-6 text-paper sm:p-10">
              <h2 className="text-[26px] leading-tight sm:text-[34px]">Not sure where you stand?</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-slate-light">{site.quizHint}</p>
              <Link href={site.quizHref} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-semibold text-ink">
                {site.quizLabel}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-12 text-ink sm:py-28">
        <div className="mx-auto max-w-[900px] px-4 sm:px-8">
          <h2 className="text-[30px] leading-tight sm:text-[48px]">Questions owners ask</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {doc.faqs.map((f) => (
              <div key={f.q} className="py-5">
                <h3 className="text-[19px] leading-snug sm:text-[22px]">{f.q}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-slate">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-slate">
            As of November 2026. Menulift is an independent service. Listing on Zomato and Swiggy is free; Menulift charges for its service.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
