import type { Metadata } from "next";

import { PostCard } from "@/components/cards";
import { PageHero } from "@/components/page-hero";
import { getPosts } from "@/lib/cms";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export const metadata: Metadata = {
  title: "News & stories",
  description: "Stories from the TOMCARE community, program updates and ways to get involved.",
};

export default async function NewsPage() {
  const posts = await getPosts();
  const [lead, ...others] = posts;
  const side = others.slice(0, 2);
  const rest = others.slice(2);

  return (
    <>
      <PageHero
        eyebrow="News & stories"
        title={
          <>
            Stories of <em className="text-gold">new beginnings.</em>
          </>
        }
        description="Updates from our programs, voices from the community and practical news for newcomers in Quebec."
        image={photos.friends}
        compact
        crumbs={[{ href: "/news", label: "News" }]}
      />

      <section className="paper py-20 lg:py-28">
        <div className="container-x">
          {lead ? (
            <div className="grid gap-12 lg:grid-cols-12" data-reveal>
              <div className="lg:col-span-7">
                <PostCard post={lead} large />
              </div>
              {side.length ? (
                <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                  {side.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-center text-muted">No stories yet — check back soon.</p>
          )}
          {rest.length ? (
            <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, index) => (
                <div key={post.id} data-reveal style={revealDelay((index % 3) * 80)}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
