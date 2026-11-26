"use client";

import { useEffect, useRef } from "react";
import { gsap, fine, reduced } from "./gsap";

/** A soft ring that trails the pointer and grows over anything clickable. Desktop only. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine() || reduced()) return;
    const r = ring.current!;
    const d = dot.current!;
    gsap.set([r, d], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3" });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });

    const move = (e: MouseEvent) => {
      gsap.to([r, d], { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const hit = (e.target as HTMLElement).closest("a,button,[data-cursor]");
      gsap.to(r, {
        scale: hit ? 1.9 : 1,
        backgroundColor: hit ? "rgba(240,180,76,0.18)" : "rgba(240,180,76,0)",
        duration: 0.35,
        ease: "power3.out",
      });
    };
    const leave = () => gsap.to([r, d], { autoAlpha: 0, duration: 0.3 });
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[150] hidden h-11 w-11 rounded-full border border-accent/70 [@media(pointer:fine)]:block"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[150] hidden h-1.5 w-1.5 rounded-full bg-accent [@media(pointer:fine)]:block"
      />
    </>
  );
}
