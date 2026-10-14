import { CalendarX } from "lucide-react";
import type { Metadata } from "next";
import { Link } from "@/components/link";

import { EventCard } from "@/components/cards";
import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { Eyebrow } from "@/components/ui";
import { getEvents } from "@/lib/cms";
import { formatDate } from "@/lib/format";
import { getI18n } from "@/lib/i18n/server";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.events.metaTitle, description: t.events.metaDescription };
}

export default async function EventsPage() {
  const [{ locale, t }, { upcoming, past }] = await Promise.all([getI18n(), getEvents()]);
  const copy = t.events;

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<Highlight text={copy.title} />}
        description={copy.description}
        image={photos.sharedMeal}
        imagePosition="center 15%"
        crumbs={[{ href: "/events", label: t.nav.events }]}
      />

      <section className="paper section-y">
        <div className="container-x">
          <Eyebrow>{copy.upcoming}</Eyebrow>
          {upcoming.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event, index) => (
                <div key={event.id} data-reveal style={revealDelay((index % 3) * 80)}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center rounded-[28px] border border-dashed border-line bg-white px-6 py-16 text-center">
              <CalendarX className="size-10 text-muted" aria-hidden />
              <p className="font-display mt-4 text-2xl text-ink">{copy.noneTitle}</p>
              <p className="mt-2 text-muted">{copy.noneText}</p>
            </div>
          )}
        </div>
      </section>

      {past.length ? (
        <section className="section-y bg-sand">
          <div className="container-x">
            <Eyebrow>{copy.past}</Eyebrow>
            <ul className="mt-8 divide-y divide-line rounded-[28px] bg-white">
              {past.map((event) => (
                <li key={event.id}>
                  <Link href={`/events/${event.slug}`} className="flex flex-col gap-1 px-7 py-5 transition hover:bg-cream sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-semibold text-ink">{event.title}</span>
                    <span className="text-sm text-muted">
                      {formatDate(event.startsAt, undefined, locale)} · {event.location}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
