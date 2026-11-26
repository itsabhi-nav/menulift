import { translate, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Offers } from "@/components/sections/Offers";
import { Compare } from "@/components/sections/Compare";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { offers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing | Menulift",
  description: "Three clear ways to get your kitchen live on Zomato and Swiggy. Start with a free call.",
};

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
