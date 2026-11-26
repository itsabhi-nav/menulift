import { translate, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang: lang === "hi" ? "hi" : "en",
    path: "faq",
    title: "Zomato and Swiggy Onboarding FAQs | Menulift",
    description: "Answers about FSSAI, documents, fees, timelines and menu setup for Zomato and Swiggy onboarding.",
  });
}

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
