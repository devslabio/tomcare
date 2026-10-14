import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { getSettings, lines } from "@/lib/cms";
import { getI18n } from "@/lib/i18n/server";
import { photos } from "@/lib/photos";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.contact.metaTitle, description: t.contact.metaDescription };
}

export default async function ContactPage() {
  const [{ t }, { contact }] = await Promise.all([getI18n(), getSettings()]);
  const copy = t.contact;
  const mapSrc = contact.mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`
    : null;

  const cards = [
    { icon: Phone, label: copy.callUs, value: contact.phoneDisplay, href: `tel:${contact.phone}` },
    { icon: Mail, label: copy.email, value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: copy.where, value: contact.address },
  ];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<Highlight text={copy.title} />}
        description={copy.description}
        image={photos.familyHome}
        imagePosition="center 20%"
        compact
        crumbs={[{ href: "/contact", label: t.nav.contact }]}
      />

      <section className="paper section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            {cards.map((card) => {
              const body = (
                <>
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo/[0.07] text-indigo">
                    <card.icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-muted">{card.label}</span>
                    <span className="block break-words text-lg font-bold text-ink">{card.value}</span>
                  </span>
                </>
              );
              return card.href ? (
                <a key={card.label} href={card.href} className="flex items-center gap-5 rounded-[24px] border border-line bg-white p-6 transition hover:border-indigo/40">
                  {body}
                </a>
              ) : (
                <div key={card.label} className="flex items-center gap-5 rounded-[24px] border border-line bg-white p-6">
                  {body}
                </div>
              );
            })}
            {contact.hours ? (
              <div className="rounded-[24px] bg-ink p-7 text-white">
                <p className="flex items-center gap-2 font-bold">
                  <Clock className="size-5 text-gold" aria-hidden />
                  {copy.hours}
                </p>
                <ul className="mt-4 divide-y divide-white/10">
                  {lines(contact.hours).map((line) => {
                    const match = line.match(/^(\S+)\s+(.*)$/);
                    return (
                      <li key={line} className="flex justify-between gap-4 py-2.5 text-[15px]">
                        <span className="text-white/75">{match?.[1] ?? line}</span>
                        <span className="font-semibold">{match?.[2] ?? ""}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-[32px] border border-line bg-white p-6 shadow-[0_30px_80px_-50px_rgba(11,21,55,0.4)] sm:p-10">
              <h2 className="font-display text-title text-ink">{copy.formTitle}</h2>
              <p className="mt-2 mb-8 text-muted">{copy.formText}</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {mapSrc ? (
        <section className="px-3 pb-3 sm:px-5 sm:pb-5">
          <iframe
            title={copy.map}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[420px] w-full rounded-[32px] border-0 grayscale-[30%]"
          />
        </section>
      ) : null}
    </>
  );
}
