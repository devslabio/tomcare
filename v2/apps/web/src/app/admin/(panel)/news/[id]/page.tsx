"use client";

import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { fromMontrealInput, markdownHint, optional, Section, toMontrealInput } from "@/components/admin/editor-kit";
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
} from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { Post } from "@/lib/admin-types";

const categories = ["News", "Stories", "Guides", "Events", "Announcements"];

export default function PostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const { data, error, reload } = useResource<Post>(isNew ? null : `/posts/${id}`);

  return (
    <div className="space-y-6">
      <Link href="/admin/news" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        News
      </Link>
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!isNew && !data && !error ? <LoadingState /> : null}
      {isNew || data ? <PostForm key={data?.id ?? "new"} post={data} /> : null}
    </div>
  );
}

function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState({
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    coverImage: post?.coverImage ?? "",
    author: post?.author ?? "TOMCARE Foundation",
    category: post?.category ?? "News",
    status: post?.status ?? "DRAFT",
    publishedAt: toMontrealInput(post?.publishedAt),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  async function save(status = values.status) {
    setBusy(true);
    setError(null);
    try {
      const saved = await api<Post>(post ? `/posts/${post.id}` : "/posts", {
        method: post ? "PATCH" : "POST",
        json: {
          ...values,
          status,
          coverImage: optional(values.coverImage),
          publishedAt: fromMontrealInput(values.publishedAt),
        },
      });
      setValues((current) => ({ ...current, status: saved.status, publishedAt: toMontrealInput(saved.publishedAt) }));
      toast(status === "PUBLISHED" && values.status === "DRAFT" ? "Published" : post ? "Saved" : "Story created");
      if (post) setBusy(false);
      else router.replace(`/admin/news/${saved.id}`);
    } catch (saveError) {
      setError((saveError as Error).message);
      setBusy(false);
    }
  }

  async function remove() {
    if (!post || !window.confirm(`Delete “${post.title}”? This can’t be undone.`)) return;
    try {
      await api(`/posts/${post.id}`, { method: "DELETE" });
      toast("Story deleted");
      router.replace("/admin/news");
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  const live = post?.status === "PUBLISHED";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
      className="space-y-6"
    >
      <PageHeader
        title={post ? post.title : "New story"}
        description={post ? `/news/${post.slug}` : "The web address is created from the title."}
        actions={
          <>
            {live ? (
              <a
                href={`/news/${post.slug}`}
                target="_blank"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy hover:bg-sand"
              >
                <ExternalLink className="size-4" aria-hidden />
                View
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
          <Section title="Story">
            <Field label="Headline">
              <Input value={values.title} onChange={(e) => set("title", e.target.value)} required minLength={2} maxLength={200} className="text-base font-semibold" />
            </Field>
            <Field label="Excerpt" hint="Shown on cards and in search results.">
              <Textarea value={values.excerpt} onChange={(e) => set("excerpt", e.target.value)} required minLength={5} maxLength={400} className="min-h-20" />
            </Field>
            <Field label="Body" hint={markdownHint}>
              <Textarea value={values.body} onChange={(e) => set("body", e.target.value)} maxLength={50000} className="min-h-[28rem] leading-7" />
            </Field>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Publishing">
            <Field label="Status">
              <Select value={values.status} onChange={(e) => set("status", e.target.value as Post["status"])}>
                <option value="DRAFT">Draft — only staff can see it</option>
                <option value="PUBLISHED">Published</option>
              </Select>
            </Field>
            <Field label="Publish date" hint="Montréal time. Leave empty to use the moment you publish; a future date schedules it.">
              <Input type="datetime-local" value={values.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
              <Field label="Category">
                <Input value={values.category} onChange={(e) => set("category", e.target.value)} list="post-categories" required minLength={2} maxLength={60} />
                <datalist id="post-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </Field>
              <Field label="Author">
                <Input value={values.author} onChange={(e) => set("author", e.target.value)} required minLength={2} maxLength={120} />
              </Field>
            </div>
          </Section>
          <Section title="Cover photo">
            <ImageField label="Cover" value={values.coverImage} onChange={(url) => set("coverImage", url)} aspect="aspect-[16/10]" />
          </Section>
          {post ? (
            <Button variant="danger" onClick={remove}>
              <Trash2 className="size-4" aria-hidden />
              Delete story
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
