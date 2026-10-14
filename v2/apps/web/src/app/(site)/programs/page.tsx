import type { Metadata } from "next";

import { ProgramCard } from "@/components/cards";
import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { getPrograms, getServices } from "@/lib/cms";
import { getI18n } from "@/lib/i18n/server";
import { Icon } from "@/lib/icons";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.programs.metaTitle, description: t.programs.metaDescription };
}

const categoryAnchor = (category: string) =>
  `category-${category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export default async function ProgramsPage() {
  const [{ t }, programs, services] = await Promise.all([getI18n(), getPrograms(), getServices()]);
  const copy = t.programs;
  const categories = [...new Set(programs.map((program) => program.category))];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<Highlight text={copy.title} />}
        description={copy.description}
        image={photos.community}
        crumbs={[{ href: "/programs", label: t.nav.programs }]}
      >
        <nav aria-label={copy.categories} className="mt-10 flex flex-wrap gap-2">
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

      <section className="paper section-y">
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
        <section id="services" className="section-y bg-sand">
          <div className="container-x">
            <div className="max-w-2xl" data-reveal>
              <Eyebrow>{copy.servicesEyebrow}</Eyebrow>
              <h2 className="font-display text-h2 mt-5 text-ink">
                <Highlight text={copy.servicesTitle} className="text-indigo not-italic" />
              </h2>
              <p className="text-lead mt-5 text-muted">{copy.servicesText}</p>
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

      <section className="paper pb-16 lg:pb-24">
        <div className="container-x flex flex-col items-start justify-between gap-8 rounded-[32px] border border-line bg-white p-10 md:flex-row md:items-center lg:p-14" data-reveal>
          <div className="max-w-2xl">
            <h2 className="font-display text-title leading-tight text-ink">{copy.notSureTitle}</h2>
            <p className="text-lead mt-3 text-muted">{copy.notSureText}</p>
          </div>
          <ButtonLink href="/get-help" variant="gold" className="shrink-0">
            {t.actions.getHelp}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
