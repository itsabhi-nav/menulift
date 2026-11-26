"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, reduced } from "./gsap";
import { markReady } from "@/lib/ready";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      let seen = false;
      try {
        seen = sessionStorage.getItem("ml_seen") === "1";
      } catch {}
      if (reduced() || seen) {
        setGone(true);
        markReady();
        return;
      }
      try {
        sessionStorage.setItem("ml_seen", "1");
      } catch {}

      const num = root.current!.querySelector<HTMLElement>("[data-num]")!;
      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          markReady();
          setGone(true);
        },
      });
      tl.from(".pre-letter", { yPercent: 115, stagger: 0.05, duration: 0.8, ease: "power4.out" })
        .to(
          counter,
          {
            v: 100,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => {
              num.textContent = String(Math.round(counter.v));
            },
          },
          0.1,
        )
        .to(".pre-bar", { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 0.1)
        .to(".pre-inner", { autoAlpha: 0, y: -20, duration: 0.4, ease: "power2.in" }, "+=0.1")
        .to(root.current, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, "-=0.1")
        .add(markReady, "-=0.5");
    },
    { scope: root },
  );

  if (gone) return null;
  return (
    <div
      ref={root}
      id="ml-pre"
      className="fixed inset-0 z-[200] grid place-items-center bg-deeper text-paper"
      aria-hidden
    >
      <noscript>
        <style>{`#ml-pre{display:none}`}</style>
      </noscript>
      <div className="pre-inner w-[min(80vw,420px)]">
        <div className="flex overflow-hidden font-display text-[clamp(48px,12vw,96px)] font-extrabold leading-[1.05] tracking-tight">
          {"menu".split("").map((c, i) => (
            <span key={i} className="pre-letter inline-block">
              {c}
            </span>
          ))}
          {"lift".split("").map((c, i) => (
            <span key={i} className="pre-letter inline-block text-accent">
              {c}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-end justify-between text-[14px] text-slate-light">
          <span>Getting your kitchen ready</span>
          <span className="font-display text-[22px] font-bold tabular-nums text-paper">
            <span data-num>0</span>
          </span>
        </div>
        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-ink-3">
          <div className="pre-bar h-full origin-left rounded-full bg-accent" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
