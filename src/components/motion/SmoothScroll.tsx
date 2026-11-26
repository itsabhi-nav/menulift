"use client";

import { useEffect } from "react";
import { ScrollTrigger, reduced } from "./gsap";

export function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    const update = () => ScrollTrigger.update();
    window.addEventListener("scroll", update, { passive: true });

    // In-page anchors glide, leaving room for the sticky nav.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const hash = href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : "";
      if (!hash || hash === "#" || window.location.pathname !== "/") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", update);
    };
  }, []);
  return null;
}
