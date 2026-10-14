import { intlLocale, type Locale } from "./i18n/config";

const timeZone = "America/Toronto";

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
  locale: Locale = "en",
) {
  return new Intl.DateTimeFormat(intlLocale(locale), { timeZone, ...options }).format(new Date(value));
}

export function formatDateTime(value: string | Date, locale: Locale = "en") {
  return formatDate(value, { dateStyle: "medium", timeStyle: "short" }, locale);
}

export function formatTime(value: string | Date, locale: Locale = "en") {
  return formatDate(value, { hour: "numeric", minute: "2-digit" }, locale);
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Day number and short month for date badges, in Montréal time. */
export function dateParts(value: string | Date, locale: Locale = "en") {
  const date = new Date(value);
  return {
    day: formatDate(date, { day: "numeric" }, locale),
    month: formatDate(date, { month: "short" }, locale).replace(".", ""),
    weekday: formatDate(date, { weekday: "long" }, locale),
  };
}

/** "Saturday 14 November · 10:00 a.m. – 2:00 p.m." with the end date only when it differs. */
export function eventWhen(startsAt: string, endsAt: string | null, locale: Locale = "en") {
  const long = (value: string) => capitalize(formatDate(value, { weekday: "long", day: "numeric", month: "long" }, locale));
  const start = long(startsAt);
  if (!endsAt) return `${start} · ${formatTime(startsAt, locale)}`;
  const sameDay = formatDate(startsAt, undefined, locale) === formatDate(endsAt, undefined, locale);
  if (sameDay) return `${start} · ${formatTime(startsAt, locale)} – ${formatTime(endsAt, locale)}`;
  return `${start} – ${long(endsAt)}`;
}

/** "Saturday · 2:00 p.m. – 5:00 p.m." — for cards that already show the date in a badge. */
export function eventTime(startsAt: string, endsAt: string | null, locale: Locale = "en") {
  const weekday = capitalize(formatDate(startsAt, { weekday: "long" }, locale));
  const sameDay = endsAt && formatDate(startsAt, undefined, locale) === formatDate(endsAt, undefined, locale);
  if (endsAt && !sameDay) return eventWhen(startsAt, endsAt, locale);
  const end = endsAt ? ` – ${formatTime(endsAt, locale)}` : "";
  return `${weekday} · ${formatTime(startsAt, locale)}${end}`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function readingMinutes(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}
