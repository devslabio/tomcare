"use client";

import { ExternalLink, HeartHandshake, Pencil, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";

import { moveItem, ReorderButtons } from "@/components/admin/reorder";
import { useToast } from "@/components/admin/toast";
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { Program } from "@/lib/admin-types";
import { Icon } from "@/lib/icons";

export default function ProgramsAdminPage() {
  const toast = useToast();
  const { data, error, reload, setData } = useResource<Program[]>("/programs");

  async function move(index: number, delta: -1 | 1) {
    if (!data) return;
    const next = moveItem(data, index, delta);
    setData(() => next);
    try {
      await api("/programs/order", { method: "PUT", json: { ids: next.map((program) => program.id) } });
    } catch (orderError) {
      toast((orderError as Error).message, "error");
      reload();
    }
  }

  async function remove(program: Program) {
    if (!window.confirm(`Delete “${program.title}”? Its page on the website will stop working.`)) return;
    try {
      await api(`/programs/${program.id}`, { method: "DELETE" });
      toast("Program deleted");
      reload();
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  const newButton = (
    <Link
      href="/admin/programs/new"
      className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-soft"
    >
      <Plus className="size-4" aria-hidden />
      New program
    </Link>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programs"
        description="Listed on the Programs page in this order. Starred programs are also featured on the home page."
        actions={newButton}
      />
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!data && !error ? <LoadingState /> : null}
      {data && !data.length ? (
        <Card>
          <EmptyState icon={HeartHandshake} title="No programs yet" action={newButton} />
        </Card>
      ) : null}
      {data?.length ? (
        <Card>
          <ul className="divide-y divide-line">
            {data.map((program, index) => (
              <li key={program.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
                <ReorderButtons index={index} count={data.length} onMove={(delta) => move(index, delta)} />
                <div className="relative hidden h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-sand sm:block">
                  {program.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={program.image} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="flex size-full items-center justify-center text-navy/40">
                      <Icon name={program.icon} className="size-5" />
                    </span>
                  )}
                </div>
                <Link href={`/admin/programs/${program.id}`} className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate font-semibold text-navy hover:underline">
                    {program.featured ? <Star className="size-3.5 shrink-0 fill-gold text-gold" aria-label="Featured" /> : null}
                    {program.title}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {program.category} · {program.summary}
                  </p>
                </Link>
                {!program.visible ? <Badge>Hidden</Badge> : null}
                <div className="flex">
                  {program.visible ? (
                    <a
                      href={`/programs/${program.slug}`}
                      target="_blank"
                      className="hidden size-9 items-center justify-center rounded-full text-navy hover:bg-sand sm:inline-flex"
                      aria-label="View on website"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  ) : null}
                  <Link
                    href={`/admin/programs/${program.id}`}
                    className="inline-flex size-9 items-center justify-center rounded-full text-navy hover:bg-sand"
                    aria-label={`Edit ${program.title}`}
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => remove(program)} aria-label={`Delete ${program.title}`}>
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
