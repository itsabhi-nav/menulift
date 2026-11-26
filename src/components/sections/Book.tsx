"use client";

import { useRef } from "react";
import Link from "@/components/L";
import { BookingCard } from "../BookingCard";
import { Arrow, Check, Section } from "../ui";
import { Words } from "../motion/Words";
import { gsap, useGSAP } from "../motion/gsap";
import { useContent, useT } from "@/components/I18n";

export function Book() {
  const t = useT();
  const { founder, site } = useContent();
  const root = useRef<HTMLDivElement>(null);
  const initials = founder.name.replace(/[[\]]/g, "").split(" ").map((n) => n[0]).join("").slice(0, 2);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.from(q(".bk-title .w"), {
          yPercent: 118,
          duration: 1.1,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: q(".bk-title")[0], start: "top 85%", once: true },
        });
        gsap.from(q(".bk-item"), {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".bk-left")[0], start: "top 70%", once: true },
        });
        gsap.from(q(".bk-card"), {
          y: 100,
          autoAlpha: 0,
          rotateX: 8,
          transformPerspective: 1000,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".bk-card")[0], start: "top 88%", once: true },
        });
        gsap.to(q(".bk-orb"), { y: -60, x: 40, duration: 8, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });
    },
    { scope: root },
  );

  return (
    <Section id="book" tone="ink" className="relative overflow-hidden">
      <div ref={root} className="relative grid items-start gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div className="bk-left">
          <h1 className="bk-title max-w-[11ch] text-[40px] font-extrabold leading-[0.98] sm:text-[80px]">
            <Words text={t("Book your free call")} />
          </h1>
          <p className="bk-item mt-4 max-w-[46ch] text-[16px] leading-relaxed text-slate-light sm:mt-7 sm:text-[19px]">
            {t("A 20-minute call. You leave with a fixed price and a go-live date.")}
          </p>

          <ul className="bk-item mt-5 flex flex-wrap gap-2 lg:hidden">
            {["Free", "20 minutes", "No payment"].map((b) => (
              <li key={b} className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[13px] font-medium">
                <Check className="h-3.5 w-3.5 text-live" />
                {t(b)}
              </li>
            ))}
          </ul>

          <ul className="bk-item mt-9 hidden space-y-3.5 lg:block">
            {[
              "No payment, no commitment",
              "Evening slots that update live",
              "Google Meet or WhatsApp call, your choice",
            ].map((b) => (
              <li key={b} className="flex gap-3 text-[17px]">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-live text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {t(b)}
              </li>
            ))}
          </ul>

          <div className="bk-item glass mt-6 hidden lg:mt-10 lg:flex items-center gap-4 rounded-2xl p-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent font-display text-[20px] font-extrabold text-ink">
              {initials}
            </span>
            <p className="leading-snug">
              <span className="block font-bold">{t("You'll speak with")} {founder.name}</span>
              <span className="block text-[14px] text-slate-light">{founder.role}</span>
            </p>
          </div>

          <div className="bk-item mt-8 hidden rounded-2xl border border-dashed lg:block border-line-dark p-6">
            <p className="font-display text-[22px] font-bold">{t("Not ready to book yet?")}</p>
            <p className="mt-1 text-[15px] text-slate-light">
              {site.quizHint}
            </p>
            <Link href={site.quizHref} className="mt-4 inline-flex items-center gap-2 font-bold text-accent hover:underline">
              {site.quizLabel}
              <Arrow />
            </Link>
          </div>
        </div>

        <div className="bk-card">
          <BookingCard />
        </div>
      </div>
    </Section>
  );
}
