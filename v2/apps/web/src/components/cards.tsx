import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";

import type { Event, PostSummary, Program } from "@/lib/cms-types";
import { dateParts, eventWhen, formatDate } from "@/lib/format";
import { Icon } from "@/lib/icons";
import { Photo } from "./photo";

export function ProgramCard({ program, priority }: { program: Program; priority?: boolean }) {
  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(11,21,55,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {program.image ? (
          <Photo
            src={program.image}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" aria-hidden />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo backdrop-blur">
          {program.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7 pt-0">
        <span className="relative -mt-7 mb-4 inline-flex size-14 items-center justify-center self-end rounded-2xl bg-gold text-ink shadow-lg transition duration-500 group-hover:rotate-[-6deg]">
          <Icon name={program.icon} className="size-6" />
        </span>
        <h3 className="font-display text-[1.5rem] leading-tight text-ink">{program.title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-7 text-muted">{program.summary}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-indigo">
          Learn more
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function EventCard({ event }: { event: Event }) {
  const { day, month } = dateParts(event.startsAt);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group grid h-full overflow-hidden rounded-[28px] border border-line bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(11,21,55,0.35)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        {event.image ? (
          <Photo
            src={event.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute left-4 top-4 flex w-16 flex-col items-center rounded-2xl bg-white py-2 text-ink shadow-md">
          <span className="font-display text-2xl leading-none">{day}</span>
          <span className="mt-1 text-[11px] font-bold uppercase tracking-widest text-indigo">{month}</span>
        </span>
      </div>
      <div className="flex flex-col p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-gold-deep">{eventWhen(event.startsAt, event.endsAt)}</p>
        <h3 className="font-display mt-3 text-[1.4rem] leading-tight text-ink">{event.title}</h3>
        <p className="mt-3 line-clamp-2 text-[15px] leading-7 text-muted">{event.summary}</p>
        <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink/70">
          <MapPin className="size-4 text-indigo" aria-hidden />
          {event.location}
        </p>
      </div>
    </Link>
  );
}

export function PostCard({ post, large }: { post: PostSummary; large?: boolean }) {
  return (
    <Link href={`/news/${post.slug}`} className="group flex h-full flex-col">
      <div className={`relative overflow-hidden rounded-[24px] bg-sand ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        {post.coverImage ? (
          <Photo
            src={post.coverImage}
            alt=""
            fill
            sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition duration-500 group-hover:opacity-100">
          <ArrowUpRight className="size-5" aria-hidden />
        </span>
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-indigo">
        {post.category}
        {post.publishedAt ? <span className="font-medium text-muted"> · {formatDate(post.publishedAt)}</span> : null}
      </p>
      <h3 className={`font-display mt-2 leading-tight text-ink transition group-hover:text-indigo ${large ? "text-[2rem]" : "text-[1.4rem]"}`}>
        {post.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-muted">{post.excerpt}</p>
    </Link>
  );
}
