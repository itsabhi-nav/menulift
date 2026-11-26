"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/L";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";
import { useContent, useT } from "@/components/I18n";

/** Desktop only: after 30 seconds, a one-time offer of the checklist when the cursor leaves through the top. */
export function ExitIntent() {
  const t = useT();
  const { site } = useContent();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const ready = useRef(false);

  useEffect(() => {
    if (path === "/book" || path === "/check") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    try {
      if (sessionStorage.getItem("ml_exit")) return;
    } catch {}
    const t = window.setTimeout(() => (ready.current = true), 30000);
    const onLeave = (e: MouseEvent) => {
      if (!ready.current || e.clientY > 0) return;
      ready.current = false;
      try {
        sessionStorage.setItem("ml_exit", "1");
      } catch {}
      setOpen(true);
      track("exit_offer_shown");
    };
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] hidden place-items-center bg-black/60 p-6 md:grid" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-title"
        className="w-full max-w-[460px] rounded-[2rem] bg-paper p-9 text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="exit-title" className="text-[32px] leading-tight">{t("Before you go")}</h2>
        <p className="mt-3 text-[17px] leading-relaxed text-slate">
          {t("Take the free 2-minute quiz and we will send your go-live checklist on WhatsApp.")}
        </p>
        <Link
          href={site.quizHref}
          onClick={() => setOpen(false)}
          className="mt-7 flex min-h-14 items-center justify-center rounded-full bg-ink text-[17px] font-semibold text-paper"
        >
          {site.quizLabel}
        </Link>
        <button type="button" onClick={() => setOpen(false)} className="mt-4 w-full text-center text-[14px] text-slate underline">
          {t("No thanks")}
        </button>
      </div>
    </div>
  );
}
