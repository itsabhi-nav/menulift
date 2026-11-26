"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/L";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Arrow, Close, Menu } from "./ui";
import { Magnetic } from "./motion/Magnetic";
import { ScrollTrigger } from "./motion/gsap";
import { useContent, useLocale, useT } from "@/components/I18n";
import { localePath, stripLocale } from "@/lib/i18n";

const links = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/results", label: "Results" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  const t = useT();
  const { site } = useContent();
  return (
    <span className={`font-display text-[22px] font-extrabold tracking-tight ${className}`}>
      menu<span className="text-accent">{t("lift")}</span>
    </span>
  );
}

/** EN | हिं switch. English has no prefix; Hindi lives under /hi. */
function LangSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const path = usePathname();
  const clean = stripLocale(path);
  const item = (code: "en" | "hi", label: string, name: string) => (
    <a
      href={localePath(code, clean)}
      hrefLang={code}
      lang={code}
      aria-label={name}
      aria-current={locale === code ? "true" : undefined}
      className={`grid min-h-8 min-w-9 place-items-center rounded-full px-2.5 text-[13px] font-semibold transition-colors ${
        locale === code ? "bg-paper text-ink" : "text-slate-light hover:text-paper"
      }`}
    >
      {label}
    </a>
  );
  return (
    <div className={`inline-flex items-center rounded-full border border-line-dark p-0.5 ${className}`}>
      {item("en", "EN", "English")}
      {item("hi", "हिं", "हिन्दी")}
    </div>
  );
}

export function Nav() {
  const t = useT();
  const { site } = useContent();
  const [open, setOpen] = useState(false);
  const path = stripLocale(usePathname());
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[90] border-b border-white/10 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-4 sm:px-8">
        <Link href="/" aria-label={t("Menulift home")}>
          <Wordmark />
        </Link>

        <nav aria-label={t("Main")} className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={path === l.href ? "page" : undefined}
              className={`group relative text-[15px] font-medium transition-colors hover:text-paper ${
                path === l.href ? "text-paper" : "text-slate-light"
              }`}
            >
              {t(l.label)}
              <span
                className="absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-accent transition-transform duration-300 group-hover:!scale-x-100"
                style={{ transform: path === l.href ? "scaleX(1)" : "scaleX(0)" }}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch />
          <div className="hidden md:block">
            <Magnetic strength={0.25}>
              <Link
                href={site.ctaHref}
                className="inline-block rounded-full bg-accent px-5 py-2.5 text-[15px] font-bold text-ink transition-colors hover:bg-accent-deep"
              >
                {site.ctaLabel}
              </Link>
            </Magnetic>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line-dark md:hidden"
            aria-label={open ? t("Close menu") : t("Open menu")}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        ref={bar}
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
        aria-hidden
      />

      {open && createPortal(
        <div className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-deep px-5 pb-8 pt-[112px] md:hidden">
          <nav aria-label={t("Mobile")} className="flex flex-col">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="menu-in flex items-center justify-between border-b border-line-dark py-4 font-display text-[30px] leading-none active:text-accent"
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-[13px] font-medium text-slate-light">0{i + 1}</span>
                  {t(l.label)}
                </span>
                <Arrow className="h-5 w-5 text-accent" />
              </Link>
            ))}
          </nav>

          <div className="menu-in mt-auto pt-8" style={{ animationDelay: "0.3s" }}>
            <Link
              href={site.ctaHref}
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center justify-center rounded-full bg-accent text-[17px] font-semibold text-ink"
            >
              {site.ctaLabel}
            </Link>
            <Link
              href={site.quizHref}
              onClick={() => setOpen(false)}
              className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-line-dark text-[16px] font-medium"
            >
              {site.quizLabel}
            </Link>
            <a
              href={`https://wa.me/${site.whatsappNumber}`}
              className="mt-5 block text-center text-[14px] text-slate-light"
            >
              WhatsApp {site.phoneDisplay}
            </a>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
