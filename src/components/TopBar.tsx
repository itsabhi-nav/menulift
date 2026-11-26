"use client";

import { useEffect, useState } from "react";
import { useContent, useT } from "@/components/I18n";

const KEY = "menulift_offer_end";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Each visitor gets a fixed window that persists across reloads. */
function useCountdown(hours: number) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    let end = 0;
    try {
      end = Number(localStorage.getItem(KEY)) || 0;
    } catch {}
    if (end < Date.now()) {
      end = Date.now() + hours * 3600_000;
      try {
        localStorage.setItem(KEY, String(end));
      } catch {}
    }
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hours]);

  return left;
}

export function TopBar() {
  const { scarcity } = useContent();
  const t = useT();
  const left = useCountdown(scarcity.windowHours);
  const s = left === null ? null : Math.floor(left / 1000);
  const time =
    s === null
      ? "--:--:--"
      : `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;

  return (
    <div className="bg-ink-3 text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-4 gap-y-0.5 px-4 py-2 text-center text-[13px] font-medium leading-snug sm:text-sm">
        <span>
          {scarcity.label}: {t("only")}{" "}
          <span className="rounded bg-accent px-1.5 py-0.5 text-ink">
            {scarcity.spotsLeft}
          </span>{" "}
          {t("spots left")}
        </span>
        <span className="hidden items-center gap-2 sm:flex">
          <span className="h-4 w-px bg-white/20" aria-hidden />
          {t("Offer closes in")}{" "}
          <span
            className="font-display tabular-nums"
            aria-live="off"
            suppressHydrationWarning
          >
            {time}
          </span>
        </span>
      </div>
    </div>
  );
}
