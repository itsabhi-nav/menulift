import * as base from "./content";
import { hiContent } from "./hi-content";
import type { Locale } from "./i18n";

const english = {
  site: base.site,
  scarcity: base.scarcity,
  hero: base.hero,
  stats: base.stats,
  checklist: base.checklist,
  marquee: base.marquee,
  audiences: base.audiences,
  problems: base.problems,
  steps: base.steps,
  compare: base.compare,
  stories: base.stories,
  videoUrl: base.videoUrl,
  guaranteeDays: base.guaranteeDays,
  offers: base.offers,
  founder: base.founder,
  testimonials: base.testimonials,
  faqs: base.faqs,
  quiz: base.quiz,
};

export type Content = typeof english;

export function getContent(locale: Locale): Content {
  if (locale === "en") return english;
  const h = hiContent;
  return {
    ...english,
    ...h,
    site: { ...english.site, ...h.site },
    scarcity: { ...english.scarcity, ...h.scarcity },
    hero: { ...english.hero, ...h.hero },
    founder: { ...english.founder, ...h.founder },
  } as Content;
}
