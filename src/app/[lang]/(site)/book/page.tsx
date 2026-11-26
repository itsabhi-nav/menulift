import type { Metadata } from "next";
import { Book } from "@/components/sections/Book";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang: lang === "hi" ? "hi" : "en",
    path: "book",
    title: "Book a Free Zomato and Swiggy Call | Menulift",
    description: "Choose a free 20-minute call to learn what documents and setup your kitchen needs to go live.",
  });
}

export default function Page() {
  return <Book />;
}
