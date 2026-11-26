import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontClasses } from "@/lib/fonts";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { LocaleProvider } from "@/components/I18n";
import { siteUrl } from "@/lib/seo";
import { founder } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === "hi";
  return {
    title: hi ? "Menulift | Zomato और Swiggy पर कुछ ही दिनों में लाइव हों" : "Menulift | Get live on Zomato and Swiggy",
    description: hi
      ? "Menulift होम किचन, क्लाउड किचन और नए रेस्टोरेंट को Zomato और Swiggy पर लाइव कराता है। फ्री 20 मिनट की कॉल बुक करें।"
      : "Menulift gets home kitchens, cloud kitchens and new restaurants live on Zomato and Swiggy. Take the free 2-minute Readiness Check, then book a free 20-minute Go-Live Call.",
    alternates: { languages: { en: siteUrl, hi: `${siteUrl}/hi`, "x-default": siteUrl } },
  };
}

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} className={fontClasses}>
      <body>
        <LocaleProvider locale={lang}>{children}</LocaleProvider>
        <SmoothScroll />
        <Analytics />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Menulift",
            url: siteUrl,
            description: "Menulift gets home kitchens, cloud kitchens and new restaurants live on Zomato and Swiggy.",
            areaServed: "IN",
            founder: { "@type": "Person", name: "Anshuman", ...(founder.linkedin ? { sameAs: [founder.linkedin] } : {}) },
          }}
        />
      </body>
    </html>
  );
}
