import { CalendarDays, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/markdown";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui";
import { getEvent, getSettings } from "@/lib/cms";
import { eventWhen } from "@/lib/format";
import { fill } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  if (!event) return {};
  return { title: event.title, description: event.summary };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const [{ locale, t }, event, settings] = await Promise.all([getI18n(), getEvent(slug), getSettings()]);
  const copy = t.events;
  if (!event) notFound();
  const isPast = new Date(event.endsAt ?? event.startsAt) < new Date();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.startsAt,
    ...(event.endsAt ? { endDate: event.endsAt } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: event.location, address: event.location },
    ...(event.image ? { image: [event.image] } : {}),
    organizer: { "@type": "NGO", name: site.name, url: site.url },
  };

  return (
    <>
      <PageHero
        eyebrow={isPast ? copy.pastEvent : copy.event}
        title={event.title}
        description={event.summary}
        image={event.image}
        crumbs={[
          { href: "/events", label: t.nav.events },
          { href: `/events/${event.slug}`, label: event.title },
        ]}
      >
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-white/85">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-5 text-gold" aria-hidden />
            {eventWhen(event.startsAt, event.endsAt, locale)}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-5 text-gold" aria-hidden />
            {event.location}
          </span>
        </div>
      </PageHero>

      <section className="paper section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <article className="lg:col-span-7">
            <Markdown source={event.body || event.summary} className="text-lead" />
          </article>
          <aside className="lg:col-span-5">
            <div className="rounded-[28px] bg-ink p-8 text-white lg:sticky lg:top-32">
              <h2 className="font-display text-2xl">{isPast ? copy.endedTitle : copy.joinTitle}</h2>
              <p className="mt-3 text-[15px] leading-7 text-white/75">{isPast ? copy.endedText : copy.joinText}</p>
              <div className="mt-6 flex flex-col gap-3">
                {!isPast && event.registerUrl ? (
                  <ButtonLink href={event.registerUrl} variant="gold">
                    {t.actions.register}
                  </ButtonLink>
                ) : null}
                <ButtonLink href={isPast ? "/events" : "/contact"} variant={isPast || event.registerUrl ? "outline-light" : "gold"}>
                  {isPast ? copy.upcomingEvents : event.registerUrl ? t.home.askQuestion : t.actions.register}
                </ButtonLink>
                {!isPast ? (
                  <ButtonLink href={`tel:${settings.contact.phone}`} variant="outline-light" arrow={false}>
                    {fill(t.actions.call, { phone: settings.contact.phoneDisplay })}
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
