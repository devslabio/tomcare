"use client";

import { createContext, useContext } from "react";

import { localizeHref, type Locale } from "@/lib/i18n/config";
import { dictionaries } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("en");

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const locale = useContext(LocaleContext);
  return { locale, t: dictionaries[locale], href: (path: string) => localizeHref(path, locale) };
}
