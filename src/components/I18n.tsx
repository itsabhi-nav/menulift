"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { getContent } from "@/lib/i18n-content";
import { translate, type Locale } from "@/lib/i18n";

const Ctx = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx);

/** The site content (copy, plans, FAQs, quiz) in the current language. */
export function useContent() {
  const locale = useLocale();
  return useMemo(() => getContent(locale), [locale]);
}

/** Translate a UI string. The English text is the key; unknown strings stay English. */
export function useT() {
  const locale = useLocale();
  return useCallback((s: string) => translate(locale, s), [locale]);
}
