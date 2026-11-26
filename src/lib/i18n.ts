import { hiUI } from "./hi-ui";

export const locales = ["en", "hi"] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

/** English has no prefix (/pricing); Hindi lives under /hi (/hi/pricing). */
export function localePath(locale: Locale, path: string) {
  if (locale === "en" || !path.startsWith("/")) return path;
  if (path === "/") return "/hi";
  return `/hi${path}`;
}

export function stripLocale(pathname: string) {
  const m = pathname.match(/^\/(en|hi)(\/.*)?$/);
  return m ? m[2] || "/" : pathname;
}

/** Translate a UI string (English text is the key). Falls back to English. */
export function translate(locale: Locale, s: string) {
  return locale === "hi" ? (hiUI[s] ?? s) : s;
}
