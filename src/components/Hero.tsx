"use client";

import { useEffect, useRef } from "react";
import Link from "@/components/L";
import { markReady } from "@/lib/ready";
import { PhoneLive } from "./PhoneLive";
import { Arrow } from "./ui";
import { HeroProgress } from "./HeroProgress";
import { LoopVideo } from "./LoopVideo";
import { useContent, useT } from "@/components/I18n";

export function Hero() {
  const t = useT();
  const { hero, site } = useContent();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    markReady();
  }, []);

  return (
    <section ref={root} data-hero className="relative isolate overflow-hidden bg-deep text-paper" aria-labelledby="hero-title">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0">
          <LoopVideo id="hero" eager rate={0.75} className="object-[58%_50%] opacity-80" />
        </div>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, rgb(0 0 0 / 0.7), transparent 80%)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/90" />
        <div
          className="absolute inset-x-0 bottom-0 h-[70%]"
          style={{ background: "radial-gradient(ellipse 60% 70% at 50% 100%, rgb(240 180 76 / 0.22), transparent 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1360px] px-4 pb-12 pt-10 text-center sm:px-8 sm:pb-0 sm:pt-24">
        <div className="h-copy">
          <h1
            id="hero-title"
            className="h-rise mx-auto max-w-[18ch] text-[40px] leading-[1.03] sm:text-[84px] lg:text-[96px]"
          >
            {t("Get live on Zomato and Swiggy")}
            <span className="mt-2 block text-[0.74em] leading-[1.08] text-accent">{t("in just a few days.")}</span>
          </h1>

          <p className="h-rise mx-auto mt-5 max-w-[44ch] text-[16px] leading-relaxed text-paper/75 sm:mt-7 sm:text-[22px]">
            {t("We handle your FSSAI, documents, applications and menu, so your kitchen takes its first orders without the wait.")}
          </p>

          <div className="h-rise mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-9 sm:flex-row sm:gap-8">
            <Link
              href={site.ctaHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 text-[16px] font-semibold text-ink transition-colors hover:bg-accent-deep sm:min-h-[54px] sm:px-8 sm:text-[17px]"
            >
              {site.ctaLabel}
            </Link>
            <Link href={site.quizHref} className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-paper px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-white sm:min-h-[54px] sm:px-7 sm:text-[17px]">
              {site.quizLabel}
              <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="h-rise mt-3 text-[13px] text-paper/60 sm:mt-5 sm:text-[14px]">{hero.microcopy}</p>

          <dl className="h-rise mx-auto mt-8 grid max-w-[560px] grid-cols-3 divide-x divide-white/15 sm:mt-12">
            {hero.proof.map((p) => (
              <div key={p.label} className="px-2 sm:px-6">
                <dd className="font-display text-[26px] leading-none sm:text-[40px]">{p.value}</dd>
                <dt className="mt-1.5 text-[12px] leading-tight text-paper/60 sm:text-[14px]">{p.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="h-rise mt-8 sm:hidden">
          <HeroProgress />
        </div>

        <div className="h-phone relative mx-auto mt-14 hidden h-[640px] sm:block">
          <div className="relative origin-top sm:scale-[1.3]">
            <PhoneLive />
          </div>
        </div>
      </div>
    </section>
  );
}
