import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Blocks } from "@/components/blocks";
import { PageHero } from "@/components/page-hero";
import { getPage } from "@/lib/cms";

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const page = await getPage((await params).slug);
  if (!page) return {};
  return { title: page.title, description: page.description || undefined };
}

export default async function CustomPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow={page.navLabel || "TOMCARE Foundation"}
        title={page.title}
        description={page.description || undefined}
        image={page.heroImage}
        compact
        crumbs={[{ href: `/${page.slug}`, label: page.title }]}
      />
      <div className="paper py-6 lg:py-10">
        <Blocks blocks={page.blocks} />
      </div>
    </>
  );
}
