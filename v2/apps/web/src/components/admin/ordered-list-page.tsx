"use client";

import { Pencil, Plus, Trash2, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { moveItem, ReorderButtons } from "@/components/admin/reorder";
import { useToast } from "@/components/admin/toast";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  FormActions,
  FormError,
  LoadingState,
  Modal,
  PageHeader,
  Toggle,
} from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";

type Row = { id: string; visible: boolean };

/**
 * Admin page for a short, hand-ordered list edited in a dialog (services, team, testimonials...).
 * `toForm` turns a row (or nothing, for a new one) into editable values; `toPayload` turns them back.
 */
export function OrderedListPage<T extends Row, F extends Record<string, unknown>>({
  path,
  title,
  description,
  noun,
  icon,
  toForm,
  toPayload,
  fields,
  preview,
  viewHref,
}: {
  path: string;
  title: string;
  description: string;
  noun: string;
  icon: LucideIcon;
  toForm: (row?: T) => F;
  toPayload: (form: F) => Record<string, unknown>;
  fields: (form: F, set: <K extends keyof F>(key: K, value: F[K]) => void) => React.ReactNode;
  preview: (row: T) => { title: string; subtitle?: string; media?: React.ReactNode };
  viewHref?: string;
}) {
  const toast = useToast();
  const { data, error, reload, setData } = useResource<T[]>(path);
  const [editing, setEditing] = useState<{ row?: T } | null>(null);

  async function move(index: number, delta: -1 | 1) {
    if (!data) return;
    const next = moveItem(data, index, delta);
    setData(() => next);
    try {
      await api(`${path}/order`, { method: "PUT", json: { ids: next.map((row) => row.id) } });
    } catch (orderError) {
      toast((orderError as Error).message, "error");
      reload();
    }
  }

  async function remove(row: T) {
    if (!window.confirm(`Delete “${preview(row).title}”? This can’t be undone.`)) return;
    try {
      await api(`${path}/${row.id}`, { method: "DELETE" });
      toast(`${noun[0].toUpperCase()}${noun.slice(1)} deleted`);
      reload();
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  const newButton = (
    <Button onClick={() => setEditing({})}>
      <Plus className="size-4" aria-hidden />
      Add {noun}
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {viewHref ? (
              <a
                href={viewHref}
                target="_blank"
                className="inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy hover:bg-sand"
              >
                View on website
              </a>
            ) : null}
            {newButton}
          </>
        }
      />
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!data && !error ? <LoadingState /> : null}
      {data && !data.length ? (
        <Card>
          <EmptyState icon={icon} title={`No ${noun}s yet`} action={newButton} />
        </Card>
      ) : null}
      {data?.length ? (
        <Card>
          <ul className="divide-y divide-line">
            {data.map((row, index) => {
              const shown = preview(row);
              return (
                <li key={row.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
                  <ReorderButtons index={index} count={data.length} onMove={(delta) => move(index, delta)} />
                  {shown.media ? <div className="hidden shrink-0 sm:block">{shown.media}</div> : null}
                  <button type="button" onClick={() => setEditing({ row })} className="min-w-0 flex-1 text-left">
                    <p className="truncate font-semibold text-navy hover:underline">{shown.title}</p>
                    {shown.subtitle ? <p className="truncate text-sm text-muted">{shown.subtitle}</p> : null}
                  </button>
                  {!row.visible ? <Badge>Hidden</Badge> : null}
                  <div className="flex">
                    <Button variant="ghost" size="sm" onClick={() => setEditing({ row })} aria-label={`Edit ${shown.title}`}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(row)} aria-label={`Delete ${shown.title}`}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}

      <Modal open={editing !== null} title={editing?.row ? `Edit ${noun}` : `New ${noun}`} onClose={() => setEditing(null)} wide>
        {editing ? (
          <EditForm
            key={editing.row?.id ?? "new"}
            initial={toForm(editing.row)}
            fields={fields}
            onCancel={() => setEditing(null)}
            onSave={async (form) => {
              await api(editing.row ? `${path}/${editing.row.id}` : path, {
                method: editing.row ? "PATCH" : "POST",
                json: toPayload(form),
              });
              toast(editing.row ? "Saved" : `${noun[0].toUpperCase()}${noun.slice(1)} added`);
              setEditing(null);
              reload();
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}

function EditForm<F extends Record<string, unknown>>({
  initial,
  fields,
  onSave,
  onCancel,
}: {
  initial: F;
  fields: (form: F, set: <K extends keyof F>(key: K, value: F[K]) => void) => React.ReactNode;
  onSave: (form: F) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof F>(key: K, value: F[K]) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError(null);
        try {
          await onSave(form);
        } catch (saveError) {
          setError((saveError as Error).message);
          setBusy(false);
        }
      }}
      className="space-y-5"
    >
      {fields(form, set)}
      {"visible" in form ? (
        <Toggle
          checked={Boolean(form.visible)}
          onChange={(visible) => set("visible", visible as F[keyof F])}
          label="Show on website"
        />
      ) : null}
      <FormError message={error} />
      <FormActions>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" busy={busy}>
          Save
        </Button>
      </FormActions>
    </form>
  );
}
