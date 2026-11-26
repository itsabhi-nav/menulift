"use client";

import { useEffect, useRef, useState } from "react";

/** Pagination dots for the swipe row that sits just above it. Mobile only. */
export function SnapDots({ selector, count, dark = false }: { selector: string; count: number; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scroller = ref.current?.parentElement?.querySelector<HTMLElement>(selector);
    if (!scroller) return;
    const onScroll = () => {
      const mid = scroller.scrollLeft + scroller.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      Array.from(scroller.children).forEach((c, i) => {
        const el = c as HTMLElement;
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(best);
    };
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [selector]);

  return (
    <div ref={ref} className="mt-4 flex justify-center gap-1.5 lg:hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-colors duration-300 ${
            i === active ? "w-6 bg-accent" : `w-1.5 ${dark ? "bg-white/25" : "bg-ink/20"}`
          }`}
        />
      ))}
    </div>
  );
}
