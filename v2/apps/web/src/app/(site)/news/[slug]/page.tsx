import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/cards";
import { Markdown } from "@/components/markdown";
import { PageHero } from "@/components/page-hero";
import { Avatar } from "@/components/ui";
import { getPost, getPosts } from "@/lib/cms";
import { formatDate, readingMinutes } from "@/lib/format";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", publishedTime: post.publishedAt ?? undefined, ...(post.coverImage ? { images: [`${post.coverImage}&w=1200&h=630`] } : {}) },
  };
}

export default async function PostPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();
  const more = posts.filter((item) => item.id !== post.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "NGO", name: site.name, url: site.url },
    ...(post.coverImage ? { image: [post.coverImage] } : {}),
  };

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        image={post.coverImage}
        compact
        crumbs={[
          { href: "/news", label: "News" },
          { href: `/news/${post.slug}`, label: post.title },
        ]}
      >
        <div className="mt-8 flex items-center gap-3 text-sm text-white/75">
          <Avatar name={post.author} className="size-10 text-sm" />
          <span>
            <span className="block font-semibold text-white">{post.author}</span>
            {post.publishedAt ? formatDate(post.publishedAt) : null} · {readingMinutes(post.body)} min read
          </span>
        </div>
      </PageHero>

      <section className="paper py-20 lg:py-24">
        <article className="container-x">
          <Markdown source={post.body} className="mx-auto max-w-3xl text-[1.125rem]" />
        </article>
      </section>

      {more.length ? (
        <section className="border-t border-line bg-cream py-20 lg:py-24">
          <div className="container-x">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-ink">Keep reading</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {more.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
