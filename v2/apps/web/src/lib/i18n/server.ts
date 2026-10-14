import { headers } from "next/headers";
import { cache } from "react";

import { isLocale, LOCALE_HEADER, localizeHref, PATH_HEADER, type Locale } from "./config";
import { dictionaries } from ".";

/** The language of the current request, as set by the proxy from the /fr prefix. */
export const getLocale = cache(async (): Promise<Locale> => {
  const value = (await headers()).get(LOCALE_HEADER);
  return isLocale(value) ? value : "en";
});

export async function getI18n() {
  const locale = await getLocale();
  return {
    locale,
    t: dictionaries[locale],
    href: (path: string) => localizeHref(path, locale),
  };
}

/** The current page's address in each language, for hreflang alternates. */
export async function getAlternates() {
  const [locale, path] = await Promise.all([getLocale(), headers().then((list) => list.get(PATH_HEADER) || "/")]);
  return {
    canonical: localizeHref(path, locale),
    languages: { "en-CA": localizeHref(path, "en"), "fr-CA": localizeHref(path, "fr"), "x-default": localizeHref(path, "en") },
  };
}
