"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current !== pathname) {
      previous.current = pathname;
      setDone(true);
      setActive(false);
      const timeout = window.setTimeout(() => setDone(false), 260);
      return () => window.clearTimeout(timeout);
    }
  }, [pathname]);

  useEffect(() => {
    let timeout = 0;
    const start = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http")) return;
      if (anchor.target === "_blank") return;
      setDone(false);
      setActive(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setActive(false), 6000);
    };
    document.addEventListener("pointerdown", start, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", start);
      window.clearTimeout(timeout);
    };
  }, []);

  if (!active && !done) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[300] h-[3px]" aria-hidden>
      <div
        className={`h-full origin-left bg-accent ${
          done ? "animate-[route-complete_260ms_ease-out_forwards]" : "animate-[route-progress_1.1s_ease-in-out_infinite]"
        }`}
      />
    </div>
  );
}
