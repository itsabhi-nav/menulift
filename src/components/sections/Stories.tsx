"use client";

import { useRef } from "react";
import Link from "@/components/L";
import { Arrow } from "../ui";
import { Counter } from "../motion/Counter";
import { gsap, useGSAP } from "../motion/gsap";
import { useContent, useT } from "@/components/I18n";

const skins = [
  "bg-accent text-ink",
  "bg-paper text-ink",
  "bg-ink-3 text-paper border border-white/10",
];

export function Stories() {
  const t = useT();
  const { stories, videoUrl, site } = useContent();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const track = q(".st-track")[0] as HTMLElement;
        const pin = q(".st-pin")[0] as HTMLElement;
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + dist(),
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(q(".st-progress")[0], {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + dist(),
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        // each card eases up a little as it travels in
        q(".st-card").forEach((c) =>
          gsap.from(c, {
            y: 70,
            rotate: 2,
            ease: "none",
            scrollTrigger: {
              trigger: c,
              containerAnimation: gsap.getTweensOf(track)[0],
              start: "left 98%",
              end: "left 60%",
              scrub: true,
            },
          }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stories" className="scroll-mt-16 bg-ink text-paper">
      <div className="st-pin flex flex-col justify-center overflow-hidden py-12 lg:h-svh lg:py-0">
        <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="max-w-[12ch] text-[40px] font-extrabold leading-[1] sm:text-[72px]">
              {t("Go-live stories")}
            </h2>
            <p className="max-w-[36ch] text-[17px] text-slate-light md:text-right">
              {t("Real kitchens, real timelines: how long each took from first call to first order.")}
            </p>
          </div>
        </div>

        <div className="mt-10 lg:mt-12">
          <div
            className="st-track flex w-max gap-5 px-4 max-lg:w-auto max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto max-lg:pb-4 sm:px-8 lg:px-[max(2rem,calc((100vw-1360px)/2+2rem))]"
          >
            {stories.map((s, i) => (
              <article
                key={s.outlet}
                className={`st-card relative flex h-[440px] w-[min(86vw,520px)] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[2rem] p-8 sm:h-[480px] sm:p-10 ${skins[i]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="leading-tight">
                    <p className="font-display text-[24px] font-extrabold">{s.outlet}</p>
                    <p className="mt-1 text-[15px] opacity-70">
                      {s.type}, {s.city}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-ink/90 px-3 py-1.5 text-[13px] font-bold text-live">
                    <span className="live-dot h-2 w-2 rounded-full bg-live" />
                    {t("Live")}
                  </span>
                </div>

                <div>
                  <p className="font-display leading-[0.85]">
                    <span className="text-[clamp(96px,14vw,160px)] font-extrabold">
                      <Counter to={s.days} />
                    </span>
                    <span className="ml-2 text-[22px] font-bold opacity-70">{t("days to live")}</span>
                  </p>
                  <p className="mt-5 max-w-[34ch] text-[17px] leading-snug">“{s.quote}”</p>
                  <p className="mt-4 text-[15px] font-bold">{s.name}</p>
                </div>
              </article>
            ))}

            <Link
              href="/book"
              data-cursor
              className="st-card group relative flex h-[440px] w-[min(86vw,420px)] shrink-0 snap-center flex-col justify-between rounded-[2rem] border border-dashed border-accent/60 p-8 sm:h-[480px] sm:p-10"
            >
              <p className="font-display text-[44px] font-extrabold leading-[1.02] sm:text-[52px]">
                {t("Your kitchen could be next.")}
              </p>
              <span className="flex items-center justify-between rounded-full bg-accent px-7 py-5 text-[18px] font-bold text-ink">
                {site.bookLabel}
                <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </span>
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-10 hidden w-full max-w-[1360px] px-8 lg:block">
          <div className="h-[3px] overflow-hidden rounded-full bg-ink-3">
            <div
              className="st-progress h-full origin-left rounded-full bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>

      {videoUrl && (
        <div className="mx-auto max-w-[1360px] px-4 pb-14 sm:px-8">
          <div className="aspect-video overflow-hidden rounded-[2rem] bg-ink-2">
            <iframe src={videoUrl} title={t("Menulift client go-live story")} className="h-full w-full" loading="lazy" allowFullScreen />
          </div>
        </div>
      )}
    </section>
  );
}
