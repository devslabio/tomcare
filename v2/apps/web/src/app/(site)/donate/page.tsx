import { Award, Car, CreditCard, Mail, Package, Shirt } from "lucide-react";
import type { Metadata } from "next";

import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { getSettings, lines } from "@/lib/cms";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support newcomers and families in Montréal. Donate money, clothing, furniture or a car to TOMCARE Foundation — every donor receives a certificate of recognition.",
};

const impact = [
  { amount: "$25", text: "A bus pass so a newcomer can get to job interviews for a week." },
  { amount: "$50", text: "A full set of winter clothing for a child’s first Canadian winter." },
  { amount: "$100", text: "A month of French and computer classes for one adult." },
  { amount: "$250", text: "Kitchen essentials and bedding for a family moving into their first home." },
];

const items = [
  { icon: Shirt, title: "Clothing", text: "Clean, good-quality clothing — winter coats, boots, hats and gloves are always needed." },
  { icon: Package, title: "Household goods", text: "Kitchenware, bedding, small appliances, school supplies and toys." },
  { icon: Car, title: "Vehicles", text: "Cars, trucks and motorcycles — running or not. Contact us to arrange pick-up." },
];

export default async function DonatePage() {
  const { donate, contact } = await getSettings();
  const days = lines(donate.dropOffDays).map((line) => line.split("·").map((part) => part.trim()));

  return (
    <>
      <PageHero
        eyebrow="Donate"
        title={<Highlight text={donate.headline} />}
        description={donate.intro}
        image={photos.newHome}
        crumbs={[{ href: "/donate", label: "Donate" }]}
      />

      <section className="paper py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Give money</Eyebrow>
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-ink">What your gift makes possible</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {impact.map((item, index) => (
                <div key={item.amount} className="rounded-[24px] border border-line bg-white p-7" data-reveal style={revealDelay((index % 2) * 80)}>
                  <p className="font-display text-4xl text-indigo">{item.amount}</p>
                  <p className="mt-3 text-[15px] leading-7 text-muted">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">Examples are illustrative. Every gift, of any size, goes directly to the people we serve.</p>
          </div>

          <aside className="lg:col-span-5">
            <div className="space-y-5 lg:sticky lg:top-32">
              <div className="rounded-[28px] bg-ink p-8 text-white">
                <h2 className="font-display text-2xl">How to give</h2>
                <ul className="mt-6 space-y-5 text-[15px]">
                  {donate.donationUrl ? (
                    <li className="flex gap-4">
                      <CreditCard className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                      <span>
                        <span className="block font-semibold">Online, by card</span>
                        <span className="text-white/65">Secure one-time or monthly donations.</span>
                      </span>
                    </li>
                  ) : null}
                  {donate.etransferEmail ? (
                    <li className="flex gap-4">
                      <Mail className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                      <span>
                        <span className="block font-semibold">Interac e-Transfer</span>
                        <span className="break-all text-white/65">{donate.etransferEmail}</span>
                      </span>
                    </li>
                  ) : null}
                  <li className="flex gap-4">
                    <Package className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                    <span>
                      <span className="block font-semibold">In person, on donation days</span>
                      <span className="text-white/65">Bring items or a cheque during the hours below.</span>
                    </span>
                  </li>
                </ul>
                <div className="mt-8 flex flex-col gap-3">
                  {donate.donationUrl ? (
                    <ButtonLink href={donate.donationUrl} variant="gold">
                      Donate online
                    </ButtonLink>
                  ) : (
                    <ButtonLink href="/contact" variant="gold">
                      Contact us to give
                    </ButtonLink>
                  )}
                  <ButtonLink href={`tel:${contact.phone}`} variant="outline-light" arrow={false}>
                    Call {contact.phoneDisplay}
                  </ButtonLink>
                </div>
                {donate.charityNumber ? <p className="mt-6 text-xs text-white/50">Registration number: {donate.charityNumber}</p> : null}
              </div>
              <div className="flex gap-4 rounded-[28px] border border-gold/40 bg-gold-soft p-7">
                <Award className="size-8 shrink-0 text-gold-deep" aria-hidden />
                <div>
                  <p className="font-bold text-ink">Certificate of recognition</p>
                  <p className="mt-1 text-[15px] leading-7 text-ink/75">{donate.recognition}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-sand py-24 lg:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div data-reveal>
            <Eyebrow>Give things</Eyebrow>
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-ink">
              Your spare coat is someone’s <em className="text-indigo">first winter.</em>
            </h2>
            <ul className="mt-10 space-y-6">
              {items.map((item) => (
                <li key={item.title} className="flex gap-5">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo">
                    <item.icon className="size-6" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-ink">{item.title}</span>
                    <span className="mt-1 block text-[15px] leading-7 text-muted">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            {days.length ? (
              <div className="mt-10 rounded-[24px] bg-white p-6">
                <p className="text-sm font-bold text-ink">Donation days</p>
                <ul className="mt-3 divide-y divide-line text-[15px]">
                  {days.map(([day, time, note]) => (
                    <li key={day} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto]">
                      <span className="font-semibold text-ink">
                        {day}
                        {note ? <span className="block text-sm font-normal text-muted">{note}</span> : null}
                      </span>
                      <span className="text-muted">{time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="relative" data-reveal style={revealDelay(120)}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
              <Photo src={photos.winter} alt="A smiling woman in a warm winter coat on a snowy street" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
