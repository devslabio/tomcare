export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Request header the proxy sets so server components know which language was asked for. */
export const LOCALE_HEADER = "x-tomcare-locale";
/** The requested path without its language prefix, for language links and alternates. */
export const PATH_HEADER = "x-tomcare-path";

export const isLocale = (value: string | null | undefined): value is Locale =>
  locales.includes(value as Locale);

/** Intl locale for dates and numbers. */
export const intlLocale = (locale: Locale) => (locale === "fr" ? "fr-CA" : "en-CA");

/** Opening and closing quotation marks: « guillemets » in French, “curly quotes” in English. */
export const quoteMarks = (locale: Locale): [string, string] =>
  locale === "fr" ? ["«\u00a0", "\u00a0»"] : ["“", "”"];

/** Paths that are never translated: the admin portal, the API and files. */
const untranslated = /^\/(admin|v1|_next|uploads)(\/|$)|\.[a-z0-9]+$/i;

/** "/fr/programs" → "/programs"; English paths are returned unchanged. */
export function stripLocale(pathname: string) {
  if (pathname === "/fr") return "/";
  return pathname.startsWith("/fr/") ? pathname.slice(3) : pathname;
}

/** Points an internal link at the given language; external links, anchors and admin paths pass through. */
export function localizeHref(href: string, locale: Locale) {
  if (!href.startsWith("/") || href.startsWith("//") || untranslated.test(href.split(/[?#]/)[0])) return href;
  const path = stripLocale(href);
  if (locale === defaultLocale) return path;
  return path === "/" ? "/fr" : path.startsWith("/?") || path.startsWith("/#") ? `/fr${path.slice(1)}` : `/fr${path}`;
}
