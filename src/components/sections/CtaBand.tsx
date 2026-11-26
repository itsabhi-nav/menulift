"use client";

import Link from "@/components/L";
import { Arrow } from "../ui";
import { useContent, useT } from "@/components/I18n";

export function CtaBand() {
  const t = useT();
  const { site } = useContent();
  return (
    <section className="bg-accent py-16 text-center text-ink sm:py-40">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-8">
        <h2 className="text-[42px] leading-[1.02] sm:text-[96px]">
          {t("Ready to get live?")} <span className="text-ink/55">{t("Let's talk.")}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-[44ch] text-[17px] leading-relaxed text-ink/75 sm:mt-6 sm:text-[21px]">
          {t("A free 20-minute call. We tell you what is missing, a fixed price and a go-live date.")}
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href={site.ctaHref}
            className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-ink px-9 text-[18px] font-semibold text-paper transition-transform active:scale-[0.98]"
          >
            {site.ctaLabel}
          </Link>
          <Link href={site.quizHref} className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full border-2 border-ink bg-transparent px-8 text-[17px] font-semibold text-ink transition-colors hover:bg-ink hover:text-accent">
            {site.quizLabel}
            <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
