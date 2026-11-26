"use client";

import { useEffect, useState } from "react";
import Link from "@/components/L";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n";
import { WhatsApp } from "./ui";
import { useContent, useT } from "@/components/I18n";

export function FloatingActions() {
  const t = useT();
  const { site } = useContent();
  const [pastHero, setPastHero] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const rawPath = usePathname();
  const path = stripLocale(rawPath);
  const onBook = path === "/book";

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      setPastHero(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setPastHero(!e.isIntersecting),
      { threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [path]);

  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 700);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [path]);

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const wa = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;

  return (
    <>
      <button
        type="button"
        onClick={toTop}
        aria-label={t("Back to top")}
        tabIndex={showTop ? 0 : -1}
        className={`fixed right-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-ink/90 text-paper shadow-xl backdrop-blur transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent md:right-6 md:bottom-24 ${
          onBook || !pastHero ? "bottom-5" : "bottom-[5.5rem]"
        } ${showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("Chat with Menulift on WhatsApp")}
        className={`fixed bottom-5 right-4 z-40 h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-xl transition-[transform,opacity] hover:scale-105 md:bottom-6 md:grid ${
          pastHero || onBook ? "hidden" : "grid"
        }`}
      >
        <WhatsApp className="h-8 w-8" />
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-line-dark bg-ink/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden ${
          pastHero && !onBook ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!pastHero || onBook}
      >
        <div className="flex gap-2">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("Chat with Menulift on WhatsApp")}
            tabIndex={pastHero && !onBook ? 0 : -1}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-wa text-white"
          >
            <WhatsApp className="h-7 w-7" />
          </a>
          <Link
            href={site.ctaHref}
            tabIndex={pastHero && !onBook ? 0 : -1}
            className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-accent text-[16px] font-bold text-ink"
          >
            {site.ctaLabel}
          </Link>
        </div>
      </div>
    </>
  );
}
