"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "./motion/gsap";
import { useContent } from "@/components/I18n";

/** A vertical timeline: the line fills and each step lights up as you scroll. */
export function StepTimeline() {
  const { steps } = useContent();
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const nodes = q(".tl-node");
      if (reduced()) {
        nodes.forEach((n) => n.setAttribute("data-on", "true"));
        gsap.set(q(".tl-fill"), { scaleY: 1 });
        return;
      }
      gsap.fromTo(
        q(".tl-fill"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 65%", end: "bottom 70%", scrub: true },
        },
      );
      q(".tl-item").forEach((item, i) => {
        gsap.from(item, {
          y: 28,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });
        ScrollTrigger_on(item, nodes[i]);
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative space-y-4 pl-14">
      <span className="absolute bottom-6 left-[19px] top-6 w-[2px] rounded-full bg-white/15" aria-hidden />
      <span className="tl-fill absolute bottom-6 left-[19px] top-6 w-[2px] origin-top rounded-full bg-accent" aria-hidden />
      {steps.map((s, i) => (
        <li key={s.title} className="tl-item relative rounded-2xl border border-line-dark bg-gradient-to-br from-ink-2 to-ink p-5">
          <span
            className="tl-node absolute -left-14 top-4 grid h-10 w-10 place-items-center rounded-full border-2 border-line-dark bg-ink font-display text-[17px] font-semibold"
            data-on="false"
          >
            {i + 1}
          </span>
          <h3 className="text-[21px] leading-tight">{s.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-light">{s.text}</p>
          <p className="mt-4 flex flex-wrap gap-2 text-[13px] font-medium">
            <span className="rounded-full bg-accent px-3 py-1 text-ink">{s.time}</span>
            <span className="rounded-full border border-line-dark px-3 py-1 text-slate-light">{s.who}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}

function ScrollTrigger_on(item: Element, node: Element | undefined) {
  if (!node) return;
  ScrollTrigger.create({
    trigger: item,
    start: "top 62%",
    onEnter: () => node.setAttribute("data-on", "true"),
    onLeaveBack: () => node.setAttribute("data-on", "false"),
  });
}
