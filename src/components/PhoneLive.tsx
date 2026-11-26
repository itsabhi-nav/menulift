"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { onReady } from "@/lib/ready";
import { PhoneShell } from "./PhoneShell";
import { useContent, useT } from "@/components/I18n";

const STEP_MS = 650;

/**
 * The hero's one orchestrated moment: a partner-app style listing whose
 * checklist ticks off, then flips from Offline to Live and receives an order.
 */
export function PhoneLive() {
  const t = useT();
  const { checklist } = useContent();
  const reduce = useReducedMotion();
  const total = checklist.length;
  const [done, setDone] = useState(0);
  const live = done >= total;
  const [order, setOrder] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDone(total);
      setOrder(true);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const off = onReady(() => {
      for (let i = 1; i <= total; i++) {
        timers.push(setTimeout(() => setDone(i), 1500 + i * STEP_MS));
      }
      timers.push(setTimeout(() => setOrder(true), 1500 + total * STEP_MS + 1200));
    });
    return () => {
      off();
      timers.forEach(clearTimeout);
    };
  }, [reduce, total]);

  return (
    <PhoneShell label={t("A kitchen listing going from offline to live as each onboarding step is completed")}>
        <div className="px-5 pb-6 pt-5">
          <div className="mb-4 h-14">
            <AnimatePresence mode="wait" initial={false}>
              {order ? (
                <motion.div
                  key="order"
                  initial={{ y: -16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  className="flex h-full items-center gap-3 rounded-2xl bg-ink px-4 text-paper shadow-lg"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-live text-sm font-bold">
                    ₹
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[13px] font-bold">
                      {t("New order #2841")}
                    </span>
                    <span className="block text-[12px] text-slate-light">
                      {t("Paneer thali, ₹549")}
                    </span>
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  exit={{ opacity: 0 }}
                  className="flex h-full items-center rounded-2xl border border-dashed border-line px-4 text-[13px] text-slate"
                >
                  {live ? t("Waiting for the first order") : t("No orders yet")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-[13px] font-medium text-slate">{t("Your kitchen")}</p>
          <div className="mt-1 flex items-center justify-between">
            <h3 className="font-display text-[22px] font-bold leading-tight">
              Amma&apos;s Tiffin
            </h3>
            <motion.span
              layout
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold ${
                live ? "bg-live text-white" : "bg-paper-2 text-slate"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  live ? "live-dot bg-white" : "bg-slate-light"
                }`}
                aria-hidden
              />
              {live ? t("Live") : t("Offline")}
            </motion.span>
          </div>

          <ul className="mt-5 space-y-2.5">
            {checklist.map((item, i) => {
              const ticked = i < done;
              return (
                <li
                  key={item}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[14px] transition-colors duration-300 ${
                    ticked
                      ? "border-live/30 bg-white font-semibold"
                      : "border-line bg-white/60 text-slate"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                      ticked ? "border-live bg-live" : "border-line bg-transparent"
                    }`}
                    aria-hidden
                  >
                    <motion.svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3"
                      fill="none"
                      stroke="white"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        d="M2.5 6.5l2.3 2.3L9.5 3.6"
                        initial={false}
                        animate={{ pathLength: ticked ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                      />
                    </motion.svg>
                  </span>
                  {item}
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-paper">
            <span className="text-[13px] font-medium text-slate-light">
              {live ? t("Accepting orders") : `${done} / ${total}`}
            </span>
            <span
              className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                live ? "bg-live" : "bg-ink-3"
              }`}
              aria-hidden
            >
              <motion.span
                className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white"
                animate={{ x: live ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              />
            </span>
          </div>
        </div>
    </PhoneShell>
  );
}
