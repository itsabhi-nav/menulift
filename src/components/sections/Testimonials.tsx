"use client";

import { useRef } from "react";
import { Star } from "../ui";
import { SnapDots } from "../SnapDots";
import { Words } from "../motion/Words";
import { gsap, ScrollTrigger, useGSAP, reduced } from "../motion/gsap";
import { useContent, useT } from "@/components/I18n";

type Review = { name: string; role: string; quote: string; metric?: string };

function Card({ r }: { r: Review }) {
  const t = useT();
  return (
    <figure className="relative flex h-full w-[min(84vw,400px)] shrink-0 flex-col rounded-[1.75rem] bg-paper p-6 text-ink sm:p-7">
      <span className="absolute right-5 top-2 font-display text-[88px] leading-none text-accent" aria-hidden>
        &ldquo;
      </span>
      {r.metric && <p className="relative max-w-[14ch] font-display text-[28px] leading-[1.05] sm:text-[32px]">{r.metric}</p>}
      <div className="mt-3 flex gap-0.5 text-accent-deep" aria-label={t("5 out of 5 stars")}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4" />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-[16px] leading-relaxed text-slate sm:text-[17px]">{r.quote}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-ink font-display text-[16px] text-accent">
          {r.name.split(" ").map((n) => n[0]).join("")}
        </span>
        <span className="leading-tight">
          <span className="block font-semibold">{r.name}</span>
          <span className="block text-[14px] text-slate">{r.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ items, dir }: { items: Review[]; dir: 1 | -1 }) {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="rv-row overflow-hidden" data-dir={dir}>
      <div className="rv-track flex w-max gap-5 py-2 pr-5">
        {loop.map((r, i) => (
          <Card key={i} r={r} />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const t = useT();
  const { stories, testimonials } = useContent();
  const rowA: Review[] = testimonials.map((t) => ({ ...t }));
  const rowB: Review[] = stories.map((s) => ({
    name: s.name,
    role: `${s.outlet}, ${s.city}`,
    quote: s.quote,
    metric: `${t("Live in")} ${s.days} ${t("days")}`,
  }));
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(".rv-title .w"), {
        yPercent: 118,
        duration: 1,
        stagger: 0.07,
        ease: "power4.out",
        scrollTrigger: { trigger: q(".rv-title")[0], start: "top 85%", once: true },
      });
      q(".rv-row").forEach((row) => {
        const dir = Number((row as HTMLElement).dataset.dir);
        const track = row.querySelector(".rv-track") as HTMLElement;
        const tween = gsap.fromTo(
          track,
          { xPercent: dir === 1 ? 0 : -25 },
          { xPercent: dir === 1 ? -25 : 0, duration: 46, ease: "none", repeat: -1 },
        );
        row.addEventListener("mouseenter", () => gsap.to(tween, { timeScale: 0.12, duration: 0.6 }));
        row.addEventListener("mouseleave", () => gsap.to(tween, { timeScale: 1, duration: 0.8 }));
        ScrollTrigger.create({
          trigger: row,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? tween.resume() : tween.pause()),
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="reviews" className="scroll-mt-16 bg-ink-2 py-14 text-paper sm:py-36">
      <div ref={root}>
        <div className="mx-auto max-w-[1360px] px-4 sm:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="rv-title max-w-[12ch] text-[40px] font-extrabold leading-[1] sm:text-[72px]">
              <Words text={t("What owners say")} />
            </h2>
            <p className="flex items-center gap-3 text-[15px] text-slate-light">
              <span className="font-display text-[40px] leading-none text-paper">4.9</span>
              <span className="leading-tight">
                <span className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" />
                  ))}
                </span>
                {t("Google rating")}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-8 hidden space-y-5 md:mt-16 md:block">
          <Row items={rowA} dir={1} />
          <Row items={rowB} dir={-1} />
        </div>
        <div className="mt-6 md:hidden">
          <div className="rv-swipe flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 pt-1">
            {[...rowA, ...rowB].map((r, i) => (
              <div key={i} className="snap-center">
                <Card r={r} />
              </div>
            ))}
          </div>
          <SnapDots selector=".rv-swipe" count={rowA.length + rowB.length} dark />
        </div>
      </div>
    </section>
  );
}
