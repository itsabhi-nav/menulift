import { SeoPage } from "@/components/SeoPage";
import { seoMetadata, seoPages } from "@/lib/seo";
import type { Metadata } from "next";

const doc = seoPages.find((d) => d.path === "swiggy-onboarding")!;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return seoMetadata(doc, lang === "hi" ? "hi" : "en");
}

export default function Page() {
  return <SeoPage doc={doc} />;
}
