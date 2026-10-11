import { Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";

import { VolunteerForm } from "@/components/forms/volunteer-form";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { Eyebrow } from "@/components/ui";
import { getVolunteerRoles } from "@/lib/cms";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Volunteer with TOMCARE Foundation in Montréal: mentor newcomers, teach French or computer skills, help at donation days and community events.",
};

const reasons = [
  { value: "No experience needed", text: "We provide orientation, training and support from day one." },
  { value: "Flexible hours", text: "A few hours a month or a weekly shift — you choose what fits." },
  { value: "Real impact", text: "You’ll see the difference you make, often in someone’s very first weeks." },
];

export default async function VolunteerPage() {
  const roles = await getVolunteerRoles();

  return (
    <>
      <PageHero
        eyebrow="Volunteer"
        title={
          <>
            Your time could be someone’s <em className="text-gold">turning point.</em>
          </>
        }
        description="Many of our volunteers arrived in Canada not long ago themselves. They know how much a friendly face, a translated letter or a lift to an appointment can mean."
        image={photos.volunteer}
        crumbs={[{ href: "/volunteer", label: "Volunteer" }]}
      />

      <section className="paper py-20 lg:py-24">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {reasons.map((reason, index) => (
            <div key={reason.value} className="rounded-[24px] border border-line bg-white p-8" data-reveal style={revealDelay(index * 80)}>
              <p className="font-display text-2xl text-indigo">{reason.value}</p>
              <p className="mt-3 text-[15px] leading-7 text-muted">{reason.text}</p>
            </div>
          ))}
        </div>
      </section>

      {roles.length ? (
        <section className="bg-sand py-24 lg:py-28">
          <div className="container-x">
            <div className="max-w-2xl" data-reveal>
              <Eyebrow>Open roles</Eyebrow>
              <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-ink">Where we need you most</h2>
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

      <section id="apply" className="paper py-24 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-sand">
              <Photo src={photos.teamMeeting} alt="Volunteers planning together" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>Apply</Eyebrow>
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-ink">Tell us a little about yourself</h2>
            <p className="mt-4 mb-10 text-[17px] leading-8 text-muted">
              We’ll get in touch to talk about your interests and invite you to an orientation session.
            </p>
            <VolunteerForm roles={roles.map((role) => role.title)} />
          </div>
        </div>
      </section>
    </>
  );
}
