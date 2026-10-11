import { CalendarX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EventCard } from "@/components/cards";
import { PageHero } from "@/components/page-hero";
import { Eyebrow } from "@/components/ui";
import { getEvents } from "@/lib/cms";
import { formatDate } from "@/lib/format";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export const metadata: Metadata = {
  title: "Events",
  description: "Community meals, workshops, donation drives and celebrations hosted by TOMCARE Foundation in Montréal.",
};

export default async function EventsPage() {
  const { upcoming, past } = await getEvents();

  return (
    <>
      <PageHero
        eyebrow="Events"
        title={
          <>
            Where the community <em className="text-gold">comes together.</em>
          </>
        }
        description="Workshops, shared meals, donation drives and celebrations. Everyone is welcome — newcomers, neighbours, volunteers and friends."
        image={photos.sharedMeal}
        imagePosition="center 15%"
        crumbs={[{ href: "/events", label: "Events" }]}
      />

      <section className="paper py-20 lg:py-28">
        <div className="container-x">
          <Eyebrow>Upcoming</Eyebrow>
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
              <p className="font-display mt-4 text-2xl text-ink">No events scheduled right now</p>
              <p className="mt-2 text-muted">Subscribe to our newsletter below to hear about the next one.</p>
            </div>
          )}
        </div>
      </section>

      {past.length ? (
        <section className="bg-sand py-20 lg:py-24">
          <div className="container-x">
            <Eyebrow>Past events</Eyebrow>
            <ul className="mt-8 divide-y divide-line rounded-[28px] bg-white">
              {past.map((event) => (
                <li key={event.id}>
                  <Link href={`/events/${event.slug}`} className="flex flex-col gap-1 px-7 py-5 transition hover:bg-cream sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-semibold text-ink">{event.title}</span>
                    <span className="text-sm text-muted">
                      {formatDate(event.startsAt)} · {event.location}
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
