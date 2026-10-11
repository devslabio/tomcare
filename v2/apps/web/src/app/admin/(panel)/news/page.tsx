"use client";

import { Newspaper, Plus } from "lucide-react";
import Link from "next/link";

import { DataTable } from "@/components/admin/data-table";
import { Badge, PageHeader } from "@/components/admin/ui";
import type { AdminPost } from "@/lib/admin-types";
import { formatDate } from "@/lib/format";

export default function NewsAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="News & stories"
        description="Updates, community stories and guides. Drafts stay private until you publish them."
        actions={
          <Link
            href="/admin/news/new"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-soft"
          >
            <Plus className="size-4" aria-hidden />
            New story
          </Link>
        }
      />
      <DataTable<AdminPost>
        path="/posts"
        title="News"
        searchPlaceholder="Search title, author or category"
        rowKey={(post) => post.id}
        empty={{ icon: Newspaper, title: "No stories yet", description: "Write your first update for the News page." }}
        columns={[
          {
            header: "Story",
            sort: "title",
            value: (post) => post.title,
            cell: (post) => (
              <Link href={`/admin/news/${post.id}`} className="flex min-w-0 items-center gap-3">
                <span className="hidden h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-sand sm:block">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt="" className="size-full object-cover" />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-navy hover:underline">{post.title}</span>
                  <span className="block truncate text-xs text-muted">{post.author}</span>
                </span>
              </Link>
            ),
          },
          { header: "Category", sort: "category", value: (post) => post.category, cell: (post) => post.category },
          {
            header: "Status",
            sort: "status",
            value: (post) => post.status,
            cell: (post) =>
              post.status === "PUBLISHED" ? (
                post.publishedAt && Date.parse(post.publishedAt) > Date.now() ? (
                  <Badge tone="blue">Scheduled</Badge>
                ) : (
                  <Badge tone="green">Published</Badge>
                )
              ) : (
                <Badge>Draft</Badge>
              ),
          },
          {
            header: "Date",
            sort: "publishedAt",
            value: (post) => (post.publishedAt ? formatDate(post.publishedAt) : ""),
            cell: (post) => (post.publishedAt ? formatDate(post.publishedAt, { dateStyle: "medium" }) : "—"),
          },
        ]}
      />
    </div>
  );
}
