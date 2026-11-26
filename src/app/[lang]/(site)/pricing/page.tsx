import { translate, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Offers } from "@/components/sections/Offers";
import { Compare } from "@/components/sections/Compare";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { offers } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang: lang === "hi" ? "hi" : "en",
    path: "pricing",
    title: "Zomato and Swiggy Onboarding Pricing | Menulift",
    description: "Compare Menulift onboarding options for Zomato and Swiggy, with a free call and clear pricing.",
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
          "@graph": offers.map((o) => ({
            "@type": "Service",
            name: o.name,
            provider: { "@type": "ProfessionalService", name: "Menulift" },
            offers: { "@type": "Offer", price: o.price.replace(/[^\d]/g, ""), priceCurrency: "INR" },
          })),
        }}
      />
      <PageHeader
        title={t("Simple pricing, no surprises")}
        sub={t("Listing on Zomato and Swiggy is free. You pay us only for the help you choose.")}
        video="15875"
      />
      <Offers />
      <Compare />
      <CtaBand />
    </>
  );
}
