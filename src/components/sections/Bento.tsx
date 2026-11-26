"use client";

import { useRef } from "react";
import { LoopVideo } from "../LoopVideo";
import { Check } from "../ui";
import { gsap, useGSAP, reduced } from "../motion/gsap";
import { useContent, useT } from "@/components/I18n";

const docs = ["FSSAI licence", "PAN card", "Cancelled cheque", "Menu with prices"];

export function Bento() {
  const t = useT();
  const { stats } = useContent();
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(".bn"), {
        y: 70,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: q(".bn-grid")[0], start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  const tile = "bn relative overflow-hidden rounded-[1.75rem] p-5 sm:rounded-[2rem] sm:p-10";

  return (
    <section ref={root} className="bg-paper pb-14 text-ink sm:pb-36">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-8">
        <h2 className="max-w-[18ch] text-[38px] leading-[1.04] sm:text-[72px]">
          {t("Everything it takes to go live.")} <span className="text-slate">{t("Done for you.")}</span>
        </h2>

        <div className="bn-grid mt-8 grid gap-3 sm:mt-12 sm:gap-4 grid-cols-2 md:grid-cols-4 md:grid-rows-[repeat(2,minmax(0,300px))_minmax(0,340px)]">
          <div className={`${tile} col-span-2 flex min-h-[320px] flex-col justify-end bg-ink text-paper md:min-h-0 md:row-span-2`}>
            <LoopVideo id="9286" />
            <span className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" aria-hidden />
            <p className="relative max-w-[14ch] text-[32px] leading-[1.04] sm:text-[52px]">
              {t("Your kitchen, live on both apps.")}
            </p>
          </div>

          <div className={`${tile} col-span-2 bg-white`}>
            <h3 className="max-w-[18ch] text-[22px] leading-tight sm:text-[32px]">{t("Documents checked before anything is filed.")}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[15px] text-slate sm:mt-6 sm:text-[16px]">
              {docs.map((d) => (
                <li key={d} className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-live text-ink">
                    <Check className="h-3 w-3" />
                  </span>
                  {t(d)}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${tile} flex min-h-[150px] flex-col justify-between bg-ink text-paper`}>
            <p className="text-[48px] leading-none sm:text-[84px]">{stats[0].to}+</p>
            <p className="text-[14px] text-slate-light sm:text-[17px]">{stats[0].label}</p>
          </div>

          <div className={`${tile} flex min-h-[150px] flex-col justify-between bg-accent text-ink`}>
            <p className="text-[48px] leading-none sm:text-[84px]">{stats[1].to}</p>
            <p className="text-[14px] font-medium sm:text-[17px]">{t("days on average to go live")}</p>
          </div>

          <div className={`${tile} col-span-2 bg-white`}>
            <h3 className="max-w-[22ch] text-[22px] leading-tight sm:text-[32px]">{t("Is each order actually making you money?")}</h3>
            <p className="mt-2 max-w-[44ch] text-[14px] leading-snug text-slate sm:text-[16px]">
              {t("Food, packaging, app fees and offers add up. We set your menu prices so there is profit left.")}
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line text-[14px] sm:mt-6 sm:text-[16px]">
              <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-2 bg-paper px-3 py-2 text-[11px] font-medium text-slate sm:px-4 sm:text-[13px]">
                <span />
                <span>{t("Menu price")}</span>
                <span>{t("All costs")}</span>
                <span>{t("You keep")}</span>
              </div>
              <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] items-center gap-2 px-3 py-3 sm:px-4">
                <span className="font-medium">{t("Guesswork")}</span>
                <span>₹320</span>
                <span>₹325</span>
                <span className="font-bold text-danger-deep">−₹5</span>
              </div>
              <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] items-center gap-2 bg-ink px-3 py-3 text-paper sm:px-4">
                <span className="font-medium">{t("With Menulift")}</span>
                <span>₹380</span>
                <span>₹343</span>
                <span className="font-bold text-live">+₹37</span>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-slate">{t("Example for one thali. Costs include food, packaging, app fees and offers.")}</p>
          </div>

          <div className={`${tile} col-span-2 flex min-h-[240px] flex-col justify-end bg-ink text-paper`}>
            <LoopVideo id="42467" />
            <span className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" aria-hidden />
            <p className="relative max-w-[16ch] text-[26px] leading-[1.06] sm:text-[42px]">
              {t("Launch offers set, so the first orders arrive.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
