import { cache } from "react";

import type {
  Event,
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

export const getSettings = cache(() => apiGet<SiteSettings>("settings"));
export const getPrograms = cache(() => apiGet<Program[]>("programs"));
export const getProgram = cache((slug: string) => orNull(apiGet<Program>(slugPath("programs", slug))));
export const getServices = cache(() => apiGet<Service[]>("services"));
export const getEvents = cache(() => apiGet<{ upcoming: Event[]; past: Event[] }>("events"));
export const getEvent = cache((slug: string) => orNull(apiGet<Event>(slugPath("events", slug))));
export const getPosts = cache(() => apiGet<PostSummary[]>("posts"));
export const getPost = cache((slug: string) => orNull(apiGet<Post>(slugPath("posts", slug))));
export const getNavPages = cache(() => apiGet<NavPage[]>("pages"));
export const getPage = cache((slug: string) => orNull(apiGet<Page>(slugPath("pages", slug))));
export const getTeam = cache(() => apiGet<TeamMember[]>("team"));
export const getTestimonials = cache(() => apiGet<Testimonial[]>("testimonials"));
export const getPartners = cache(() => apiGet<Partner[]>("partners"));
export const getVolunteerRoles = cache(() => apiGet<VolunteerRole[]>("volunteer-roles"));

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
