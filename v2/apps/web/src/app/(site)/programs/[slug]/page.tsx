import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgramCard } from "@/components/cards";
import { Markdown } from "@/components/markdown";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui";
import { getProgram, getPrograms, getSettings } from "@/lib/cms";
import { Icon } from "@/lib/icons";

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const program = await getProgram((await params).slug);
  if (!program) return {};
  return {
    title: program.title,
    description: program.summary,
    openGraph: program.image ? { images: [`${program.image}&w=1200&h=630`] } : undefined,
  };
}

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const [program, programs, settings] = await Promise.all([getProgram(slug), getPrograms(), getSettings()]);
  if (!program) notFound();
  const others = programs.filter((item) => item.id !== program.id).slice(0, 3);
  const { contact } = settings;

  return (
    <>
      <PageHero
        eyebrow={program.category}
        title={program.title}
        description={program.summary}
        image={program.image}
        crumbs={[
          { href: "/programs", label: "Programs" },
          { href: `/programs/${program.slug}`, label: program.title },
        ]}
      />

      <section className="paper py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <article className="lg:col-span-7" data-reveal>
            <Markdown source={program.body || program.summary} className="text-[1.1rem]" />
          </article>
          <aside className="lg:col-span-5" data-reveal>
            <div className="space-y-5 lg:sticky lg:top-32">
              {program.highlights.length ? (
                <div className="rounded-[28px] border border-line bg-white p-8">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gold text-ink">
                    <Icon name={program.icon} className="size-6" />
                  </span>
                  <h2 className="mt-5 text-lg font-bold text-ink">What this program offers</h2>
                  <ul className="mt-5 space-y-3">
                    {program.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-[15px] leading-6 text-ink/80">
                        <Check className="mt-0.5 size-5 shrink-0 text-indigo" aria-hidden />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="rounded-[28px] bg-ink p-8 text-white">
                <h2 className="font-display text-2xl">Join this program</h2>
                <p className="mt-3 text-[15px] leading-7 text-white/70">
                  All our programs are free. Register online and we’ll contact you, or call us during opening hours.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <ButtonLink href="/get-help" variant="gold">
                    Register
                  </ButtonLink>
                  <ButtonLink href={`tel:${contact.phone}`} variant="outline-light" arrow={false}>
                    Call {contact.phoneDisplay}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {others.length ? (
        <section className="bg-sand py-20 lg:py-28">
          <div className="container-x">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-ink">Other programs</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <ProgramCard key={item.id} program={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
