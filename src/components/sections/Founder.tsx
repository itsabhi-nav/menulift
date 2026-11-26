"use client";

import { useRef } from "react";
import Image from "next/image";
import { Cta, Section } from "../ui";
import { Words } from "../motion/Words";
import { Counter } from "../motion/Counter";
import { gsap, useGSAP } from "../motion/gsap";
import { useContent } from "@/components/I18n";

export function Founder({ asH1 = false }: { asH1?: boolean } = {}) {
  const { founder, site, stats } = useContent();
  const root = useRef<HTMLDivElement>(null);
  const initials = founder.name
    .replace(/[[\]]/g, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.from(q(".fd-title .w"), {
          yPercent: 118,
          duration: 1,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: { trigger: q(".fd-title")[0], start: "top 85%", once: true },
        });
        gsap.from(q(".fd-bio p"), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".fd-bio")[0], start: "top 85%", once: true },
        });
        gsap.fromTo(
          q(".fd-photo"),
          { yPercent: 10 },
          {
            yPercent: -10,
            ease: "none",
            scrollTrigger: { trigger: q(".fd-frame")[0], start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.from(q(".fd-block"), {
          x: -40,
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".fd-frame")[0], start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <Section id="founder" tone="sand">
      <div ref={root} className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="relative mx-auto w-full max-w-md">
          <div className="fd-block absolute -left-5 -top-5 h-full w-full rounded-[2.25rem] bg-accent" aria-hidden />
          <div className="fd-frame relative aspect-[4/5] overflow-hidden rounded-[2.25rem] bg-ink">
            <div className="fd-photo absolute inset-x-0 -inset-y-[12%]">
              {founder.photo ? (
                <Image
                  src={founder.photo}
                  alt={`${founder.name}, ${founder.role}`}
                  fill
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center bg-gradient-to-br from-ink-3 to-deep">
                  <span className="font-display text-[130px] font-extrabold text-accent">{initials}</span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute -bottom-6 -right-4 rounded-2xl bg-white px-6 py-4 shadow-2xl">
            <p className="font-display text-[34px] font-extrabold leading-none">
              <Counter to={stats[0].to} suffix={stats[0].suffix} />
            </p>
            <p className="mt-1 text-[13px] font-semibold text-slate">{stats[0].label}</p>
          </div>
        </div>

        <div>
          <p className="leading-tight">
            <span className="block text-[18px] font-bold">{founder.name}</span>
            <span className="block text-[15px] text-slate">{founder.role}</span>
          </p>
          {(() => {
            const Tag = asH1 ? "h1" : "h2";
            return (
              <Tag className="fd-title mt-4 max-w-[14ch] text-[40px] font-extrabold leading-[1] sm:text-[68px]">
                <Words text={founder.headline} />
              </Tag>
            );
          })()}
          <div className="fd-bio mt-8 max-w-[54ch] space-y-4 text-[18px] leading-relaxed text-slate">
            {founder.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-white p-5">
                <dd className="font-display text-[30px] font-extrabold leading-none">
                  <Counter to={s.to} decimals={s.decimals ?? 0} suffix={s.suffix} />
                </dd>
                <dt className="mt-2 text-[13px] leading-snug text-slate">{s.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            {founder.linkedin && (
              <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="mr-5 inline-block font-semibold underline underline-offset-4">
                {founder.name} on LinkedIn
              </a>
            )}
            <Cta href={site.ctaHref} variant="ink">
              {site.ctaLabel}
            </Cta>
          </div>
        </div>
      </div>
    </Section>
  );
}
