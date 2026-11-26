import { translate, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Stories } from "@/components/sections/Stories";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang: lang === "hi" ? "hi" : "en",
    path: "results",
    title: "Kitchens Live on Zomato and Swiggy | Menulift",
    description: "Explore onboarding timelines and customer stories from kitchens working with Menulift.",
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = (s: string) => translate(lang as Locale, s);
  return (
    <>
      <PageHeader
        title={t("Kitchens we got live")}
        sub={t("How long each one took, from the first call to the first order.")}
        video="13261"
      />
      <Stories />
      <Testimonials />
      <CtaBand />
    </>
  );
}
