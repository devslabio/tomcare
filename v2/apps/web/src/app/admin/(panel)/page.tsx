"use client";

import {
  ArrowUpRight,
  CalendarPlus,
  ExternalLink,
  FilePlus2,
  HandHeart,
  Inbox,
  LifeBuoy,
  MailCheck,
  PenLine,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { useSession } from "@/components/admin/shell";
import { caseStatus, messageStatus } from "@/components/admin/status";
import { Badge, type BadgeTone, Card, ErrorState, LoadingState } from "@/components/admin/ui";
import { canAccess, useResource, type StaffRole } from "@/lib/admin-api";
import type { Dashboard } from "@/lib/admin-types";
import { formatDate } from "@/lib/format";

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("en-CA", { hour: "numeric", hourCycle: "h23", timeZone: "America/Toronto" }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

function relativeTime(value: string) {
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days < 7 ? `${days} d ago` : formatDate(value, { day: "numeric", month: "short" });
}

const quickActions: { href: string; label: string; icon: LucideIcon; roles?: StaffRole[] }[] = [
  { href: "/admin/news/new", label: "Write a story", icon: PenLine, roles: ["EDITOR"] },
  { href: "/admin/events/new", label: "Add an event", icon: CalendarPlus, roles: ["EDITOR"] },
  { href: "/admin/pages/new", label: "Build a page", icon: FilePlus2, roles: ["EDITOR"] },
  { href: "/admin/settings", label: "Site settings", icon: Settings, roles: ["ADMIN"] },
];

const series = [
  { key: "requests", label: "Help requests", color: "bg-gold" },
  { key: "volunteers", label: "Volunteers", color: "bg-sky" },
  { key: "messages", label: "Messages", color: "bg-indigo" },
] as const;

export default function DashboardPage() {
  const { user } = useSession();
  const { data, error, reload } = useResource<Dashboard>("/dashboard");
  const firstName = user.name.split(" ")[0];
  const waiting = data ? data.inbox.requests + data.inbox.volunteers + data.inbox.messages : 0;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-7 text-white sm:px-8 sm:py-9">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-brand" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 glow-sky opacity-40" aria-hidden />
        <div className="pointer-events-none absolute -bottom-36 right-40 size-72 glow-gold opacity-30" aria-hidden />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-white/60">{formatDate(new Date(), { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className="mt-1 font-display text-2xl font-medium tracking-tight sm:text-3xl">
              {greeting()}, {firstName}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/65">
              {data
                ? waiting
                  ? `${waiting} new ${waiting === 1 ? "submission is" : "submissions are"} waiting for someone on the team.`
                  : "Nothing new in the inbox. Everyone who reached out has been seen."
                : "Here’s what’s happening on the website."}
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            className="inline-flex h-10 items-center gap-2 self-start rounded-full bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15 sm:self-auto"
          >
            View website
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!data && !error ? <LoadingState /> : null}

      {data ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <Kpi href="/admin/requests" icon={LifeBuoy} label="New help requests" value={data.inbox.requests} accent />
            <Kpi href="/admin/volunteers" icon={HandHeart} label="New volunteers" value={data.inbox.volunteers} />
            <Kpi href="/admin/messages" icon={Inbox} label="Unread messages" value={data.inbox.messages} />
            <Kpi href="/admin/subscribers" icon={MailCheck} label="Newsletter subscribers" value={data.subscribers} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <ActivityChart activity={data.activity} />
            <Card className="p-5 sm:p-6">
              <h2 className="font-semibold text-navy">Quick actions</h2>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {quickActions
                  .filter((action) => canAccess(user, action.roles))
                  .map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group flex flex-col gap-3 rounded-2xl border border-line p-4 transition hover:border-navy/20 hover:bg-sand"
                    >
                      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gold-soft text-gold-deep">
                        <action.icon className="size-4" aria-hidden />
                      </span>
                      <span className="text-sm font-semibold text-navy">{action.label}</span>
                    </Link>
                  ))}
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-5 text-sm">
                {[
                  ["Programs live", data.content.programs, "/admin/programs"],
                  ["Upcoming events", data.content.upcomingEvents, "/admin/events"],
                  ["Published stories", data.content.posts, "/admin/news"],
                  ["Published pages", data.content.pages, "/admin/pages"],
                ].map(([label, value, href]) => (
                  <Link key={label} href={String(href)} className="flex items-baseline justify-between gap-2 hover:underline">
                    <dt className="text-muted">{label}</dt>
                    <dd className="font-display text-lg text-navy">{value}</dd>
                  </Link>
                ))}
              </dl>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <RecentList
              title="Help requests"
              href="/admin/requests"
              empty="No requests yet. Submissions from the Get help form appear here."
              rows={data.recentRequests.map((r) => ({
                id: r.id,
                href: `/admin/requests/${r.id}`,
                name: r.name,
                detail: r.needs.slice(0, 2).join(" · ") || r.city || "",
                fresh: r.status === "NEW",
                status: caseStatus[r.status],
                createdAt: r.createdAt,
              }))}
            />
            <RecentList
              title="Volunteers"
              href="/admin/volunteers"
              empty="No applications yet."
              rows={data.recentVolunteers.map((v) => ({
                id: v.id,
                href: `/admin/volunteers/${v.id}`,
                name: v.name,
                detail: v.role ?? "Any role",
                fresh: v.status === "NEW",
                status: caseStatus[v.status],
                createdAt: v.createdAt,
              }))}
            />
            <RecentList
              title="Messages"
              href="/admin/messages"
              empty="No messages yet."
              rows={data.recentMessages.map((m) => ({
                id: m.id,
                href: `/admin/messages/${m.id}`,
                name: m.name,
                detail: m.subject ?? "General enquiry",
                fresh: m.status === "NEW",
                status: messageStatus[m.status],
                createdAt: m.createdAt,
              }))}
            />
          </div>

          {data.topNeeds.length ? <TopNeeds needs={data.topNeeds} /> : null}
        </>
      ) : null}
    </div>
  );
}

function Kpi({ href, icon: Icon, label, value, accent }: { href: string; icon: LucideIcon; label: string; value: number; accent?: boolean }) {
  const lit = accent && value > 0;
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border p-4 transition sm:p-5 ${
        lit ? "border-transparent bg-gold text-ink" : "border-line bg-white text-navy hover:border-navy/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`inline-flex size-9 items-center justify-center rounded-xl ${lit ? "bg-white/35" : "bg-sand text-navy"}`}>
          <Icon className="size-4" aria-hidden />
        </span>
        <ArrowUpRight className="size-4 opacity-0 transition group-hover:opacity-60" aria-hidden />
      </div>
      <p className="mt-4 font-display text-3xl font-medium tracking-tight">{value}</p>
      <p className={`mt-0.5 text-sm ${lit ? "text-ink/75" : "text-muted"}`}>{label}</p>
    </Link>
  );
}

function ActivityChart({ activity }: { activity: Dashboard["activity"] }) {
  const totals = series.map((s) => ({ ...s, total: activity.reduce((sum, day) => sum + day[s.key], 0) }));
  const max = Math.max(1, ...activity.map((day) => day.messages + day.volunteers + day.requests));
  const grand = totals.reduce((sum, s) => sum + s.total, 0);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-semibold text-navy">People reaching out, last 30 days</h2>
          <p className="mt-0.5 text-sm text-muted">Website form submissions per day, Montréal time</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {totals.map((s) => (
            <li key={s.key} className="flex items-center gap-2 text-muted">
              <span className={`size-2.5 rounded-sm ${s.color}`} aria-hidden />
              {s.label}
              <span className="font-semibold text-navy">{s.total}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex h-44 items-end gap-[3px] border-b border-line" role="img" aria-label={`${grand} submissions in the last 30 days`}>
        {activity.map((day) => {
          const sum = day.messages + day.volunteers + day.requests;
          return (
            <div key={day.date} className="group relative flex h-full flex-1 items-end">
              {sum ? (
                <div className="flex w-full flex-col-reverse overflow-hidden rounded-t-[3px] opacity-90 transition group-hover:opacity-100" style={{ height: `${Math.max(6, (sum / max) * 100)}%` }}>
                  {series.map((s) => (day[s.key] ? <div key={s.key} className={s.color} style={{ flexGrow: day[s.key] }} /> : null))}
                </div>
              ) : (
                <div className="h-[3px] w-full rounded-t-[3px] bg-line/70" />
              )}
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                {formatDate(`${day.date}T12:00:00Z`, { day: "numeric", month: "short" })} · {sum}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        <span>{activity[0] ? formatDate(`${activity[0].date}T12:00:00Z`, { day: "numeric", month: "short" }) : ""}</span>
        <span>Today</span>
      </div>
    </Card>
  );
}

function RecentList({
  title,
  href,
  empty,
  rows,
}: {
  title: string;
  href: string;
  empty: string;
  rows: { id: string; href: string; name: string; detail: string; fresh: boolean; status: { label: string; tone: BadgeTone }; createdAt: string }[];
}) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="font-semibold text-navy">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-indigo hover:underline">
          View all
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      {rows.length ? (
        <ul className="divide-y divide-line">
          {rows.map((row) => (
            <li key={row.id}>
              <Link href={row.href} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-sand/60">
                <span className={`size-2 shrink-0 rounded-full ${row.fresh ? "bg-gold" : "bg-transparent"}`} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-sm text-navy ${row.fresh ? "font-semibold" : "font-medium"}`}>{row.name}</span>
                  <span className="block truncate text-xs text-muted">{row.detail}</span>
                </span>
                {!row.fresh ? <Badge tone={row.status.tone}>{row.status.label}</Badge> : null}
                <span className="shrink-0 text-xs text-muted">{relativeTime(row.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-6 py-10 text-center text-sm text-muted">{empty}</p>
      )}
    </Card>
  );
}

function TopNeeds({ needs }: { needs: Dashboard["topNeeds"] }) {
  const max = Math.max(...needs.map((need) => need.value));
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-semibold text-navy">What people asked for help with</h2>
      <p className="mt-0.5 text-sm text-muted">Most common needs on help requests in the last 30 days</p>
      <ul className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">
        {needs.map((need) => (
          <li key={need.key}>
            <div className="flex justify-between text-sm">
              <span className="text-navy">{need.key}</span>
              <span className="font-semibold text-navy">{need.value}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand">
              <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-deep" style={{ width: `${(need.value / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
