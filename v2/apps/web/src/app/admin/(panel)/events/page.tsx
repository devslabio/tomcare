"use client";

import { CalendarDays, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useToast } from "@/components/admin/toast";
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { Event } from "@/lib/admin-types";
import { dateParts, eventWhen } from "@/lib/format";

export default function EventsAdminPage() {
  const toast = useToast();
  const { data, error, reload } = useResource<Event[]>("/events");

  async function remove(event: Event) {
    if (!window.confirm(`Delete “${event.title}”?`)) return;
    try {
      await api(`/events/${event.id}`, { method: "DELETE" });
      toast("Event deleted");
      reload();
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  const [now] = useState(() => Date.now());
  const upcoming = data?.filter((event) => Date.parse(event.endsAt ?? event.startsAt) >= now).reverse() ?? [];
  const past = data?.filter((event) => Date.parse(event.endsAt ?? event.startsAt) < now) ?? [];

  const newButton = (
    <Link
      href="/admin/events/new"
      className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-soft"
    >
      <Plus className="size-4" aria-hidden />
      New event
    </Link>
  );

  const list = (events: Event[], muted = false) => (
    <Card>
      <ul className="divide-y divide-line">
        {events.map((event) => {
          const day = dateParts(event.startsAt);
          return (
            <li key={event.id} className={`flex items-center gap-4 px-4 py-3 sm:px-5 ${muted ? "opacity-75" : ""}`}>
              <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-sand text-navy">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{day.month}</span>
                <span className="font-display text-xl leading-none">{day.day}</span>
              </div>
              <Link href={`/admin/events/${event.id}`} className="min-w-0 flex-1">
                <p className="truncate font-semibold text-navy hover:underline">{event.title}</p>
                <p className="truncate text-sm text-muted">
                  {eventWhen(event.startsAt, event.endsAt)} · {event.location}
                </p>
              </Link>
              {!event.visible ? <Badge>Hidden</Badge> : null}
              <div className="flex">
                {event.visible ? (
                  <a
                    href={`/events/${event.slug}`}
                    target="_blank"
                    className="hidden size-9 items-center justify-center rounded-full text-navy hover:bg-sand sm:inline-flex"
                    aria-label="View on website"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                ) : null}
                <Link
                  href={`/admin/events/${event.id}`}
                  className="inline-flex size-9 items-center justify-center rounded-full text-navy hover:bg-sand"
                  aria-label={`Edit ${event.title}`}
                >
                  <Pencil className="size-4" />
                </Link>
                <Button variant="ghost" size="sm" onClick={() => remove(event)} aria-label={`Delete ${event.title}`}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Events" description="Workshops, drives and gatherings. Times are in Montréal time." actions={newButton} />
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!data && !error ? <LoadingState /> : null}
      {data && !data.length ? (
        <Card>
          <EmptyState icon={CalendarDays} title="No events yet" action={newButton} />
        </Card>
      ) : null}
      {upcoming.length ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Upcoming · {upcoming.length}</h2>
          {list(upcoming)}
        </section>
      ) : null}
      {past.length ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Past · {past.length}</h2>
          {list(past, true)}
        </section>
      ) : null}
    </div>
  );
}
