"use client";

import { useState } from "react";
import Link from "@/components/L";
import { AnimatePresence, motion } from "motion/react";
import { Cta, Plus, Section } from "../ui";
import { useContent, useT } from "@/components/I18n";

export function Faq({ limit }: { limit?: number }) {
  const t = useT();
  const { faqs, site } = useContent();
  const [open, setOpen] = useState<number | null>(limit ? null : 0);
  return (
    <Section id="faq" tone="paper">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-[28px] font-extrabold leading-tight sm:text-[40px]">
            {t("Still have a question?")}
          </h2>
          <p className="mt-2 max-w-[34ch] text-[15px] text-slate sm:mt-4 sm:text-[17px]">
            {t("Ask us on the free call, or message us on WhatsApp. We reply the same day.")}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
            <Cta href={site.ctaHref} variant="ink">{site.ctaLabel}</Cta>
          </div>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {(limit ? faqs.slice(0, limit) : faqs).map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-4 text-left sm:py-6"
                  >
                    <span className="font-display text-[17px] font-semibold leading-snug sm:text-[22px]">
                      {f.q}
                    </span>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-[transform,background-color,border-color,color,opacity,box-shadow] duration-300 ${
                        isOpen ? "rotate-45 bg-accent text-ink" : "bg-paper-2 text-ink"
                      }`}
                    >
                      <Plus />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[60ch] pb-5 text-[15px] leading-relaxed text-slate sm:pb-7 sm:text-[17px]">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {limit && (
            <div className="py-6">
              <Link href="/faq" className="font-semibold underline underline-offset-4">{t("See all questions")}</Link>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
