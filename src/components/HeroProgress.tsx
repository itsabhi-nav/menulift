"use client";

import { Check } from "./ui";
import { useT } from "@/components/I18n";

const rows = [
  ["FSSAI licence verified", "Day 1"],
  ["Documents checked", "Day 2"],
  ["Applied on Zomato and Swiggy", "Day 4"],
  ["Live, first order in", "Day 7"],
];

/** Mobile-only hero visual: the go-live days ticking off one by one. */
export function HeroProgress() {
  const t = useT();
  return (
    <div className="mx-auto max-w-[360px] rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold">{t("Amma's Tiffin")}</p>
        <span className="relative h-6 w-[88px] text-[12px] font-semibold">
          <span
            className="absolute inset-0 grid place-items-center rounded-full bg-white/15"
            style={{ animation: "pill-swap-out 0.4s 4.6s both" }}
          >
            {t("Going live")}
          </span>
          <span
            className="absolute inset-0 grid place-items-center rounded-full bg-live text-ink"
            style={{ animation: "pill-swap-in 0.4s 4.8s both", opacity: 0 }}
          >
            {t("Live")}
          </span>
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {rows.map(([label, day], i) => (
          <li
            key={label}
            className="tick-row flex items-center gap-3 rounded-xl bg-black/30 px-3 py-2.5 text-[14px]"
            style={{ animationDelay: `${0.8 + i * 1.1}s`, opacity: 0.45 }}
          >
            <span
              className="tick grid h-6 w-6 shrink-0 place-items-center rounded-full border"
              style={{ animationDelay: `${0.8 + i * 1.1}s`, borderColor: "rgb(255 255 255 / 0.3)" }}
            >
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1">{t(label)}</span>
            <span className="text-paper/60">{t(day)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
