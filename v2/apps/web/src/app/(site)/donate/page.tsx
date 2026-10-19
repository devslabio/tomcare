import { Award, Car, CreditCard, Mail, Package, Shirt } from "lucide-react";
import type { Metadata } from "next";

import { DonationForm } from "@/components/forms/donation-form";
import { ItemDonationForm } from "@/components/forms/item-donation-form";
import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { getPrograms, getSettings, lines } from "@/lib/cms";
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
  const [{ t }, { donate, contact }, programs] = await Promise.all([getI18n(), getSettings(), getPrograms()]);
  const copy = t.donate;
  const days = lines(donate.dropOffDays).map((line) => line.split("·").map((part) => part.trim()));

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<Highlight text={donate.headline} />}
        description={donate.intro}
        image={photos.newHome}
        crumbs={[{ href: "/donate", label: t.actions.donate }]}
      />

      <section className="paper section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>{copy.moneyEyebrow}</Eyebrow>
            <h2 className="font-display text-h2 mt-5 text-ink">{copy.formTitle}</h2>
            <p className="text-lead mt-4 text-muted">{copy.formText}</p>
            <div id="donation-form" className="mt-8 scroll-mt-32">
              <DonationForm
                programs={programs.map((program) => ({ slug: program.slug, title: program.title }))}
                etransferEmail={donate.etransferEmail}
                donationUrl={donate.donationUrl}
              />
            </div>
            <h3 className="font-display text-title mt-16 text-ink">{copy.moneyTitle}</h3>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {copy.impact.map((item, index) => (
                <div key={item.amount} className="rounded-[24px] border border-line bg-white p-7" data-reveal style={revealDelay((index % 2) * 80)}>
                  <p className="font-display text-4xl text-indigo">{item.amount}</p>
                  <p className="mt-3 text-[15px] leading-7 text-muted">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">{copy.illustrative}</p>
          </div>

          <aside className="lg:col-span-5">
            <div className="space-y-5 lg:sticky lg:top-32">
              <div className="rounded-[28px] bg-ink p-8 text-white">
                <h2 className="font-display text-2xl">{copy.howToGive}</h2>
                <ul className="mt-6 space-y-5 text-[15px]">
                  {donate.donationUrl ? (
                    <li className="flex gap-4">
                      <CreditCard className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                      <span>
                        <span className="block font-semibold">{copy.online}</span>
                        <span className="text-white/75">{copy.onlineText}</span>
                      </span>
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
                <div className="mt-8 flex flex-col gap-3">
                  <ButtonLink href={`tel:${contact.phone}`} variant="outline-light" arrow={false}>
                    {fill(t.actions.call, { phone: contact.phoneDisplay })}
                  </ButtonLink>
                </div>
                {donate.charityNumber ? (
                  <p className="mt-6 text-sm text-white/70">{fill(copy.registration, { number: donate.charityNumber })}</p>
                ) : null}
              </div>
              <div className="flex gap-4 rounded-[28px] border border-gold/40 bg-gold-soft p-7">
                <Award className="size-8 shrink-0 text-gold-deep" aria-hidden />
                <div>
                  <p className="font-bold text-ink">{copy.certificate}</p>
                  <p className="mt-1 text-[15px] leading-7 text-ink/75">{donate.recognition}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-y bg-sand">
        <div className="container-x grid items-start gap-14 lg:grid-cols-2">
          <div className="lg:sticky lg:top-32" data-reveal>
            <Eyebrow>{copy.thingsEyebrow}</Eyebrow>
            <h2 className="font-display text-h2 mt-5 text-ink">
              <Highlight text={copy.thingsTitle} className="text-indigo not-italic" />
            </h2>
            <ul className="mt-10 space-y-6">
              {copy.items.map((item, index) => {
                const ItemIcon = itemIcons[index] ?? Package;
                return (
                  <li key={item.title} className="flex gap-5">
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo">
                      <ItemIcon className="size-6" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-lg font-bold text-ink">{item.title}</span>
                      <span className="mt-1 block text-[15px] leading-7 text-muted">{item.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            {days.length ? (
              <div className="mt-10 rounded-[24px] bg-white p-6">
                <p className="text-sm font-bold text-ink">{copy.donationDays}</p>
                <ul className="mt-3 divide-y divide-line text-[15px]">
                  {days.map(([day, time, note]) => (
                    <li key={day} className="grid gap-x-6 gap-y-0.5 py-3 sm:grid-cols-[11rem_1fr]">
                      <span className="font-semibold text-ink">
                        {day}
                        {note ? <span className="block text-sm font-normal text-muted">{note}</span> : null}
                      </span>
                      <span className="font-semibold tabular-nums text-ink/80">{time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div id="give-things" className="scroll-mt-32">
            <h3 className="font-display text-title text-ink">{copy.thingsFormTitle}</h3>
            <p className="mt-3 text-[15px] leading-7 text-muted">{copy.thingsFormText}</p>
            <div className="mt-6">
              <ItemDonationForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
