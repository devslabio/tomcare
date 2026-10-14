"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { FrenchFields, FrenchSection, fromMontrealInput, markdownHint, optional, Section, toMontrealInput, type FrenchValues } from "@/components/admin/editor-kit";
import { useToast } from "@/components/admin/toast";
import { Button, ErrorState, Field, FormError, ImageField, Input, LoadingState, PageHeader, Textarea, Toggle } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { Event } from "@/lib/admin-types";

export default function EventEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const { data, error, reload } = useResource<Event>(isNew ? null : `/events/${id}`);

  return (
    <div className="space-y-6">
      <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Events
      </Link>
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!isNew && !data && !error ? <LoadingState /> : null}
      {isNew || data ? <EventForm key={data?.id ?? "new"} event={data} /> : null}
    </div>
  );
}

function EventForm({ event }: { event?: Event }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState({
    title: event?.title ?? "",
    summary: event?.summary ?? "",
    body: event?.body ?? "",
    image: event?.image ?? "",
    startsAt: toMontrealInput(event?.startsAt),
    endsAt: toMontrealInput(event?.endsAt),
    location: event?.location ?? "",
    registerUrl: event?.registerUrl ?? "",
    visible: event?.visible ?? true,
  });
  const [fr, setFr] = useState<FrenchValues>(event?.fr ?? {});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  async function onSubmit(submit: React.FormEvent) {
    submit.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const saved = await api<Event>(event ? `/events/${event.id}` : "/events", {
        method: event ? "PATCH" : "POST",
        json: {
          ...values,
          image: optional(values.image),
          registerUrl: optional(values.registerUrl),
          startsAt: fromMontrealInput(values.startsAt),
          endsAt: fromMontrealInput(values.endsAt),
          fr,
        },
      });
      toast(event ? "Event saved" : "Event created");
      if (event) setBusy(false);
      else router.replace(`/admin/events/${saved.id}`);
    } catch (saveError) {
      setError((saveError as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <PageHeader
        title={event ? event.title : "New event"}
        description={event ? `/events/${event.slug}` : "The web address is created from the title."}
        actions={
          <>
            {event?.visible ? (
              <a
                href={`/events/${event.slug}`}
                target="_blank"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy hover:bg-sand"
              >
                <ExternalLink className="size-4" aria-hidden />
                View page
              </a>
            ) : null}
            <Button type="submit" busy={busy}>
              {event ? "Save changes" : "Create event"}
            </Button>
          </>
        }
      />
      <FormError message={error} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Section title="Details">
            <Field label="Title">
              <Input value={values.title} onChange={(e) => set("title", e.target.value)} required minLength={2} maxLength={160} />
            </Field>
            <Field label="Summary" hint="One or two sentences shown on event cards.">
              <Textarea value={values.summary} onChange={(e) => set("summary", e.target.value)} required minLength={5} maxLength={400} className="min-h-20" />
            </Field>
            <Field label="Full description" hint={markdownHint}>
              <Textarea value={values.body} onChange={(e) => set("body", e.target.value)} maxLength={20000} className="min-h-56 leading-7" />
            </Field>
          </Section>
          <FrenchSection>
            <FrenchFields
              value={fr}
              onChange={setFr}
              fields={[
                { key: "title", label: "Title", max: 160, english: values.title, wide: true },
                { key: "summary", label: "Summary", max: 400, english: values.summary, kind: "long" },
                { key: "body", label: "Full description", max: 20000, english: values.body, kind: "markdown" },
                { key: "location", label: "Location", max: 200, english: values.location, wide: true },
              ]}
            />
          </FrenchSection>
          <Section title="Photo">
            <ImageField label="Event photo" value={values.image} onChange={(url) => set("image", url)} aspect="aspect-[16/10]" />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="When & where" description="Montréal time.">
            <Field label="Starts">
              <Input type="datetime-local" value={values.startsAt} onChange={(e) => set("startsAt", e.target.value)} required />
            </Field>
            <Field label="Ends" hint="Optional.">
              <Input type="datetime-local" value={values.endsAt} min={values.startsAt} onChange={(e) => set("endsAt", e.target.value)} />
            </Field>
            <Field label="Location">
              <Input value={values.location} onChange={(e) => set("location", e.target.value)} required minLength={2} maxLength={200} placeholder="e.g. Community centre, Montréal" />
            </Field>
            <Field label="Registration link" hint="Optional. Without one, visitors are sent to the contact page.">
              <Input type="url" value={values.registerUrl} onChange={(e) => set("registerUrl", e.target.value)} placeholder="https://" />
            </Field>
          </Section>
          <Section title="Visibility">
            <Toggle checked={values.visible} onChange={(visible) => set("visible", visible)} label="Show on website" />
          </Section>
        </div>
      </div>
    </form>
  );
}
