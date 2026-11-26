import type { Metadata } from "next";
import { CheckFlow } from "@/components/CheckFlow";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang: lang === "hi" ? "hi" : "en",
    path: "check",
    title: "Free Zomato and Swiggy Readiness Check | Menulift",
    description: "Answer six questions to see what documents and setup your kitchen needs before going live.",
  });
}

export default function CheckPage() {
  return <CheckFlow />;
}
