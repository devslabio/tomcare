import type { Metadata } from "next";

import { PostCard } from "@/components/cards";
import { Highlight } from "@/components/highlight";
import { PageHero } from "@/components/page-hero";
import { getPosts } from "@/lib/cms";
import { getI18n } from "@/lib/i18n/server";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.news.metaTitle, description: t.news.metaDescription };
}

export default async function NewsPage() {
  const [{ t }, posts] = await Promise.all([getI18n(), getPosts()]);
  const copy = t.news;
  const [lead, ...others] = posts;
  const side = others.slice(0, 2);
  const rest = others.slice(2);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<Highlight text={copy.title} />}
        description={copy.description}
        image={photos.friends}
        compact
        crumbs={[{ href: "/news", label: t.nav.news }]}
      />

      <section className="paper section-y">
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
            <p className="text-center text-muted">{copy.empty}</p>
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
