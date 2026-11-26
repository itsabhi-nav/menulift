import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontClasses } from "@/lib/fonts";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { LocaleProvider } from "@/components/I18n";
import { normalizedSiteUrl, pageMetadata } from "@/lib/seo";
import { founder } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";
import { defaultPersonalSettings } from "@/lib/personal-settings";
import { RouteProgress } from "@/components/RouteProgress";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === "hi";
  return {
    metadataBase: new URL(normalizedSiteUrl),
    ...pageMetadata({
      lang: hi ? "hi" : "en",
      title: "Menulift | Get live on Zomato and Swiggy",
      description:
        "Menulift gets home kitchens, cloud kitchens and new restaurants live on Zomato and Swiggy. Take the free readiness check or book a free call.",
      hiTitle: "Menulift | Zomato और Swiggy पर कुछ ही दिनों में लाइव हों",
      hiDesc:
        "Menulift होम किचन, क्लाउड किचन और नए रेस्टोरेंट को Zomato और Swiggy पर लाइव कराता है। फ्री 20 मिनट की कॉल बुक करें।",
    }),
    openGraph: {
      type: "website",
      locale: hi ? "hi_IN" : "en_IN",
      alternateLocale: hi ? ["en_IN"] : ["hi_IN"],
      url: `${normalizedSiteUrl}${hi ? "/hi" : ""}`,
      siteName: "Menulift",
      title: hi ? "Menulift | Zomato और Swiggy पर कुछ ही दिनों में लाइव हों" : "Menulift | Get live on Zomato and Swiggy",
      description: hi
        ? "Menulift होम किचन, क्लाउड किचन और नए रेस्टोरेंट को Zomato और Swiggy पर लाइव कराता है।"
        : "Menulift gets home kitchens, cloud kitchens and new restaurants live on Zomato and Swiggy.",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Menulift Zomato and Swiggy onboarding" }],
    },
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
      <head>
        <link rel="preload" as="image" href="/photos/founder.jpg" fetchPriority="high" />
        <link rel="preconnect" href="https://ttiwoorafshshautkadc.supabase.co" />
      </head>
      <body>
        <RouteProgress />
        <LocaleProvider locale={lang} personal={defaultPersonalSettings}>{children}</LocaleProvider>
        <SmoothScroll />
        <Analytics />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${normalizedSiteUrl}/#organization`,
                name: "Menulift",
                url: normalizedSiteUrl,
                founder: { "@type": "Person", name: founder.name, ...(founder.linkedin ? { sameAs: [founder.linkedin] } : {}) },
              },
              {
                "@type": "WebSite",
                "@id": `${normalizedSiteUrl}/#website`,
                url: normalizedSiteUrl,
                name: "Menulift",
                inLanguage: ["en-IN", "hi-IN"],
                publisher: { "@id": `${normalizedSiteUrl}/#organization` },
              },
              {
                "@type": "ProfessionalService",
                "@id": `${normalizedSiteUrl}/#service`,
                name: "Menulift",
                url: normalizedSiteUrl,
                description: "Document preparation, application filing, follow-up and menu setup for Zomato and Swiggy onboarding.",
                areaServed: { "@type": "Country", name: "India" },
                founder: { "@type": "Person", name: founder.name, ...(founder.linkedin ? { sameAs: [founder.linkedin] } : {}) },
              },
            ],
          }}
        />
      </body>
    </html>
  );
}
