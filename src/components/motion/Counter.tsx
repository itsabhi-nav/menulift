"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "./gsap";

export function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  group = false,
  className = "",
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  group?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) =>
    prefix +
    (group ? Math.round(v).toLocaleString("en-IN") : v.toFixed(decimals)) +
    suffix;

  useGSAP(() => {
    const el = ref.current!;
    if (reduced()) return;
    el.textContent = fmt(0);
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, {
          v: to,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = fmt(o.v);
          },
        });
      },
    });
  });

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {fmt(to)}
    </span>
  );
}
