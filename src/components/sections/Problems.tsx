"use client";

import { useRef } from "react";
import Link from "@/components/L";
import { Arrow, Check, Cross } from "../ui";
import { SnapDots } from "../SnapDots";
import { gsap, useGSAP } from "../motion/gsap";
import { useContent, useT } from "@/components/I18n";

const docs: [string, boolean][] = [
  ["FSSAI licence", true],
  ["PAN card", true],
  ["Cancelled cheque", false],
  ["Menu with prices", false],
];

const costs: [string, string][] = [
  ["Food", "₹140"],
  ["Packaging", "₹25"],
  ["App fees", "₹96"],
  ["Offer you give", "₹64"],
];

type Problem = { chip: string; title: string; text: string; skin: string; visual: React.ReactNode };

function buildProblems(t: (s: string) => string): Problem[] {
  return [
  {
    chip: t("Day 9: you find out"),
    title: t("Weeks lost to missing documents"),
    text: t("One missing paper sends the whole application back to the start. Most owners only find out on day nine."),
    skin: "bg-ink-2",
    visual: (
      <div className="rounded-3xl bg-paper p-5 text-ink">
        <ul className="space-y-2.5">
          {docs.map(([d, ok]) => (
            <li key={d} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-[15px] font-semibold">
              {t(d)}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] ${
                  ok ? "bg-ink text-live" : "bg-danger/15 text-danger-deep"
                }`}
              >
                {ok ? <Check className="h-3 w-3" /> : <Cross className="h-3 w-3" />}
                {ok ? t("Done") : t("Missing")}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] text-slate">{t("Week 3: still waiting on two documents.")}</p>
      </div>
    ),
  },
  {
    chip: t("9 days, no update"),
    title: t("Listings rejected or stuck"),
    text: t("Unclear photos, name mismatches and wrong categories cause silent rejections, with no one to chase."),
    skin: "bg-ink-3",
    visual: (
      <div className="rounded-3xl bg-paper p-5 text-ink">
        <div className="flex items-center justify-between">
          <p className="font-display text-[20px]">{t("Listing review")}</p>
          <span className="rounded-full bg-danger/15 px-3 py-1 text-[12px] font-bold text-danger-deep">{t("Rejected")}</span>
        </div>
        <p className="mt-3 rounded-xl bg-white p-4 text-[15px] leading-snug text-slate">
          {t("Reason: restaurant name does not match licence. Resubmit with matching details.")}
        </p>
        <p className="mt-4 text-[13px] text-slate">{t("Resubmitted 2 times. No update in 9 days.")}</p>
      </div>
    ),
  },
  {
    chip: t("Loses ₹5 on every order"),
    title: t("Menus priced so every order loses money"),
    text: t("Commission, packaging and discounts quietly eat the price you set. You only notice at payout."),
    skin: "bg-ink-2",
    visual: (
      <div className="rounded-3xl bg-paper p-5 text-ink">
        <div className="flex items-baseline justify-between">
          <p className="text-[15px] font-semibold text-slate">{t("A thali priced at")}</p>
          <p className="font-display text-[26px]">₹320</p>
        </div>
        <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-[15px]">
          {costs.map(([k, v]) => (
            <li key={k} className="flex justify-between text-slate">
              <span>{t(k)}</span>
              <span>{v}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-danger/15 px-4 py-3 text-danger-deep">
          <span className="text-[14px] font-semibold">{t("Costs ₹325, so you keep")}</span>
          <span className="font-display text-[24px]">−₹5</span>
        </div>
        <p className="mt-3 text-[12px] text-slate">{t("Example figures.")}</p>
      </div>
    ),
  },
  ];
}

export function Problems() {
  const t = useT();
  const problems = buildProblems(t);
  const { site } = useContent();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".prob-card", {
          y: 60,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: ".prob-grid", start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="why" className="scroll-mt-16 bg-ink py-14 text-paper sm:py-36">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-8">
        <h2 className="max-w-[16ch] text-[40px] leading-[1.02] sm:text-[80px]">
          {t("Most kitchens don't fail.")} <span className="text-accent">{t("They get stuck.")}</span>
        </h2>
        <p className="mt-4 max-w-[44ch] border-l-2 border-accent pl-4 text-[16px] leading-relaxed text-slate-light sm:mt-6 sm:text-[20px]">
          {t("Paperwork, rejections and silence from the platforms hold most owners back.")}
        </p>

        <div className="prob-grid pb-swipe -mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0">
          {problems.map((p, i) => (
            <article
              key={p.title}
              className="prob-card relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-ink-3 to-ink-2 p-6 max-lg:w-[84vw] max-lg:max-w-[400px] max-lg:shrink-0 max-lg:snap-center sm:rounded-[2rem] sm:p-8"
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-danger to-accent" aria-hidden />
              <p className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-display text-[16px] text-ink">{i + 1}</span>
                <span className="rounded-full bg-danger/15 px-3 py-1 text-[13px] font-medium text-danger">{p.chip}</span>
              </p>
              <h3 className="mt-5 text-[26px] leading-[1.08] sm:text-[32px]">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-light sm:text-[16px]">{p.text}</p>
              <div className="mt-auto pt-6">{p.visual}</div>
            </article>
          ))}
        </div>
        <SnapDots selector=".pb-swipe" count={problems.length} dark />

        <div className="relative mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-ink-3 to-ink-2 p-6 sm:mt-16 sm:rounded-[2rem] sm:p-12">
          <span className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="max-w-[20ch] font-display text-[30px] leading-[1.05] sm:text-[44px]">
                {t("Find out which of these is slowing you down.")}
              </p>
              <p className="mt-3 max-w-[40ch] text-[15px] text-slate-light sm:text-[17px]">
                {t("Take the quick quiz for a checklist, or talk to us for 20 minutes. Both are free.")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={site.quizHref} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-accent px-7 text-[16px] font-semibold text-ink transition-transform hover:-translate-y-0.5">
                {site.quizLabel}
                <Arrow className="h-4 w-4" />
              </Link>
              <Link href={site.ctaHref} className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/25 px-7 text-[16px] font-semibold transition-colors hover:border-accent hover:text-accent">
                {site.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
