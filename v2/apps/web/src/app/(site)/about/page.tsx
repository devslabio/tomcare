import { Compass, Eye, Target } from "lucide-react";
import type { Metadata } from "next";

import { Highlight, stripStars } from "@/components/highlight";
import { HandMark } from "@/components/logo";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { Avatar, ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import { getSettings, getTeam, paragraphs, stats } from "@/lib/cms";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export const metadata: Metadata = {
  title: "About us",
  description:
    "TOMCARE Foundation was founded in Montréal in 2024 to help newcomers settle in Quebec and to support people living with disabilities or in poverty.",
};

const objectives = [
  {
    title: "Well-being of asylum seekers",
    text: "Access to a support network, services and programs tailored to the needs of new arrivals.",
  },
  {
    title: "Intercultural activities",
    text: "Bringing together newcomers, other cultural communities and socio-economic actors to work side by side.",
  },
  { title: "Integration of newcomers", text: "Helping people who arrive in Canada settle in and become part of their new community." },
  { title: "Accommodation support", text: "Helping newcomers and families find safe, affordable housing." },
  {
    title: "Training and guidance",
    text: "Basic training and advice on settling in Canada, including transport support during the first two months.",
  },
  {
    title: "Easy access to information",
    text: "On-site and online sessions, and capacity-building workshops in different fields.",
  },
];

export default async function AboutPage() {
  const [settings, team] = await Promise.all([getSettings(), getTeam()]);
  const { about } = settings;
  const figures = stats(settings);
  const leaders = team.filter((member) => member.group === "BOARD").slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={<Highlight text={about.headline} />}
        description={about.intro}
        image={photos.familyOutdoors}
        crumbs={[{ href: "/about", label: "About" }]}
      />

      <section className="paper py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-sand">
              <Photo src={photos.dinner} alt="Newcomers sharing a community meal" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7 lg:pl-6" data-reveal style={revealDelay(120)}>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="font-display mt-5 text-balance text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-ink">
              Started by people who know what the first months feel like.
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-8 text-ink/75">
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

      <section className="bg-ink py-24 text-white lg:py-32">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { icon: Eye, title: "Our vision", text: about.vision },
              { icon: Target, title: "Our mission", text: about.mission },
              { icon: Compass, title: "What guides us", text: `“${about.quote}”` },
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

      <section className="paper py-24 lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <SectionHeading
              eyebrow="Our objectives"
              title={
                <>
                  Six commitments we hold ourselves to <em className="text-indigo">every day.</em>
                </>
              }
            />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {objectives.map((objective, index) => (
              <li key={objective.title} className="rounded-[24px] border border-line bg-white p-6" data-reveal style={revealDelay((index % 2) * 80)}>
                <span className="font-display text-3xl text-gold">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-bold text-ink">{objective.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-muted">{objective.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-sand py-24 lg:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div data-reveal>
            <Eyebrow>Leadership</Eyebrow>
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-ink">The people accountable for our work</h2>
            <p className="mt-5 text-[17px] leading-8 text-muted">
              TOMCARE Foundation is a registered non-profit organization in Quebec, led by its founder and legal representative
              {about.representative ? `, ${about.representative.split(",")[0]}` : ""}, with the support of volunteers from the
              communities we serve.
            </p>
            <ButtonLink href="/team" className="mt-8">
              Meet the team
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
            <div className="relative overflow-hidden rounded-[24px] bg-indigo p-8 text-white">
              <HandMark className="absolute -bottom-6 -right-4 h-36 w-auto opacity-20" color="#fff" />
              <p className="font-display text-2xl leading-snug">Founded in Montréal, {about.founded}.</p>
              <p className="mt-2 text-white/70">{stripStars(about.headline)}.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
