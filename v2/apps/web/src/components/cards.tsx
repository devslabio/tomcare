import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";

import type { Event, PostSummary, Program } from "@/lib/cms-types";
import { dateParts, eventTime, formatDate } from "@/lib/format";
import { getI18n } from "@/lib/i18n/server";
import { Link } from "./link";
import { Photo } from "./photo";

export async function ProgramCard({ program, priority }: { program: Program; priority?: boolean }) {
  const { t } = await getI18n();
  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(11,21,55,0.35)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        {program.image ? (
          <Photo
            src={program.image}
            alt={program.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 85vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-indigo">
          {program.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-h3 leading-tight text-ink">{program.title}</h3>
        <p className="mt-2.5 flex-1 text-[15px] leading-7 text-muted">{program.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-indigo">
          {t.actions.learnMore}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export async function EventCard({ event, compact }: { event: Event; compact?: boolean }) {
  const { locale, t } = await getI18n();
  const { day, month } = dateParts(event.startsAt, locale);
  const registerHref = event.registerUrl || `/events/${event.slug}`;
  const external = /^https?:/.test(registerHref);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(11,21,55,0.35)]">
      {compact ? null : (
        <div className="relative aspect-[16/10] overflow-hidden bg-sand">
          {event.image ? (
            <Photo
              src={event.image}
              alt={event.title}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : null}
        </div>
      )}
      <div className="flex flex-1 gap-5 p-6">
        <p className="flex w-16 shrink-0 flex-col items-center self-start rounded-2xl bg-sand py-2.5 text-ink" aria-hidden>
          <span className="font-display text-[1.75rem] leading-none">{day}</span>
          <span className="mt-1 text-[13px] font-semibold capitalize text-indigo">{month}</span>
        </p>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-sm font-semibold text-indigo">{eventTime(event.startsAt, event.endsAt, locale)}</p>
          <h3 className="font-display mt-1.5 text-h3 leading-tight text-ink">
            <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0">
              {event.title}
            </Link>
          </h3>
          <p className="mt-2 flex-1 text-[15px] leading-7 text-muted">{event.summary}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-ink/75">
              <MapPin className="size-4 text-indigo" aria-hidden />
              {event.location}
            </span>
            {external ? (
              <a
                href={registerHref}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full bg-gold px-4 text-sm font-bold text-ink transition hover:bg-[#f0bb2e]"
              >
                {t.actions.register}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            ) : (
              <Link
                href={registerHref}
                className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full bg-gold px-4 text-sm font-bold text-ink transition hover:bg-[#f0bb2e]"
              >
                {t.actions.register}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export async function PostCard({ post, large }: { post: PostSummary; large?: boolean }) {
  const { locale } = await getI18n();
  return (
    <Link href={`/news/${post.slug}`} className="group flex h-full flex-col">
      <div className={`relative overflow-hidden rounded-[24px] bg-sand ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        {post.coverImage ? (
          <Photo
            src={post.coverImage}
            alt={post.title}
            fill
            sizes={large ? "(min-width: 1024px) 700px, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition duration-500 group-hover:opacity-100">
          <ArrowUpRight className="size-5" aria-hidden />
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold text-indigo">
        {post.category}
        {post.publishedAt ? <span className="font-normal text-muted"> · {formatDate(post.publishedAt, undefined, locale)}</span> : null}
      </p>
      <h3 className={`font-display mt-2 leading-tight text-ink transition group-hover:text-indigo ${large ? "text-title" : "text-h3"}`}>
        {post.title}
      </h3>
      <p className="mt-3 text-[15px] leading-7 text-muted">{post.excerpt}</p>
    </Link>
  );
}
