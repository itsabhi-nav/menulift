"use client";

import { StepTimeline } from "../StepTimeline";

import { useRef } from "react";
import { Check, Cta } from "../ui";
import { PhoneShell } from "../PhoneShell";
import { gsap, useGSAP } from "../motion/gsap";
import { useContent, useT } from "@/components/I18n";

const docsList = ["FSSAI licence", "PAN card", "Cancelled cheque", "Menu with prices"];

function Tick({ className = "" }: { className?: string }) {
  return (
    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full bg-live text-white ${className}`}>
      <Check className="h-3.5 w-3.5" />
    </span>
  );
}

export function HowItWorks() {
  const t = useT();
  const { steps, site } = useContent();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const txt = q(".how-text");
        const scr = q(".how-screen");
        const dots = q(".how-dot");
        gsap.set(txt.slice(1), { autoAlpha: 0, y: 50 });
        gsap.set(scr.slice(1), { autoAlpha: 0, scale: 0.94 });
        gsap.set(q(".doc-tick"), { scale: 0, autoAlpha: 0 });
        gsap.set(q(".st-b"), { autoAlpha: 0 });
        gsap.set(q(".live-on"), { autoAlpha: 0 });
        gsap.set(q(".order-toast"), { autoAlpha: 0, y: -24 });
        gsap.set(q(".score-chip"), { autoAlpha: 0, y: 16 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: q(".how-pin")[0],
            start: "top top",
            end: "+=440%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
          },
        });

        // rail across the whole sequence
        tl.fromTo(q(".how-rail-fill"), { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 4 }, 0);

        // step 1: the check answers itself
        tl.to(q(".q-opt-1"), { backgroundColor: "#f0b44c", color: "#0a0a0b", duration: 0.25 }, 0.25)
          .to(q(".q-bar"), { scaleX: 0.5, duration: 0.4 }, 0.3)
          .to(q(".score-chip"), { autoAlpha: 1, y: 0, duration: 0.3 }, 0.65);

        // switch screens and text at 1, 2, 3
        for (let i = 1; i < 4; i++) {
          const at = i - 0.0;
          tl.to(txt[i - 1], { autoAlpha: 0, y: -50, duration: 0.35 }, at)
            .to(txt[i], { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.1)
            .to(scr[i - 1], { autoAlpha: 0, scale: 1.04, duration: 0.35 }, at)
            .to(scr[i], { autoAlpha: 1, scale: 1, duration: 0.4 }, at + 0.1)
            .to(dots[i], { backgroundColor: "#f0b44c", scale: 1.25, duration: 0.2 }, at + 0.1);
        }

        // step 2: documents tick one by one
        q(".doc-tick").forEach((t, i) =>
          tl.to(t, { scale: 1, autoAlpha: 1, duration: 0.2, ease: "back.out(2)" }, 1.45 + i * 0.12),
        );

        // step 3: both applications progress and get approved
        tl.to(q(".app-bar-z"), { scaleX: 1, duration: 0.45 }, 2.4)
          .to(q(".st-a-z"), { autoAlpha: 0, duration: 0.15 }, 2.8)
          .to(q(".st-b-z"), { autoAlpha: 1, duration: 0.15 }, 2.8)
          .to(q(".app-bar-s"), { scaleX: 1, duration: 0.45 }, 2.55)
          .to(q(".st-a-s"), { autoAlpha: 0, duration: 0.15 }, 2.95)
          .to(q(".st-b-s"), { autoAlpha: 1, duration: 0.15 }, 2.95);

        // step 4: the toggle flips and the first order arrives
        tl.to(q(".live-knob"), { x: 20, duration: 0.25 }, 3.4)
          .to(q(".live-track"), { backgroundColor: "#34d399", duration: 0.25 }, 3.4)
          .to(q(".live-off"), { autoAlpha: 0, duration: 0.2 }, 3.4)
          .to(q(".live-on"), { autoAlpha: 1, duration: 0.2 }, 3.4)
          .to(q(".order-toast"), { autoAlpha: 1, y: 0, duration: 0.3, ease: "back.out(1.6)" }, 3.65)
          .to({}, { duration: 0.01 }, 4);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="how" className="scroll-mt-16 bg-deep text-paper">
      {/* desktop: pinned, scroll-driven */}
      <div className="how-pin relative hidden h-svh items-center overflow-hidden lg:flex">
        <div className="mx-auto grid w-full max-w-[1360px] grid-cols-[1fr_auto] items-center gap-20 px-8">
          <div className="grid grid-cols-[auto_1fr] gap-10">
            {/* rail */}
            <div className="relative flex flex-col items-center justify-between py-2" aria-hidden>
              <div className="absolute inset-y-3 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-ink-3">
                <div className="how-rail-fill h-full origin-top rounded-full bg-live" />
              </div>
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`how-dot relative z-10 grid h-9 w-9 place-items-center rounded-full border-2 border-ink-3 bg-deep font-display text-[15px] font-bold`}
                  style={i === 0 ? { backgroundColor: "#f0b44c", color: "#0a0a0b", transform: "scale(1.25)" } : undefined}
                >
                  {i + 1}
                </span>
              ))}
            </div>

            <div>
              <h2 className="text-[56px] font-extrabold leading-none xl:text-[72px]">{t("How it works")}</h2>
              <div className="mt-10 grid min-h-[300px] [&>*]:col-start-1 [&>*]:row-start-1">
                {steps.map((s) => (
                  <div key={s.title} className="how-text">
                    <h3 className="max-w-[16ch] font-display text-[40px] font-extrabold leading-[1.02] xl:text-[52px]">
                      {s.title}
                    </h3>
                    <p className="mt-5 max-w-[44ch] text-[19px] leading-relaxed text-slate-light">{s.text}</p>
                    <dl className="mt-7 flex gap-10 text-[15px]">
                      <div>
                        <dt className="text-slate-light">{t("Who does it")}</dt>
                        <dd className="mt-1 text-[17px] font-bold">{s.who}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-light">{t("How long")}</dt>
                        <dd className="mt-1 text-[17px] font-bold">{s.time}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Cta href={site.ctaHref}>{site.ctaLabel}</Cta>
              </div>
            </div>
          </div>

          <div className="relative">
            <PhoneShell label={t("The phone shows each step as it happens: the check, the documents, the applications, and going live")} className="!w-[330px]">
              <div className="relative h-[540px]">
                {/* 1 check */}
                <div className="how-screen absolute inset-0 px-5 pt-6">
                  <p className="text-[13px] font-semibold text-slate">{t("Readiness Check")}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper-2">
                    <div className="q-bar h-full origin-left rounded-full bg-accent" style={{ transform: "scaleX(0.17)" }} />
                  </div>
                  <p className="mt-6 text-[12px] font-semibold text-slate">{t("Question 2 of 6")}</p>
                  <p className="mt-1 font-display text-[24px] font-extrabold leading-tight">
                    {t("Do you have an FSSAI licence?")}
                  </p>
                  <div className="mt-5 space-y-2.5">
                    {[t("Yes, it's valid"), t("I've applied"), t("No, not yet")].map((o, i) => (
                      <div
                        key={o}
                        className={`${i === 0 ? "q-opt-1" : ""} rounded-2xl border border-line bg-white px-4 py-3.5 text-[15px] font-semibold`}
                      >
                        {o}
                      </div>
                    ))}
                  </div>
                  <div className="score-chip mt-6 rounded-2xl bg-ink px-4 py-3 text-paper">
                    <p className="text-[12px] text-slate-light">{t("Your readiness so far")}</p>
                    <p className="font-display text-[26px] font-extrabold">{t("72 out of 100")}</p>
                  </div>
                </div>

                {/* 2 documents */}
                <div className="how-screen absolute inset-0 px-5 pt-6">
                  <p className="text-[13px] font-semibold text-slate">{t("Documents")}</p>
                  <p className="mt-2 font-display text-[26px] font-extrabold leading-tight">
                    {t("We check every paper")}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {docsList.map((d) => (
                      <li key={d} className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-4 text-[15px] font-semibold">
                        {t(d)}
                        <Tick className="doc-tick" />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-[13px] text-slate">{t("Checked and corrected by Menulift before filing.")}</p>
                </div>

                {/* 3 applications */}
                <div className="how-screen absolute inset-0 px-5 pt-6">
                  <p className="text-[13px] font-semibold text-slate">{t("Applications")}</p>
                  <p className="mt-2 font-display text-[26px] font-extrabold leading-tight">
                    {t("Filed on both platforms")}
                  </p>
                  {[
                    { n: "Zomato", k: "z" },
                    { n: "Swiggy", k: "s" },
                  ].map((p) => (
                    <div key={p.k} className="mt-5 rounded-2xl border border-line bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-display text-[20px] font-bold">{p.n}</p>
                        <span className="relative h-7 w-24">
                          <span className={`st-a-${p.k} absolute right-0 rounded-full bg-accent/25 px-3 py-1 text-[12px] font-bold text-accent-deep`}>
                            {t("In review")}
                          </span>
                          <span className={`st-b st-b-${p.k} absolute right-0 flex items-center gap-1 rounded-full bg-live/15 px-3 py-1 text-[12px] font-bold text-live`}>
                            <Check className="h-3 w-3" /> {t("Approved")}
                          </span>
                        </span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper-2">
                        <div className={`app-bar-${p.k} h-full origin-left rounded-full bg-live`} style={{ transform: "scaleX(0.2)" }} />
                      </div>
                    </div>
                  ))}
                  <p className="mt-5 text-[13px] text-slate">{t("We follow up until both say yes.")}</p>
                </div>

                {/* 4 live */}
                <div className="how-screen absolute inset-0 px-5 pt-6">
                  <div className="order-toast flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-paper shadow-lg">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-live text-sm font-bold">₹</span>
                    <span className="leading-tight">
                      <span className="block text-[14px] font-bold">{t("Your first order")}</span>
                      <span className="block text-[12px] text-slate-light">{t("Paneer thali, ₹549")}</span>
                    </span>
                  </div>
                  <p className="mt-6 text-[13px] font-semibold text-slate">{t("Your kitchen")}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="font-display text-[26px] font-extrabold">{t("Amma's Tiffin")}</p>
                    <span className="relative h-8 w-20">
                      <span className="live-off absolute right-0 rounded-full bg-paper-2 px-3 py-1.5 text-[12px] font-bold text-slate">
                        {t("Offline")}
                      </span>
                      <span className="live-on absolute right-0 flex items-center gap-1.5 rounded-full bg-live px-3 py-1.5 text-[12px] font-bold text-white">
                        <span className="live-dot h-2 w-2 rounded-full bg-white" /> {t("Live")}
                      </span>
                    </span>
                  </div>
                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-ink px-4 py-4 text-paper">
                    <span className="text-[14px] font-medium text-slate-light">{t("Accepting orders")}</span>
                    <span className="live-track relative h-7 w-12 rounded-full bg-ink-3">
                      <span className="live-knob absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white" />
                    </span>
                  </div>
                  <p className="mt-6 font-display text-[22px] font-bold leading-tight">
                    {t("Menu priced for margin. Launch offers on.")}
                  </p>
                </div>
              </div>
            </PhoneShell>
          </div>
        </div>
      </div>

      {/* small screens and reduced motion: a plain list */}
      <div className="px-4 py-12 sm:px-8 lg:hidden">
        <h2 className="text-[40px] font-extrabold leading-none sm:text-[56px]">{t("How it works")}</h2>
        <div className="mt-8"><StepTimeline /></div>
        <ol className="hidden">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent font-display text-[20px] font-extrabold text-ink">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-[26px] font-extrabold leading-tight">{s.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-slate-light">{s.text}</p>
                <p className="mt-3 text-[14px] text-slate-light">
                  {s.who}. {s.time}.
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 sm:mt-12">
          <Cta href={site.ctaHref}>{site.ctaLabel}</Cta>
        </div>
      </div>
    </section>
  );
}
