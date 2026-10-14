import { Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";

import { VolunteerForm } from "@/components/forms/volunteer-form";
import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { Eyebrow } from "@/components/ui";
import { getVolunteerRoles } from "@/lib/cms";
import { getI18n } from "@/lib/i18n/server";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.volunteer.metaTitle, description: t.volunteer.metaDescription };
}

export default async function VolunteerPage() {
  const [{ t }, roles] = await Promise.all([getI18n(), getVolunteerRoles()]);
  const copy = t.volunteer;

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<Highlight text={copy.title} />}
        description={copy.description}
        image={photos.volunteer}
        crumbs={[{ href: "/volunteer", label: t.nav.volunteer }]}
      />

      <section className="paper section-y">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {copy.reasons.map((reason, index) => (
            <div key={reason.value} className="rounded-[24px] border border-line bg-white p-8" data-reveal style={revealDelay(index * 80)}>
              <p className="font-display text-2xl text-indigo">{reason.value}</p>
              <p className="mt-3 text-[15px] leading-7 text-muted">{reason.text}</p>
            </div>
          ))}
        </div>
      </section>

      {roles.length ? (
        <section className="section-y bg-sand">
          <div className="container-x">
            <div className="max-w-2xl" data-reveal>
              <Eyebrow>{copy.rolesEyebrow}</Eyebrow>
              <h2 className="font-display text-h2 mt-5 text-ink">{copy.rolesTitle}</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {roles.map((role, index) => (
                <article key={role.id} className="flex flex-col rounded-[28px] bg-white p-8" data-reveal style={revealDelay((index % 2) * 80)}>
                  <h3 className="font-display text-2xl text-ink">{role.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-7 text-muted">{role.description}</p>
                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/75">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4 text-indigo" aria-hidden />
                      {role.commitment}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 text-indigo" aria-hidden />
                      {role.location}
                    </span>
                  </div>
                  {role.skills.length ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {role.skills.map((skill) => (
                        <li key={skill} className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-ink/80">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="apply" className="paper section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-sand">
              <Photo src={photos.teamMeeting} alt={copy.photoAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>{copy.applyEyebrow}</Eyebrow>
            <h2 className="font-display text-h2 mt-5 text-ink">{copy.applyTitle}</h2>
            <p className="text-lead mt-4 mb-10 text-muted">{copy.applyText}</p>
            <VolunteerForm roles={roles.map((role) => role.title)} />
          </div>
        </div>
      </section>
    </>
  );
}
