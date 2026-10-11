"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { BlockEditor } from "@/components/admin/block-editor";
import { optional, Section } from "@/components/admin/editor-kit";
import { useToast } from "@/components/admin/toast";
import {
  Button,
  ErrorState,
  Field,
  FormError,
  ImageField,
  Input,
  LoadingState,
  PageHeader,
  Select,
  Textarea,
  Toggle,
} from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { Page } from "@/lib/admin-types";
import { blockTypes, newBlock, type Block } from "@/lib/blocks";

export default function PageEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const { data, error, reload } = useResource<Page>(isNew ? null : `/pages/${id}`);

  return (
    <div className="space-y-6">
      <Link href="/admin/pages" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Pages
      </Link>
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!isNew && !data && !error ? <LoadingState /> : null}
      {isNew || data ? <PageForm key={data?.id ?? "new"} page={data} /> : null}
    </div>
  );
}

function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function PageForm({ page }: { page?: Page }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState({
    title: page?.title ?? "",
    slug: page?.slug ?? "",
    description: page?.description ?? "",
    heroImage: page?.heroImage ?? "",
    status: page?.status ?? "DRAFT",
    showInNav: page?.showInNav ?? false,
    navLabel: page?.navLabel ?? "",
  });
  const [blocks, setBlocks] = useState<Block[]>(page?.blocks ?? [newBlock(blockTypes[0].type)]);
  const [slugTouched, setSlugTouched] = useState(Boolean(page));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  async function save(status = values.status) {
    setBusy(true);
    setError(null);
    try {
      const saved = await api<Page>(page ? `/pages/${page.id}` : "/pages", {
        method: page ? "PATCH" : "POST",
        json: {
          ...values,
          status,
          slug: optional(values.slug),
          description: values.description,
          heroImage: optional(values.heroImage),
          navLabel: optional(values.navLabel),
          blocks,
        },
      });
      set("status", saved.status);
      setBlocks(saved.blocks);
      toast(status === "PUBLISHED" && values.status === "DRAFT" ? "Page published" : page ? "Page saved" : "Page created");
      if (page) setBusy(false);
      else router.replace(`/admin/pages/${saved.id}`);
    } catch (saveError) {
      setError((saveError as Error).message);
      setBusy(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
      className="space-y-6"
    >
      <PageHeader
        title={page ? page.title : "New page"}
        description={values.slug ? `/${values.slug}` : "Give the page a title to create its web address."}
        actions={
          <>
            {page?.status === "PUBLISHED" ? (
              <a
                href={`/${page.slug}`}
                target="_blank"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy hover:bg-sand"
              >
                <ExternalLink className="size-4" aria-hidden />
                View page
              </a>
            ) : null}
            {values.status === "DRAFT" ? (
              <>
                <Button type="submit" variant="secondary" busy={busy}>
                  Save draft
                </Button>
                <Button
                  busy={busy}
                  onClick={(event) => {
                    const form = (event.currentTarget as HTMLButtonElement).form;
                    if (form?.reportValidity()) void save("PUBLISHED");
                  }}
                >
                  Publish
                </Button>
              </>
            ) : (
              <Button type="submit" busy={busy}>
                Save changes
              </Button>
            )}
          </>
        }
      />
      <FormError message={error} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Section title="Page header" description="The title band at the top of the page.">
            <Field label="Title">
              <Input
                value={values.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                required
                minLength={2}
                maxLength={160}
                className="text-base font-semibold"
              />
            </Field>
            <Field label="Introduction" hint="One or two sentences under the title. Also used by search engines.">
              <Textarea value={values.description} onChange={(e) => set("description", e.target.value)} maxLength={400} className="min-h-20" />
            </Field>
            <ImageField
              label="Header photo"
              value={values.heroImage}
              onChange={(url) => set("heroImage", url)}
              aspect="aspect-[21/9]"
              hint="Optional. A wide landscape photo works best."
            />
          </Section>

          <Section title="Sections" description="Build the page from blocks. Use the arrows to change their order.">
            <BlockEditor value={blocks} onChange={setBlocks} />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Publishing">
            <Field label="Status">
              <Select value={values.status} onChange={(e) => set("status", e.target.value as Page["status"])}>
                <option value="DRAFT">Draft — only staff can see it</option>
                <option value="PUBLISHED">Published</option>
              </Select>
            </Field>
            <Field label="Web address" hint="Lowercase letters, numbers and hyphens.">
              <div className="flex items-center rounded-xl border border-line bg-white pl-3 focus-within:border-navy">
                <span className="text-sm text-muted">/</span>
                <input
                  value={values.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                  }}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  maxLength={80}
                  className="h-11 min-w-0 flex-1 bg-transparent px-1 text-sm text-navy outline-none"
                  aria-label="Web address"
                />
              </div>
            </Field>
          </Section>
          <Section title="Navigation">
            <Toggle
              checked={values.showInNav}
              onChange={(showInNav) => set("showInNav", showInNav)}
              label="Show in the main menu"
              description="Published pages only. Keep the menu short — two or three extra pages at most."
            />
            {values.showInNav ? (
              <Field label="Menu label" hint="Optional shorter name for the menu.">
                <Input value={values.navLabel} onChange={(e) => set("navLabel", e.target.value)} maxLength={40} placeholder={values.title} />
              </Field>
            ) : null}
          </Section>
        </div>
      </div>
    </form>
  );
}
