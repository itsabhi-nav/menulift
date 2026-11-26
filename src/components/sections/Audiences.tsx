"use client";

import { useState } from "react";
import Link from "@/components/L";
import Image from "next/image";
import { SnapDots } from "../SnapDots";
import { Arrow, Check, Cross, Section } from "../ui";
import { useContent, useLocale, useT } from "@/components/I18n";

const icons: Record<string, React.ReactNode> = {
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" />,
  cloud: <path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9H7Z" />,
  restaurant: (
    <path d="M6 3v7a2 2 0 0 0 2 2v9M10 3v7M6 6.5h4M18 3c-2 2-3 4.5-3 8h3v10" />
  ),
};

const skins = ["bg-ink text-paper", "bg-ink text-paper", "bg-ink text-paper"];

const photos: Record<string, { src: string; alt: string }> = {
  home: { src: "/photos/home.jpg", alt: "Cooking an omelette on a gas stove in a home kitchen" },
  cloud: { src: "/photos/cooks.jpg", alt: "Two cooks preparing dough in a small kitchen" },
  restaurant: { src: "/photos/oven.jpg", alt: "A baker sliding food into a wood-fired oven" },
};

function Photo({ k }: { k: string }) {
  const t = useT();
  return (
    <>
      <Image src={photos[k].src} alt={t(photos[k].alt)} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" aria-hidden />
    </>
  );
}

export function Audiences() {
  const t = useT();
  const { audiences } = useContent();
  const locale = useLocale();
  const [active, setActive] = useState(0);
  const cols = audiences.map((_, i) => (i === active ? "3.2fr" : "1fr")).join(" ");

  return (
    <Section id="who" tone="paper">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="max-w-[14ch] text-[40px] font-extrabold leading-[1] sm:text-[64px]">
          {t("Which kitchen are you?")}
        </h2>
        <p className="max-w-[34ch] text-[17px] text-slate md:text-right">
          {t("Pick yours. Each one has its own checklist, built around what that kitchen is missing.")}
        </p>
      </div>

      <div
        className="mt-8 sm:mt-14 hidden gap-4 lg:grid"
        style={{
          gridTemplateColumns: cols,
          transition: "grid-template-columns 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {audiences.map((a, i) => {
          const open = i === active;
          return (
            <Link
              key={a.key}
              href={`/check?type=${a.key}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              data-cursor
              className={`relative flex h-[520px] min-w-0 flex-col justify-between overflow-hidden rounded-[2rem] p-8 ${skins[i]}`}
            >
              <Photo k={a.key} />

              <div className="relative flex items-start justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {icons[a.key]}
                  </svg>
                </span>
                <span
                  className={`grid h-12 w-12 place-items-center rounded-full border border-current transition-[transform,background-color,border-color,color,opacity,box-shadow] duration-500 ${
                    open ? "rotate-0 bg-accent text-ink" : "-rotate-45"
                  }`}
                >
                  <Arrow />
                </span>
              </div>

              <div className="relative">
                <h3
                  className={`font-display font-extrabold leading-[0.95] transition-[font-size] duration-500 ${
                    open
                      ? "text-[40px] xl:text-[52px]"
                      : "text-[34px] [writing-mode:vertical-rl] rotate-180"
                  }`}
                >
                  {a.name}
                </h3>
                <div
                  className={`overflow-hidden transition-[opacity,transform] duration-500 ${
                    open ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none h-0 translate-y-4 opacity-0"
                  }`}
                >
                  <p className="mt-6 flex max-w-[40ch] gap-3 text-[16px] leading-snug opacity-75">
                    <Cross className="mt-0.5 h-4 w-4 shrink-0 text-current opacity-50" />
                    {a.pain}
                  </p>
                  <p className="mt-3 flex max-w-[40ch] gap-3 text-[17px] font-semibold leading-snug">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-current" />
                    {a.outcome}
                  </p>
                  <span className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-bold text-ink">
                    {a.cta}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* small screens: swipeable cards */}
      <div className="aud-swipe -mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-8 sm:px-8 lg:hidden">
        {audiences.map((a) => (
          <Link
            key={a.key}
            href={`/check?type=${a.key}`}
            className="relative flex min-h-[460px] w-[82vw] max-w-[350px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[1.75rem] bg-ink p-5 text-paper transition-transform active:scale-[0.99]"
          >
            <Photo k={a.key} />
            <span className="relative self-start rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-medium backdrop-blur-sm">
              {t("For")} {a.name.toLowerCase()}{locale === "hi" ? "" : "s"}
            </span>
            <div className="relative">
              <h3 className="font-display text-[34px] leading-none">{a.name}</h3>
              <p className="mt-4 flex gap-2.5 text-[14px] leading-snug text-paper/70">
                <Cross className="mt-0.5 h-4 w-4 shrink-0" />
                {a.pain}
              </p>
              <p className="mt-2.5 flex gap-2.5 text-[15px] font-semibold leading-snug">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-live" />
                {a.outcome}
              </p>
              <span className="mt-5 flex min-h-12 items-center justify-between rounded-full bg-accent px-5 text-[15px] font-bold text-ink">
                {a.cta}
                <Arrow className="h-4 w-4 shrink-0" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <SnapDots selector=".aud-swipe" count={audiences.length} />
    </Section>
  );
}
