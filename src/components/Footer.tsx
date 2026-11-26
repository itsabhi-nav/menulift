"use client";

import Link from "@/components/L";
import { Wordmark } from "./Nav";
import { useContent, useT } from "@/components/I18n";

const cols = [
  {
    title: "Menulift",
    links: [
      ["Home", "/"],
      ["How it works", "/how-it-works"],
      ["Pricing", "/pricing"],
      ["Results", "/results"],
      ["About Anshuman", "/about"],
      ["FAQ", "/faq"],
    ],
  },
  {
    title: "Get started",
    links: [
      ["Book a free call", "/book"],
      ["Kitchen readiness quiz", "/check"],
      ["Become a partner", "/partners"],
    ],
  },
  {
    title: "Guides",
    links: [
      ["Zomato onboarding", "/zomato-onboarding"],
      ["Swiggy onboarding", "/swiggy-onboarding"],
      ["Documents needed", "/documents-for-zomato-swiggy"],
      ["FSSAI for cloud kitchens", "/fssai-for-cloud-kitchen"],
    ],
  },
];

export function Footer() {
  const t = useT();
  const { site } = useContent();
  return (
    <footer className="bg-deep pb-28 text-paper md:pb-0">
      <div className="mx-auto max-w-[1360px] px-4 pt-12 sm:px-8 sm:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-line-dark pb-12 md:grid-cols-[1.4fr_1fr_1fr_1.1fr_1.2fr] md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <Wordmark className="text-[28px]" />
            <p className="mt-4 max-w-[30ch] text-[15px] leading-relaxed text-slate-light">
              {t("We get home kitchens, cloud kitchens and new restaurants live on Zomato and Swiggy.")}
            </p>
            <Link
              href={site.ctaHref}
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-accent px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-accent-deep"
            >
              {site.ctaLabel}
            </Link>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-[15px] font-semibold">{t(c.title)}</p>
              <ul className="mt-4 space-y-3 text-[15px] text-slate-light">
                {c.links.map(([l, h]) => (
                  <li key={l}>
                    <Link href={h} className="transition-colors hover:text-accent">{t(l)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <p className="text-[15px] font-semibold">{t("Talk to us")}</p>
            <ul className="mt-4 space-y-3 text-[15px] text-slate-light">
              <li>
                <a href={`https://wa.me/${site.whatsappNumber}`} className="transition-colors hover:text-accent">WhatsApp {site.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-accent">{site.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 py-6 text-center text-[12px] leading-relaxed text-slate-light sm:flex-row sm:justify-between sm:text-left sm:text-[13px]">
          <p>
            {t("© 2026 Menulift")}
            <span className="hidden sm:inline">. </span>
            <span className="block sm:inline">{t("Independent service, not affiliated with Zomato or Swiggy.")}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 sm:justify-end">
            <Link href="/privacy" className="hover:text-accent">{t("Privacy")}</Link>
            <Link href="/terms" className="hover:text-accent">{t("Terms")}</Link>
            <p>{t("Designed and developed by CodeWizard")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
