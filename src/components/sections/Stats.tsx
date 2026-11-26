"use client";

import { useRef } from "react";
import { Counter } from "../motion/Counter";
import { gsap, useGSAP, reduced } from "../motion/gsap";
import { useContent, useT } from "@/components/I18n";

export function Stats() {
  const t = useT();
  const { stats } = useContent();
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".stat", {
        autoAlpha: 0,
        y: 50,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="bg-ink-2 py-14 text-paper sm:py-32" aria-label={t("Menulift in numbers")}>
      <div className="mx-auto max-w-[1360px] px-4 sm:px-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="stat border-t border-line-dark pt-6">
              <dd className="font-display text-[clamp(52px,8vw,112px)] font-extrabold leading-[0.9]">
                <Counter to={s.to} decimals={s.decimals ?? 0} />
                <span className="ml-1 text-[0.36em] font-bold text-accent">{s.suffix.trim()}</span>
              </dd>
              <dt className="mt-4 text-[17px] text-slate-light">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
