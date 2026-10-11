const timeZone = "America/Toronto";

export function formatDate(value: string | Date, options: Intl.DateTimeFormatOptions = { dateStyle: "long" }) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, ...options }).format(new Date(value));
}

export function formatDateTime(value: string | Date) {
  return formatDate(value, { dateStyle: "medium", timeStyle: "short" });
}

export function formatTime(value: string | Date) {
  return formatDate(value, { hour: "numeric", minute: "2-digit" });
}

/** Day number and short month for date badges, in Montréal time. */
export function dateParts(value: string | Date) {
  const date = new Date(value);
  return {
    day: formatDate(date, { day: "numeric" }),
    month: formatDate(date, { month: "short" }).replace(".", ""),
    weekday: formatDate(date, { weekday: "long" }),
  };
}

/** "Saturday 14 November · 10:00 a.m. – 2:00 p.m." with the end date only when it differs. */
export function eventWhen(startsAt: string, endsAt: string | null) {
  const start = formatDate(startsAt, { weekday: "long", day: "numeric", month: "long" });
  if (!endsAt) return `${start} · ${formatTime(startsAt)}`;
  const sameDay = formatDate(startsAt) === formatDate(endsAt);
  if (sameDay) return `${start} · ${formatTime(startsAt)} – ${formatTime(endsAt)}`;
  return `${start} – ${formatDate(endsAt, { weekday: "long", day: "numeric", month: "long" })}`;
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
