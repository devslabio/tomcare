import { Clock, Lock, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

import { HelpForm } from "@/components/forms/help-form";
import { PageHero } from "@/components/page-hero";
import { getSettings, lines } from "@/lib/cms";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Get help",
  description:
    "Newcomer, asylum seeker, senior or family in difficulty? Ask TOMCARE Foundation for free, confidential help with housing, work, paperwork and more.",
};

const steps = [
  { title: "Tell us what you need", text: "Fill in the short form, call us or drop in. A few lines is enough." },
  { title: "We call you back", text: "Usually within two working days, in the language you’re most comfortable with." },
  { title: "We make a plan together", text: "We connect you with the right program, service or partner — and follow up." },
];

export default async function GetHelpPage() {
  const { contact } = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Get help"
        title={
          <>
            You don’t have to figure it out <em className="text-gold">on your own.</em>
          </>
        }
        description="Whether you arrived last week or have been here for years, if you’re struggling with housing, work, paperwork, language or loneliness — we can help. It’s free and confidential."
        image={photos.mentoring}
        crumbs={[{ href: "/get-help", label: "Get help" }]}
      />

      <section className="paper py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-32">
              <ol className="space-y-6">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-5">
                    <span className="font-display inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo text-xl text-white">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block font-bold text-ink">{step.title}</span>
                      <span className="mt-1 block text-[15px] leading-7 text-muted">{step.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="space-y-4 rounded-[24px] bg-sand p-7 text-[15px]">
                <p className="flex gap-3 text-ink/80">
                  <Lock className="mt-0.5 size-5 shrink-0 text-indigo" aria-hidden />
                  Your information is kept confidential and only used to help you.
                </p>
                <p className="flex gap-3 text-ink/80">
                  <MessageCircle className="mt-0.5 size-5 shrink-0 text-indigo" aria-hidden />
                  We speak French and English, and our volunteers speak many other languages.
                </p>
                <a href={`tel:${contact.phone}`} className="flex gap-3 font-semibold text-ink">
                  <Phone className="mt-0.5 size-5 shrink-0 text-indigo" aria-hidden />
                  Prefer to talk? Call {contact.phoneDisplay}
                </a>
                {contact.hours ? (
                  <p className="flex gap-3 text-ink/80">
                    <Clock className="mt-0.5 size-5 shrink-0 text-indigo" aria-hidden />
                    <span>
                      {lines(contact.hours).map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </p>
                ) : null}
              </div>
            </div>
          </aside>
          <div className="lg:col-span-8">
            <div className="rounded-[32px] border border-line bg-white p-6 shadow-[0_30px_80px_-50px_rgba(11,21,55,0.4)] sm:p-10">
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">Ask for help</h2>
              <p className="mt-2 mb-8 text-muted">Takes about three minutes. Fields marked * are required.</p>
              <HelpForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
