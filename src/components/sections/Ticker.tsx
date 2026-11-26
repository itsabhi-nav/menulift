"use client";

import { useContent } from "@/components/I18n";

/** A slim gold ticker between sections. Pure CSS; stops for reduced motion. */
export function Ticker() {
  const { marquee } = useContent();
  const items = [...marquee, ...marquee];
  return (
    <div className="overflow-hidden bg-accent py-3.5 text-ink sm:py-4" aria-hidden>
      <div className="ticker-track flex w-max items-center gap-6 whitespace-nowrap sm:gap-10">
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-6 sm:gap-10">
            <span className="font-display text-[17px] sm:text-[22px]">{m}</span>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" fill="currentColor">
              <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
