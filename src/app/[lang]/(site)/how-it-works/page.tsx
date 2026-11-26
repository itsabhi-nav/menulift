import { translate, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Problems } from "@/components/sections/Problems";
import { CtaBand } from "@/components/sections/CtaBand";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang: lang === "hi" ? "hi" : "en",
    path: "how-it-works",
    title: "How Menulift Gets Kitchens Live | Menulift",
    description: "See the four steps from your free call to document prep, app follow-up and menu launch on Zomato and Swiggy.",
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = (s: string) => translate(lang as Locale, s);
  return (
    <>
      <PageHeader
        title={t("From your first call to your first order")}
        sub={t("Here is exactly what happens, step by step, and what we take off your plate.")}
        video="13258"
      />
      <HowItWorks />
      <Problems />
      <CtaBand />
    </>
  );
}
