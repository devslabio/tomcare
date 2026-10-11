import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { Avatar, ButtonLink, Eyebrow } from "@/components/ui";
import { getTeam } from "@/lib/cms";
import type { TeamGroup, TeamMember } from "@/lib/cms-types";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export const metadata: Metadata = {
  title: "Our team",
  description: "Meet the founder, staff and volunteers of TOMCARE Foundation in Montréal.",
};

const groups: { key: TeamGroup; title: string }[] = [
  { key: "BOARD", title: "Leadership" },
  { key: "STAFF", title: "Staff" },
  { key: "VOLUNTEER", title: "Volunteer leads" },
];

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
  const team = await getTeam();

  return (
    <>
      <PageHero
        eyebrow="Our team"
        title={
          <>
            The people behind <em className="text-gold">the welcome.</em>
          </>
        }
        description="A small team and a growing circle of volunteers — many of whom once arrived in Canada not knowing anyone."
        image={photos.teamMeeting}
        compact
        crumbs={[
          { href: "/about", label: "About" },
          { href: "/team", label: "Team" },
        ]}
      />

      <section className="paper py-20 lg:py-28">
        <div className="container-x space-y-20">
          {groups.map((group) => {
            const members = team.filter((member) => member.group === group.key);
            if (!members.length) return null;
            return (
              <div key={group.key}>
                <Eyebrow>{group.title}</Eyebrow>
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
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">Want to be part of the team?</h2>
              <p className="mt-3 text-[17px] leading-8 text-white/75">We’re always looking for volunteers who care about making newcomers feel at home.</p>
            </div>
            <ButtonLink href="/volunteer" variant="gold" className="shrink-0">
              Volunteer with us
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
