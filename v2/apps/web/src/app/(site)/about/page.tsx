import { Compass, Eye, Target } from "lucide-react";
import type { Metadata } from "next";

import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { Avatar, ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import { getSettings, getTeam, paragraphs, stats } from "@/lib/cms";
import { fill } from "@/lib/i18n";
import { quoteMarks } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.about.metaTitle, description: t.about.metaDescription };
}

export default async function AboutPage() {
  const [{ locale, t }, settings, team] = await Promise.all([getI18n(), getSettings(), getTeam()]);
  const [open, close] = quoteMarks(locale);
  const copy = t.about;
  const { about } = settings;
  const figures = stats(settings);
  const leaders = team.filter((member) => member.group === "BOARD").slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<Highlight text={about.headline} />}
        description={about.intro}
        image={photos.familyOutdoors}
        crumbs={[{ href: "/about", label: t.nav.about }]}
      />

      <section className="paper section-y">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-sand">
              <Photo src={photos.dinner} alt={copy.mealAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7 lg:pl-6" data-reveal style={revealDelay(120)}>
            <Eyebrow>{copy.storyEyebrow}</Eyebrow>
            <h2 className="font-display text-h2 mt-5 text-balance text-ink">{copy.storyTitle}</h2>
            <div className="text-lead mt-7 space-y-5 text-ink/80">
              {paragraphs(about.story).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {figures.length ? (
              <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-10 sm:grid-cols-4">
                {figures.map((figure) => (
                  <div key={figure.label}>
                    <dt className="sr-only">{figure.label}</dt>
                    <dd className="font-display text-4xl text-indigo">{figure.value}</dd>
                    <dd className="mt-2 text-sm leading-5 text-muted">{figure.label}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-y bg-ink text-white">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { icon: Eye, title: copy.vision, text: about.vision },
              { icon: Target, title: copy.mission, text: about.mission },
              { icon: Compass, title: copy.guides, text: `${open}${about.quote}${close}${about.quoteAuthor ? ` — ${about.quoteAuthor}` : ""}` },
            ].map((item, index) => (
              <article key={item.title} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 lg:p-10" data-reveal style={revealDelay(index * 90)}>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gold text-ink">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <h2 className="font-display mt-6 text-2xl">{item.title}</h2>
                <p className={`mt-4 leading-8 text-white/75 ${index === 2 ? "font-display text-xl italic text-white" : "text-[17px]"}`}>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="paper section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <SectionHeading
              eyebrow={copy.objectivesEyebrow}
              title={<Highlight text={copy.objectivesTitle} className="text-indigo not-italic" />}
            />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {copy.objectives.map((objective, index) => (
              <li key={objective.title} className="rounded-[24px] border border-line bg-white p-6" data-reveal style={revealDelay((index % 2) * 80)}>
                <span className="font-display text-3xl text-gold">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-bold text-ink">{objective.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-muted">{objective.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y bg-sand">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div data-reveal>
            <Eyebrow>{copy.leadershipEyebrow}</Eyebrow>
            <h2 className="font-display text-h2 mt-5 text-ink">{copy.leadershipTitle}</h2>
            <p className="text-lead mt-5 text-muted">
              {fill(copy.leadershipText, { name: about.representative ? `, ${about.representative.split(",")[0]}` : "" })}
            </p>
            <ButtonLink href="/team" className="mt-8">
              {t.actions.meetTeam}
            </ButtonLink>
          </div>
          <div className="grid gap-4" data-reveal style={revealDelay(120)}>
            {leaders.map((member) => (
              <div key={member.id} className="flex items-center gap-5 rounded-[24px] bg-white p-6">
                <Avatar name={member.name} photo={member.photo} className="size-16 text-xl" />
                <div>
                  <p className="text-lg font-bold text-ink">{member.name}</p>
                  <p className="text-sm text-muted">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
