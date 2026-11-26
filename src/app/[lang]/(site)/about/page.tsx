import type { Metadata } from "next";
import { Founder } from "@/components/sections/Founder";
import { CtaBand } from "@/components/sections/CtaBand";
import { getPersonalSettings } from "@/lib/store";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const personal = await getPersonalSettings();
  const name = personal.founderName || "Anshuman";
  return pageMetadata({
    lang: lang === "hi" ? "hi" : "en",
    path: "about",
    title: `About Menulift and Founder ${name}`,
    description: `Meet founder ${name} and learn how Menulift helps home, cloud and restaurant kitchens go live.`,
  });
}

export default function Page() {
  return (
    <>
      <Founder asH1 />
      <CtaBand />
    </>
  );
}
