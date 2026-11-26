"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { getContent } from "@/lib/i18n-content";
import { translate, type Locale } from "@/lib/i18n";
import type { PersonalSettings } from "@/lib/store";

const Ctx = createContext<Locale>("en");
const PersonalCtx = createContext<PersonalSettings | null>(null);

export function LocaleProvider({ locale, personal, children }: { locale: Locale; personal: PersonalSettings; children: React.ReactNode }) {
  return (
    <PersonalCtx.Provider value={personal}>
      <Ctx.Provider value={locale}>{children}</Ctx.Provider>
    </PersonalCtx.Provider>
  );
}

export const useLocale = () => useContext(Ctx);
export const usePersonalSettings = () => useContext(PersonalCtx);

/** The site content (copy, plans, FAQs, quiz) in the current language. */
export function useContent() {
  const locale = useLocale();
  const personal = useContext(PersonalCtx);
  return useMemo(() => {
    const content = getContent(locale);
    if (!personal) return content;
    const founderName = personal.founderName || content.founder.name;
    const steps = content.steps.map((step) =>
      step.who === "You and Anshuman" ? { ...step, who: `You and ${founderName}` } : step,
    );
    return {
      ...content,
      steps,
      site: {
        ...content.site,
        whatsappNumber: personal.whatsappNumber || content.site.whatsappNumber,
        whatsappMessage: content.site.whatsappMessage,
        email: personal.email || content.site.email,
        phoneDisplay: personal.phoneDisplay || content.site.phoneDisplay,
      },
      founder: {
        ...content.founder,
        name: personal.founderName || content.founder.name,
        role: personal.founderRole || content.founder.role,
        photo: personal.founderPhoto || content.founder.photo,
        linkedin: personal.linkedin || content.founder.linkedin,
      },
    };
  }, [locale, personal]);
}

/** Translate a UI string. The English text is the key; unknown strings stay English. */
export function useT() {
  const locale = useLocale();
  return useCallback((s: string) => translate(locale, s), [locale]);
}
