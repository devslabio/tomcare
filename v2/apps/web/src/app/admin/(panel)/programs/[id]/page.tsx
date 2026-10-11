"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { IconPicker, LinesEditor, markdownHint, optional, Section } from "@/components/admin/editor-kit";
import { useToast } from "@/components/admin/toast";
import { Button, ErrorState, Field, FormError, ImageField, Input, LoadingState, PageHeader, Textarea, Toggle } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { Program } from "@/lib/admin-types";

export default function ProgramEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const { data, error, reload } = useResource<Program>(isNew ? null : `/programs/${id}`);

  return (
    <div className="space-y-6">
      <Link href="/admin/programs" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Programs
      </Link>
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!isNew && !data && !error ? <LoadingState /> : null}
      {isNew || data ? <ProgramForm key={data?.id ?? "new"} program={data} /> : null}
    </div>
  );
}

function ProgramForm({ program }: { program?: Program }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState({
    title: program?.title ?? "",
    category: program?.category ?? "",
    summary: program?.summary ?? "",
    body: program?.body ?? "",
    icon: program?.icon ?? "heart-handshake",
    image: program?.image ?? "",
    highlights: program?.highlights ?? [],
    featured: program?.featured ?? false,
    visible: program?.visible ?? true,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const saved = await api<Program>(program ? `/programs/${program.id}` : "/programs", {
        method: program ? "PATCH" : "POST",
        json: {
          ...values,
          image: optional(values.image),
          highlights: values.highlights.map((line) => line.trim()).filter(Boolean),
        },
      });
      toast(program ? "Program saved" : "Program created");
      if (program) setBusy(false);
      else router.replace(`/admin/programs/${saved.id}`);
    } catch (saveError) {
      setError((saveError as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <PageHeader
        title={program ? program.title : "New program"}
        description={program ? `/programs/${program.slug}` : "The web address is created from the title."}
        actions={
          <>
            {program?.visible ? (
              <a
                href={`/programs/${program.slug}`}
                target="_blank"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy hover:bg-sand"
              >
                <ExternalLink className="size-4" aria-hidden />
                View page
              </a>
            ) : null}
            <Button type="submit" busy={busy}>
              {program ? "Save changes" : "Create program"}
            </Button>
          </>
        }
      />
      <FormError message={error} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Section title="Basics" description="How the program appears on cards and at the top of its page.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Title">
                <Input value={values.title} onChange={(e) => set("title", e.target.value)} required minLength={2} maxLength={120} />
              </Field>
              <Field label="Category" hint="A short label, e.g. “Newcomers” or “Health”.">
                <Input value={values.category} onChange={(e) => set("category", e.target.value)} required minLength={2} maxLength={60} />
              </Field>
            </div>
            <Field label="Summary" hint="One or two sentences for cards and search results.">
              <Textarea value={values.summary} onChange={(e) => set("summary", e.target.value)} required minLength={5} maxLength={400} className="min-h-20" />
            </Field>
            <Field label="Page content" hint={markdownHint}>
              <Textarea value={values.body} onChange={(e) => set("body", e.target.value)} maxLength={20000} className="min-h-64 leading-7" />
            </Field>
          </Section>

          <Section title="What it includes" description="Short points listed beside the page content.">
            <LinesEditor value={values.highlights} onChange={(lines) => set("highlights", lines)} max={12} addLabel="Add point" />
          </Section>

          <Section title="Photo" description="Shown on the program card and as the page header.">
            <ImageField label="Photo" value={values.image} onChange={(url) => set("image", url)} aspect="aspect-[16/10]" hint="Landscape works best. JPEG, PNG or WebP, up to 10 MB." />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Visibility">
            <Toggle checked={values.visible} onChange={(visible) => set("visible", visible)} label="Show on website" description="Hidden programs disappear from lists and their page returns “not found”." />
            <Toggle checked={values.featured} onChange={(featured) => set("featured", featured)} label="Feature on home page" />
          </Section>
          <Section title="Icon">
            <IconPicker value={values.icon} onChange={(icon) => set("icon", icon)} />
          </Section>
        </div>
      </div>
    </form>
  );
}
