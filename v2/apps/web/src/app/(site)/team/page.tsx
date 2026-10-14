import type { Metadata } from "next";

import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { Avatar, ButtonLink, Eyebrow } from "@/components/ui";
import { getTeam } from "@/lib/cms";
import type { TeamGroup, TeamMember } from "@/lib/cms-types";
import { getI18n } from "@/lib/i18n/server";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.team.metaTitle, description: t.team.metaDescription };
}

const groups: TeamGroup[] = ["BOARD", "STAFF", "VOLUNTEER"];

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col rounded-[28px] border border-line bg-white p-8">
      <Avatar name={member.name} photo={member.photo} className="size-20 text-2xl" />
      <h3 className="font-display mt-6 text-2xl text-ink">{member.name}</h3>
      <p className="mt-1 text-sm font-semibold text-indigo">{member.role}</p>
      {member.bio ? <p className="mt-4 text-[15px] leading-7 text-muted">{member.bio}</p> : null}
    </article>
  );
}

function FeaturedMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="grid gap-8 rounded-[32px] border border-line bg-white p-8 sm:grid-cols-[auto_1fr] sm:items-start lg:p-12">
      <Avatar name={member.name} photo={member.photo} className="size-28 text-4xl lg:size-36 lg:text-5xl" />
      <div className="max-w-3xl">
        <h3 className="font-display text-3xl text-ink lg:text-4xl">{member.name}</h3>
        <p className="mt-2 font-semibold text-indigo">{member.role}</p>
        {member.bio ? <p className="mt-5 text-[17px] leading-8 text-muted">{member.bio}</p> : null}
      </div>
    </article>
  );
}

export default async function TeamPage() {
  const [{ t }, team] = await Promise.all([getI18n(), getTeam()]);
  const copy = t.team;

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<Highlight text={copy.title} />}
        description={copy.description}
        image={photos.teamMeeting}
        compact
        crumbs={[
          { href: "/about", label: t.nav.about },
          { href: "/team", label: t.nav.team },
        ]}
      />

      <section className="paper section-y">
        <div className="container-x space-y-20">
          {groups.map((group) => {
            const members = team.filter((member) => member.group === group);
            if (!members.length) return null;
            return (
              <div key={group}>
                <Eyebrow>{copy.groups[group]}</Eyebrow>
                {members.length === 1 ? (
                  <div className="mt-8" data-reveal>
                    <FeaturedMemberCard member={members[0]} />
                  </div>
                ) : (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {members.map((member, index) => (
                      <div key={member.id} data-reveal style={revealDelay((index % 3) * 80)}>
                        <MemberCard member={member} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex flex-col items-start justify-between gap-8 rounded-[32px] bg-indigo p-10 text-white md:flex-row md:items-center lg:p-14" data-reveal>
            <div className="max-w-2xl">
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">{copy.joinTitle}</h2>
              <p className="text-lead mt-3 text-white/80">{copy.joinText}</p>
            </div>
            <ButtonLink href="/volunteer" variant="gold" className="shrink-0">
              {copy.joinCta}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
