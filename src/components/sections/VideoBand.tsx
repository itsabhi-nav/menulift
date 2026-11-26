"use client";

import Link from "@/components/L";
import { Arrow } from "../ui";
import { LoopVideo } from "../LoopVideo";
import { useContent, useT } from "@/components/I18n";

export function VideoBand() {
  const t = useT();
  const { site } = useContent();
  return (
    <section className="hidden bg-paper pb-14 md:block sm:pb-36">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-8">
        <div className="relative isolate flex min-h-[440px] items-end overflow-hidden rounded-[2rem] bg-ink text-paper sm:min-h-[680px]">
          <LoopVideo id="39535" />
          <span className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/5" aria-hidden />
          <div className="relative p-7 sm:p-14">
            <p className="max-w-[16ch] text-[40px] leading-[1.02] sm:text-[84px]">
              {t("Every kitchen has a first order.")}
            </p>
            <p className="mt-5 max-w-[40ch] text-[18px] text-slate-light sm:text-[21px]">
              {t("Ours is making yours happen sooner.")}
            </p>
            <Link href={site.ctaHref} className="group mt-8 inline-flex items-center gap-2 text-[18px] font-medium text-accent hover:underline">
              {site.ctaLabel}
              <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
