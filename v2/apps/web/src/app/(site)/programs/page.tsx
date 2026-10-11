import type { Metadata } from "next";

import { ProgramCard } from "@/components/cards";
import { PageHero } from "@/components/page-hero";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { getPrograms, getServices } from "@/lib/cms";
import { Icon } from "@/lib/icons";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export const metadata: Metadata = {
  title: "Programs & services",
  description:
    "Social activities, digital literacy, legal advice, housing help, employability and more — free programs for newcomers and families in Montréal.",
};

const categoryAnchor = (category: string) => `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export default async function ProgramsPage() {
  const [programs, services] = await Promise.all([getPrograms(), getServices()]);
  const categories = [...new Set(programs.map((program) => program.category))];

  return (
    <>
      <PageHero
        eyebrow="Programs & services"
        title={
          <>
            Practical support, <em className="text-gold">free of charge</em>, for every step of settling in.
          </>
        }
        description="From your first week in Montréal to your first job, we offer programs that meet people where they are — and everyday services for the small tasks that can feel impossible when everything is new."
        image={photos.community}
        crumbs={[{ href: "/programs", label: "Programs" }]}
      >
        <nav aria-label="Program categories" className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <a
              key={category}
              href={`#${categoryAnchor(category)}`}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white/80 transition hover:border-gold hover:bg-gold hover:text-ink"
            >
              {category}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="paper py-24 lg:py-28">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <div
                key={program.id}
                id={programs.findIndex((other) => other.category === program.category) === index ? categoryAnchor(program.category) : undefined}
                className="scroll-mt-32"
                data-reveal
                style={revealDelay((index % 3) * 80)}
              >
                <ProgramCard program={program} priority={index < 3} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {services.length ? (
        <section id="services" className="bg-sand py-24 lg:py-28">
          <div className="container-x">
            <div className="max-w-2xl" data-reveal>
              <Eyebrow>Everyday services</Eyebrow>
              <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-ink">
                Drop in — we’ll help with it <em className="text-indigo">today.</em>
              </h2>
              <p className="mt-5 text-[17px] leading-8 text-muted">
                No appointment needed during opening hours. Bring your documents and we’ll sit down with you.
              </p>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <li key={service.id} className="flex gap-4 rounded-[22px] border border-line/80 bg-white p-6" data-reveal style={revealDelay((index % 3) * 60)}>
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo/[0.07] text-indigo">
                    <Icon name={service.icon} className="size-6" />
                  </span>
                  <span>
                    <span className="block font-bold text-ink">{service.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{service.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="paper py-20">
        <div className="container-x flex flex-col items-start justify-between gap-8 rounded-[32px] border border-line bg-white p-10 md:flex-row md:items-center lg:p-14" data-reveal>
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-ink">Not sure which program is right for you?</h2>
            <p className="mt-3 text-[17px] leading-8 text-muted">Tell us what you’re going through and we’ll point you to the right help.</p>
          </div>
          <ButtonLink href="/get-help" variant="gold" className="shrink-0">
            Ask for help
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
