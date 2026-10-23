import { Award, CalendarDays, Car, CreditCard, ExternalLink, Mail, Package, Shirt } from "lucide-react";
import type { Metadata } from "next";

import { DonationForm } from "@/components/forms/donation-form";
import { ItemDonationForm } from "@/components/forms/item-donation-form";
import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { getDonationOptions, getPrograms, getSettings, lines } from "@/lib/cms";
import { fill } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.donate.metaTitle, description: t.donate.metaDescription };
}

const itemIcons = [Shirt, Package, Car];

export default async function DonatePage() {
  const [{ t }, { donate, contact }, programs, options] = await Promise.all([getI18n(), getSettings(), getPrograms(), getDonationOptions()]);
  const copy = t.donate;
  const days = lines(donate.dropOffDays).map((line) => line.split("·").map((part) => part.trim()));

  return (
    <>
      <PageHero
        compact
        eyebrow={copy.eyebrow}
        title={<Highlight text={donate.headline} />}
        description={donate.intro}
        image={photos.newHome}
        crumbs={[{ href: "/donate", label: t.actions.donate }]}
      />

      {/* The two forms share rows, so their headings and their forms line up side by side. */}
      <section className="paper section-y">
        <div className="container-x grid gap-x-8 gap-y-14 lg:grid-cols-2 lg:grid-rows-[auto_1fr] xl:gap-x-10">
          <div id="donation-form" className="grid scroll-mt-32 content-start gap-6 lg:row-span-2 lg:grid-rows-subgrid">
            <div>
              <Eyebrow>{copy.moneyEyebrow}</Eyebrow>
              <h2 className="font-display text-title mt-4 text-ink">{copy.formTitle}</h2>
              <p className="mt-3 text-[15px] leading-7 text-muted">{copy.formText}</p>
            </div>
            <DonationForm programs={programs.map((program) => ({ slug: program.slug, title: program.title }))} card={options.card} />
          </div>
          <div id="give-things" className="grid scroll-mt-32 content-start gap-6 lg:row-span-2 lg:grid-rows-subgrid">
            <div>
              <Eyebrow>{copy.thingsEyebrow}</Eyebrow>
              <h2 className="font-display text-title mt-4 text-ink">{copy.thingsFormTitle}</h2>
              <p className="mt-3 text-[15px] leading-7 text-muted">{copy.thingsFormText}</p>
            </div>
            <div>
              <ItemDonationForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-sand">
        <div className="container-x">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="flex flex-col rounded-[28px] bg-ink p-7 text-white sm:p-8" data-reveal>
              <h2 className="font-display text-2xl">{copy.howToGive}</h2>
              <ul className="mt-6 space-y-5 text-[15px]">
                {options.card ? (
                  <li className="flex gap-4">
                    <CreditCard className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                    <span>
                      <span className="block font-semibold">{copy.online}</span>
                      <span className="text-white/75">{copy.onlineText}</span>
                    </span>
                  </li>
                ) : donate.donationUrl ? (
                  <li className="flex gap-4">
                    <ExternalLink className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                    <a href={donate.donationUrl} target="_blank" rel="noopener" className="group">
                      <span className="block font-semibold group-hover:underline">{copy.onlineLink}</span>
                      <span className="text-white/75">{copy.onlineLinkText}</span>
                    </a>
                  </li>
                ) : null}
                {donate.etransferEmail ? (
                  <li className="flex gap-4">
                    <Mail className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                    <span>
                      <span className="block font-semibold">{copy.etransfer}</span>
                      <span className="break-all text-white/75">{donate.etransferEmail}</span>
                    </span>
                  </li>
                ) : null}
                <li className="flex gap-4">
                  <Package className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                  <span>
                    <span className="block font-semibold">{copy.inPerson}</span>
                    <span className="text-white/75">{copy.inPersonText}</span>
                  </span>
                </li>
              </ul>
              <div className="mt-auto pt-8">
                <ButtonLink href={`tel:${contact.phone}`} variant="outline-light" arrow={false} className="w-full">
                  {fill(t.actions.call, { phone: contact.phoneDisplay })}
                </ButtonLink>
                {donate.charityNumber ? (
                  <p className="mt-5 text-sm text-white/70">{fill(copy.registration, { number: donate.charityNumber })}</p>
                ) : null}
              </div>
            </div>

            {days.length ? (
              <div className="rounded-[28px] bg-white p-7 sm:p-8" data-reveal style={revealDelay(80)}>
                <h2 className="flex items-center gap-2.5 font-display text-2xl text-ink">
                  <CalendarDays className="size-6 text-indigo" aria-hidden />
                  {copy.donationDays}
                </h2>
                <ul className="mt-4 divide-y divide-line text-[15px]">
                  {days.map(([day, time, note]) => (
                    <li key={day} className="py-3.5">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <span className="font-semibold text-ink">{day}</span>
                        <span className="font-semibold tabular-nums text-ink/80">{time}</span>
                      </span>
                      {note ? <span className="mt-0.5 block text-sm text-muted">{note}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-[28px] bg-white p-7 sm:p-8" data-reveal style={revealDelay(160)}>
              <h2 className="font-display text-2xl text-ink">{copy.acceptTitle}</h2>
              <ul className="mt-6 space-y-5">
                {copy.items.map((item, index) => {
                  const ItemIcon = itemIcons[index] ?? Package;
                  return (
                    <li key={item.title} className="flex gap-4">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo/[0.07] text-indigo">
                        <ItemIcon className="size-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block font-bold text-ink">{item.title}</span>
                        <span className="mt-0.5 block text-[15px] leading-6 text-muted">{item.text}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex gap-4 rounded-[28px] border border-gold/40 bg-gold-soft p-7" data-reveal>
            <Award className="size-8 shrink-0 text-gold-deep" aria-hidden />
            <div>
              <p className="font-bold text-ink">{copy.certificate}</p>
              <p className="mt-1 text-[15px] leading-7 text-ink/75">{donate.recognition}</p>
            </div>
          </div>

          <h2 className="font-display text-title mt-16 text-ink">{copy.moneyTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.impact.map((item, index) => (
              <div key={item.amount} className="rounded-[24px] border border-line bg-white p-7" data-reveal style={revealDelay(index * 80)}>
                <p className="font-display text-4xl text-indigo">{item.amount}</p>
                <p className="mt-3 text-[15px] leading-7 text-muted">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">{copy.illustrative}</p>
        </div>
      </section>
    </>
  );
}
