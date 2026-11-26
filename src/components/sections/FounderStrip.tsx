"use client";

import Image from "next/image";
import Link from "@/components/L";
import { Arrow } from "../ui";
import { useContent, useLocale, useT } from "@/components/I18n";

const points = [
  "We go through your kitchen's checklist together",
  "We tell you exactly what is missing, and what to fix first",
  "You leave with a fixed price and a go-live date",
];

export function FounderStrip() {
  const t = useT();
  const locale = useLocale();
  const { founder, site } = useContent();
  return (
    <section className="bg-white py-14 text-ink sm:py-32">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-8">
        <div className="grid gap-8 rounded-[1.75rem] bg-ink p-5 text-paper sm:rounded-[2.5rem] sm:p-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-accent font-display text-[28px] text-ink sm:h-20 sm:w-20 sm:text-[34px]">
                {founder.photo ? (
                  <Image src={founder.photo} alt={`${founder.name}, ${founder.role}`} fill sizes="80px" loading="eager" fetchPriority="high" className="object-cover" />
                ) : (
                  founder.name[0]
                )}
              </span>
              <p className="leading-tight">
                <span className="block text-[20px] font-semibold sm:text-[24px]">{founder.name}</span>
                <span className="block text-[14px] text-slate-light sm:text-[16px]">{founder.role}</span>
              </p>
            </div>
            <h2 className="mt-6 text-[32px] leading-[1.05] sm:mt-8 sm:text-[56px]">
              {locale === "hi" ? `आपकी फ्री कॉल ${founder.name} के साथ है।` : `Your free call is with ${founder.name}.`}
            </h2>
            <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed text-slate-light sm:text-[19px]">
              {t("20 minutes, one to one. Whether you are starting a new food business or already cooking at home, you will know your next step.")}
            </p>
          </div>

          <div className="flex flex-col justify-between">
            <ul className="space-y-3">
              {points.map((pt, i) => (
                <li key={pt} className="flex items-start gap-3.5 rounded-2xl bg-ink px-4 py-3.5 sm:px-5 sm:py-4">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent font-display text-[14px] text-ink">
                    {i + 1}
                  </span>
                  <span className="text-[16px] leading-snug sm:text-[18px]">{t(pt)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href={site.ctaHref}
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-accent px-8 text-[17px] font-semibold text-ink transition-transform active:scale-[0.98]"
              >
                {t("Book my free call")}
              </Link>
              <Link href="/about" className="group inline-flex min-h-[44px] items-center justify-center gap-1.5 text-[16px] font-medium text-accent hover:underline">
                {locale === "hi" ? `${founder.name} के बारे में और जानें` : `More about ${founder.name}`}
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
