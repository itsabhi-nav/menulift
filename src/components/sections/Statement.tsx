"use client";

import { useRef } from "react";
import { ScrubWords } from "../motion/Words";
import { gsap, useGSAP, reduced } from "../motion/gsap";

export function Statement() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const words = gsap.utils.toArray<HTMLElement>(".sw", root.current);
      gsap.set(words, { opacity: 0.18 });
      gsap.to(words, {
        opacity: 1,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 55%", scrub: true },
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="bg-paper py-16 text-ink sm:py-44">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-8">
        <p className="text-[34px] font-semibold leading-[1.12] tracking-[-0.035em] sm:text-[64px]">
          <ScrubWords text="FSSAI, documents, both applications, your menu and launch offers. We handle all of it, so you can get back to cooking." />
        </p>
      </div>
    </section>
  );
}
