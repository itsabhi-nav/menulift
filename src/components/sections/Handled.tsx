"use client";

import { useRef } from "react";
import Link from "@/components/L";
import { Arrow, Check } from "../ui";
import { gsap, useGSAP, reduced } from "../motion/gsap";
import { useContent, useT } from "@/components/I18n";

const items = [
  ["FSSAI and documents", "Checked and corrected before anything is filed"],
  ["Zomato application", "Filed, followed up, every query answered"],
  ["Swiggy application", "Filed, followed up, every query answered"],
  ["Menu and pricing", "Priced so every order earns a margin"],
  ["Launch offers", "Set up so your first orders arrive"],
];

export function Handled() {
  const t = useT();
  const { site } = useContent();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const checks = q(".hd-check");
      if (reduced()) {
        checks.forEach((c) => c.setAttribute("data-on", "true"));
        return;
      }
      gsap.from(q(".hd-copy > *"), {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: q(".hd-list")[0], start: "top 78%", once: true },
      });
      tl.from(q(".hd-row"), { x: 40, autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" });
      checks.forEach((c, i) => tl.add(() => c.setAttribute("data-on", "true"), 0.55 + i * 0.4));
      tl.from(q(".hd-done"), { y: 20, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, ">0.1");
    },
    { scope: root },
  );

  return (
    <section ref={root} className="overflow-hidden bg-paper py-14 text-ink sm:py-32">
      <div className="mx-auto grid max-w-[1360px] items-center gap-10 px-4 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="hd-copy">
          <h2 className="text-[40px] leading-[1.02] sm:text-[84px]">
            {t("You cook.")}
            <span className="block text-slate">{t("We handle the rest.")}</span>
          </h2>
          <p className="mt-5 max-w-[40ch] text-[17px] leading-relaxed text-slate sm:mt-7 sm:text-[21px]">
            {t("Starting out on Zomato and Swiggy means paperwork, applications, a menu and offers. We do all of it, so you only have to cook.")}
          </p>
          <Link href={site.ctaHref} className="group mt-6 inline-flex items-center gap-2 text-[18px] font-semibold underline underline-offset-4 sm:mt-8">
            {site.ctaLabel}
            <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="hd-list rounded-[1.75rem] bg-ink p-3 text-paper sm:rounded-[2rem] sm:p-5">
          <ul className="space-y-2">
            {items.map(([title, d]) => (
              <li key={title} className="hd-row flex items-center gap-3 rounded-2xl bg-ink-2 px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4">
                <span
                  className="hd-check tl-node grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-white/25 text-transparent"
                  data-on="false"
                >
                  <Check className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-semibold leading-tight sm:text-[19px]">{t(title)}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-slate-light sm:text-[15px]">{t(d)}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="hd-done mt-3 rounded-2xl bg-accent px-5 py-4 text-center font-display text-[20px] text-ink sm:text-[24px]">
            {t("You get back to cooking.")}
          </p>
        </div>
      </div>
    </section>
  );
}
