"use client";

import { useRef } from "react";
import { Check, Cta, Section } from "../ui";
import { SnapDots } from "../SnapDots";
import { Words } from "../motion/Words";
import { Counter } from "../motion/Counter";
import { gsap, useGSAP } from "../motion/gsap";
import { useContent, useT } from "@/components/I18n";

export function Offers() {
  const t = useT();
  const { guaranteeDays, offers } = useContent();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.from(q(".of-title .w"), {
          yPercent: 118,
          duration: 1,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: { trigger: q(".of-title")[0], start: "top 85%", once: true },
        });
        gsap.from(q(".of-card"), {
          y: 90,
          autoAlpha: 0,
          rotateX: 10,
          transformPerspective: 900,
          stagger: 0.16,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".of-grid")[0], start: "top 78%", once: true },
        });
      });
    },
    { scope: root },
  );

  const spot = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Section id="offers" tone="paper">
      <div ref={root}>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="of-title max-w-[12ch] text-[40px] font-extrabold leading-[1] sm:text-[72px]">
            <Words text={t("Pick your plan")} />
          </h2>
          <p className="max-w-[38ch] text-[17px] text-slate md:text-right">
            {t("Not sure which one fits? Start with the free call and we will recommend one.")}
          </p>
        </div>

        <div className="of-grid -mx-4 mt-8 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-4 pb-6 pt-5 sm:mx-0 sm:mt-12 sm:px-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:pb-0 lg:pt-0">
          {offers.map((o) => {
            const price = Number(o.price.replace(/[^\d]/g, ""));
            return (
              <article
                key={o.name}
                onMouseMove={spot}
                className={`of-card spot relative flex flex-col rounded-[1.75rem] p-6 max-lg:w-[84vw] max-lg:max-w-[380px] max-lg:shrink-0 max-lg:snap-center sm:rounded-[2rem] sm:p-10 ${
                  o.highlight
                    ? "bg-accent text-ink shadow-[0_50px_110px_-30px_rgba(240,180,76,0.6)] lg:-my-5 lg:py-14"
                    : "bg-ink text-paper"
                }`}
              >
                {o.highlight && (
                  <span className="absolute -top-3.5 left-9 rounded-full bg-ink px-4 py-1.5 text-[13px] font-bold text-accent">
                    {t("Most chosen")}
                  </span>
                )}
                <h3 className="font-display text-[30px] font-extrabold leading-tight">
                  {o.name.replace(/-/g, "‑")}
                </h3>
                <p className={`mt-2 text-[16px] leading-snug ${o.highlight ? "text-ink/75" : "text-slate-light"}`}>
                  {o.blurb}
                </p>

                <p className="mt-8 font-display text-[clamp(48px,5vw,64px)] font-extrabold leading-none">
                  <Counter to={price} prefix="₹" group />
                </p>

                <ul className="mt-8 flex-1 space-y-3.5">
                  {o.items.map((i) => (
                    <li key={i} className="flex gap-3 text-[16px] leading-snug">
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                          o.highlight ? "bg-ink text-accent" : "bg-live/20 text-live"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      {i}
                    </li>
                  ))}
                </ul>

                <p
                  className={`mt-8 rounded-2xl px-4 py-3.5 text-[14px] font-semibold leading-snug ${
                    o.highlight ? "bg-ink/10" : "bg-white/5 text-slate-light"
                  }`}
                >
                  {t("Go-live guarantee: live in")} {guaranteeDays} {t("days, or we keep working at no extra cost.")}
                </p>

                <div className="mt-6">
                  <Cta
                    href={"/book"}
                    variant={o.highlight ? "ink" : "ghost"}
                    className="w-full"
                  >
                    {o.cta}
                  </Cta>
                </div>
              </article>
            );
          })}
        </div>
        <SnapDots selector=".of-grid" count={offers.length} />
      </div>
    </Section>
  );
}
