import type { MetadataRoute } from "next";

import { getEvents, getNavPages, getPosts, getPrograms } from "@/lib/cms";
import { localizeHref } from "@/lib/i18n/config";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ["", "/about", "/programs", "/get-help", "/volunteer", "/donate", "/events", "/news", "/team", "/contact"];
  const [programs, events, posts, pages] = await Promise.all([
    getPrograms().catch(() => []),
    getEvents().catch(() => ({ upcoming: [], past: [] })),
    getPosts().catch(() => []),
    getNavPages().catch(() => []),
  ]);
  const entry = (path: string, priority: number, lastModified?: string | null) => ({
    url: `${site.url}${path}`,
    priority,
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages: { "en-CA": `${site.url}${path}`, "fr-CA": `${site.url}${localizeHref(path || "/", "fr")}` } },
  });
  return [
    ...fixed.map((path) => entry(path, path ? 0.8 : 1)),
    ...programs.map((program) => entry(`/programs/${program.slug}`, 0.7)),
    ...[...events.upcoming, ...events.past].map((event) => entry(`/events/${event.slug}`, 0.5)),
    ...posts.map((post) => entry(`/news/${post.slug}`, 0.6, post.publishedAt)),
    ...pages.map((page) => entry(`/${page.slug}`, 0.6, page.updatedAt)),
  ];
}
