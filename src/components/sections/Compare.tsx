"use client";

import { useRef } from "react";
import { Check, Cross, Section } from "../ui";
import { Words } from "../motion/Words";
import { gsap, useGSAP } from "../motion/gsap";
import { useContent, useT } from "@/components/I18n";

export function Compare() {
  const t = useT();
  const { compare } = useContent();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.from(q(".cmp-title .w"), {
          yPercent: 118,
          duration: 1,
          stagger: 0.06,
          ease: "power4.out",
          scrollTrigger: { trigger: q(".cmp-title")[0], start: "top 85%", once: true },
        });
        gsap.from(q(".cmp-left li"), {
          x: -40,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".cmp-grid")[0], start: "top 72%", once: true },
        });
        gsap.from(q(".cmp-right li"), {
          x: 40,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.25,
          scrollTrigger: { trigger: q(".cmp-grid")[0], start: "top 72%", once: true },
        });
        gsap.from(q(".cmp-vs"), {
          scale: 0,
          rotate: -90,
          duration: 0.9,
          ease: "back.out(2)",
          scrollTrigger: { trigger: q(".cmp-grid")[0], start: "top 70%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <Section id="difference" tone="deep">
      <div ref={root}>
        <h2 className="cmp-title max-w-[16ch] text-[40px] font-extrabold leading-[1] sm:text-[72px]">
          <Words text={t("Why owners choose Menulift")} />
        </h2>

        <div className="cmp-grid relative mt-8 sm:mt-16 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-line-dark bg-ink/60 p-8 sm:p-11">
            <h3 className="font-display text-[28px] font-bold text-slate-light">{t("On your own")}</h3>
            <ul className="cmp-left mt-8 space-y-5">
              {compare.without.map((t) => (
                <li key={t} className="flex gap-4 text-[17px] leading-snug text-slate-light">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-danger/20 text-danger">
                    <Cross className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <span className="cmp-vs absolute left-1/2 top-1/2 z-10 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent font-display text-[20px] font-extrabold text-ink shadow-xl lg:grid">
            {t("vs")}
          </span>

          <div className="relative overflow-hidden rounded-[2rem] border border-live/50 bg-gradient-to-b from-ink-3 to-ink-2 p-8  sm:p-11">
            <h3 className="relative font-display text-[28px] font-bold">{t("With Menulift")}</h3>
            <ul className="cmp-right relative mt-8 space-y-5">
              {compare.with.map((t) => (
                <li key={t} className="flex gap-4 text-[17px] font-medium leading-snug">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-live text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
