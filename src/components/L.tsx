"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "./I18n";
import { localePath } from "@/lib/i18n";

/** next/link that keeps the visitor in their language: /pricing becomes /hi/pricing in Hindi. */
export default function L({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const h = typeof href === "string" ? localePath(locale, href) : href;
  return <NextLink href={h} {...rest} />;
}
