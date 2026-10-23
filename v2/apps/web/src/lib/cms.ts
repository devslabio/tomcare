import { cache } from "react";

import type {
  Event,
  HeroSlide,
  NavPage,
  Page,
  Partner,
  Post,
  PostSummary,
  Program,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
  VolunteerRole,
} from "./cms-types";
import { getLocale } from "./i18n/server";

const apiBase = (process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3072").replace(/\/$/, "");

class NotFoundError extends Error {}

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase}/v1/public/${path}`, { cache: "no-store" });
  if (response.status === 404) throw new NotFoundError(path);
  if (!response.ok) throw new Error(`TOMCARE API ${path} responded ${response.status}`);
  return response.json() as Promise<T>;
}

async function orNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}

const slugPath = (base: string, slug: string) => `${base}/${encodeURIComponent(slug)}`;

type Translatable = { fr?: Record<string, unknown> | null };

/** On the French site, a record's filled-in French fields replace the English ones. */
function translate<T extends Translatable>(item: T, french: boolean): T {
  if (!french || !item.fr) return item;
  const filled = Object.entries(item.fr).filter(([, value]) =>
    Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim() !== "",
  );
  return { ...item, ...Object.fromEntries(filled) };
}

async function localized<T extends Translatable>(path: string): Promise<T>;
async function localized<T extends Translatable>(path: string, list: true): Promise<T[]>;
async function localized<T extends Translatable>(path: string, list?: true) {
  const [data, locale] = await Promise.all([apiGet<T | T[]>(path), getLocale()]);
  const french = locale === "fr";
  return list ? (data as T[]).map((item) => translate(item, french)) : translate(data as T, french);
}

/** Settings fields that have a French version, by their key in the `fr` settings section. */
const frenchSettings: Record<keyof SiteSettings["fr"], [Exclude<keyof SiteSettings, "fr">, string]> = {
  heroEyebrow: ["hero", "eyebrow"],
  heroTitle: ["hero", "title"],
  heroSubtitle: ["hero", "subtitle"],
  aboutHeadline: ["about", "headline"],
  aboutIntro: ["about", "intro"],
  aboutStory: ["about", "story"],
  aboutVision: ["about", "vision"],
  aboutMission: ["about", "mission"],
  aboutQuote: ["about", "quote"],
  aboutRepresentative: ["about", "representative"],
  stat1Label: ["stats", "stat1Label"],
  stat2Label: ["stats", "stat2Label"],
  stat3Label: ["stats", "stat3Label"],
  stat4Label: ["stats", "stat4Label"],
  donateHeadline: ["donate", "headline"],
  donateIntro: ["donate", "intro"],
  donateDropOffDays: ["donate", "dropOffDays"],
  donateRecognition: ["donate", "recognition"],
  contactAddress: ["contact", "address"],
  contactHours: ["contact", "hours"],
};

export const getSettings = cache(async () => {
  const [settings, locale] = await Promise.all([apiGet<SiteSettings>("settings"), getLocale()]);
  if (locale !== "fr" || !settings.fr) return settings;
  const result = structuredClone(settings);
  for (const [key, [section, field]] of Object.entries(frenchSettings)) {
    const value = settings.fr[key as keyof SiteSettings["fr"]];
    if (value?.trim()) (result[section] as Record<string, string>)[field] = value;
  }
  return result;
});
export const getPrograms = cache(() => localized<Program>("programs", true));
export const getProgram = cache((slug: string) => orNull(localized<Program>(slugPath("programs", slug))));
export const getServices = cache(() => localized<Service>("services", true));
export const getEvents = cache(async () => {
  const [events, locale] = await Promise.all([apiGet<{ upcoming: Event[]; past: Event[] }>("events"), getLocale()]);
  const french = locale === "fr";
  return {
    upcoming: events.upcoming.map((event) => translate(event, french)),
    past: events.past.map((event) => translate(event, french)),
  };
});
export const getEvent = cache((slug: string) => orNull(localized<Event>(slugPath("events", slug))));
export const getPosts = cache(() => localized<PostSummary>("posts", true));
export const getPost = cache((slug: string) => orNull(localized<Post>(slugPath("posts", slug))));
export const getNavPages = cache(() => localized<NavPage>("pages", true));
export const getPage = cache((slug: string) => orNull(localized<Page>(slugPath("pages", slug))));
export const getTeam = cache(() => localized<TeamMember>("team", true));
export const getTestimonials = cache(() => localized<Testimonial>("testimonials", true));
export const getPartners = cache(() => localized<Partner>("partners", true));
export const getHeroSlides = cache(() => localized<HeroSlide>("hero-slides", true));
export const getVolunteerRoles = cache(() => localized<VolunteerRole>("volunteer-roles", true));
/** `card` is true once Stripe is configured on the API, so the Donate form can take payment itself. */
export const getDonationOptions = cache(() => apiGet<{ card: boolean }>("donations/options").catch(() => ({ card: false })));

export function stats(settings: SiteSettings) {
  const s = settings.stats;
  return [
    { value: s.stat1Value, label: s.stat1Label },
    { value: s.stat2Value, label: s.stat2Label },
    { value: s.stat3Value, label: s.stat3Label },
    { value: s.stat4Value, label: s.stat4Label },
  ].filter((stat) => stat.value.trim());
}

export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function lines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
