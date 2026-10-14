import { Clock, Lock, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

import { HelpForm } from "@/components/forms/help-form";
import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { getSettings, lines } from "@/lib/cms";
import { fill } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { photos } from "@/lib/photos";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.getHelp.metaTitle, description: t.getHelp.metaDescription };
}

export default async function GetHelpPage() {
  const [{ t }, { contact }] = await Promise.all([getI18n(), getSettings()]);
  const copy = t.getHelp;

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<Highlight text={copy.title} />}
        description={copy.description}
        image={photos.mentoring}
        crumbs={[{ href: "/get-help", label: t.actions.getHelp }]}
      />

      <section className="paper section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-32">
              <ol className="space-y-6">
                {copy.steps.map((step, index) => (
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
                  {copy.confidential}
                </p>
                <p className="flex gap-3 text-ink/80">
                  <MessageCircle className="mt-0.5 size-5 shrink-0 text-indigo" aria-hidden />
                  {copy.languages}
                </p>
                <a href={`tel:${contact.phone}`} className="flex gap-3 font-semibold text-ink">
                  <Phone className="mt-0.5 size-5 shrink-0 text-indigo" aria-hidden />
                  {fill(copy.preferCall, { phone: contact.phoneDisplay })}
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
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">{copy.formTitle}</h2>
              <p className="mt-2 mb-8 text-muted">{copy.formText}</p>
              <HelpForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
