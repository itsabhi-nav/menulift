import { translate, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ | Menulift",
  description: "Answers to what owners ask before they book a call.",
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = (s: string) => translate(lang as Locale, s);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <PageHeader title={t("Questions owners ask")} sub={t("Straight answers, before you book anything.")} />
      <Faq />
      <CtaBand />
    </>
  );
}
