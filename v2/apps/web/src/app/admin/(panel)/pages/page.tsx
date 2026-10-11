"use client";

import { ExternalLink, FileText, Menu, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { moveItem, ReorderButtons } from "@/components/admin/reorder";
import { useToast } from "@/components/admin/toast";
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { AdminPage } from "@/lib/admin-types";
import { formatDate } from "@/lib/format";

export default function PagesAdminPage() {
  const toast = useToast();
  const { data, error, reload, setData } = useResource<AdminPage[]>("/pages");

  async function move(index: number, delta: -1 | 1) {
    if (!data) return;
    const next = moveItem(data, index, delta);
    setData(() => next);
    try {
      await api("/pages/order", { method: "PUT", json: { ids: next.map((page) => page.id) } });
    } catch (orderError) {
      toast((orderError as Error).message, "error");
      reload();
    }
  }

  async function remove(page: AdminPage) {
    if (!window.confirm(`Delete the page “${page.title}”? Links to /${page.slug} will stop working.`)) return;
    try {
      await api(`/pages/${page.id}`, { method: "DELETE" });
      toast("Page deleted");
      reload();
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  const newButton = (
    <Link
      href="/admin/pages/new"
      className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-soft"
    >
      <Plus className="size-4" aria-hidden />
      New page
    </Link>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pages"
        description="Extra pages built from sections — FAQs, partnerships, reports and more. Pages marked “In menu” appear in the site navigation in this order."
        actions={newButton}
      />
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!data && !error ? <LoadingState /> : null}
      {data && !data.length ? (
        <Card>
          <EmptyState icon={FileText} title="No pages yet" description="Build a page from text, photos, cards, questions and more." action={newButton} />
        </Card>
      ) : null}
      {data?.length ? (
        <Card>
          <ul className="divide-y divide-line">
            {data.map((page, index) => (
              <li key={page.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
                <ReorderButtons index={index} count={data.length} onMove={(delta) => move(index, delta)} />
                <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-sand text-navy sm:inline-flex">
                  <FileText className="size-5" aria-hidden />
                </span>
                <Link href={`/admin/pages/${page.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-navy hover:underline">{page.title}</p>
                  <p className="truncate text-sm text-muted">
                    /{page.slug} · updated {formatDate(page.updatedAt, { dateStyle: "medium" })}
                  </p>
                </Link>
                <div className="hidden items-center gap-2 sm:flex">
                  {page.showInNav && page.status === "PUBLISHED" ? (
                    <Badge tone="blue">
                      <Menu className="mr-1 size-3" aria-hidden />
                      In menu
                    </Badge>
                  ) : null}
                  {page.status === "PUBLISHED" ? <Badge tone="green">Published</Badge> : <Badge>Draft</Badge>}
                </div>
                <div className="flex">
                  {page.status === "PUBLISHED" ? (
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      className="hidden size-9 items-center justify-center rounded-full text-navy hover:bg-sand sm:inline-flex"
                      aria-label="View on website"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  ) : null}
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="inline-flex size-9 items-center justify-center rounded-full text-navy hover:bg-sand"
                    aria-label={`Edit ${page.title}`}
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => remove(page)} aria-label={`Delete ${page.title}`}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
