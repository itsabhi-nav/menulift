"use client";

import Link from "@/components/L";
import { Arrow } from "../ui";
import { StepTimeline } from "../StepTimeline";
import { useContent, useT } from "@/components/I18n";

export function HomeSteps() {
  const t = useT();
  const { steps } = useContent();
  return (
    <section className="bg-ink py-14 text-paper md:bg-white md:text-ink sm:py-32">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="max-w-[16ch] text-[38px] leading-[1.04] sm:text-[72px]">
            {t("Four steps.")} <span className="text-slate-light md:text-slate">{t("Live in about a week.")}</span>
          </h2>
          <Link href="/how-it-works" className="group hidden items-center gap-2 text-[18px] font-semibold underline underline-offset-4 md:inline-flex">
            {t("See the full process")}
            <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 md:hidden">
          <StepTimeline />
        </div>

        <ol className="mt-12 hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex flex-col rounded-[1.75rem] bg-paper p-7 transition-transform duration-300 hover:-translate-y-1">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-[20px] text-accent">{i + 1}</span>
              <h3 className="mt-6 text-[24px] leading-tight">{s.title}</h3>
              <p className="mt-3 flex-1 text-[16px] leading-relaxed text-slate">{s.text}</p>
              <p className="mt-6 flex flex-wrap gap-2 text-[13px] font-medium">
                <span className="rounded-full bg-accent px-3 py-1 text-ink">{s.time}</span>
                <span className="rounded-full border border-line px-3 py-1 text-slate">{s.who}</span>
              </p>
            </li>
          ))}
        </ol>

        <Link href="/how-it-works" className="group mt-8 inline-flex items-center gap-2 text-[18px] font-semibold text-accent underline underline-offset-4 md:hidden">
          {t("See the full process")}
          <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
