"use client";

import { useState } from "react";
import { useToast } from "@/components/admin/toast";
import { Button, Card, ErrorState, Field, Input, LoadingState, PageHeader, Textarea } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { SiteSettings } from "@/lib/admin-types";

type Section = keyof SiteSettings;
type FieldSpec = { key: string; label: string; hint?: string; type?: string; multiline?: boolean; wide?: boolean };

const highlightHint = "Wrap words in *stars* to show them in the gold italic accent.";

const statFields = [1, 2, 3, 4].flatMap((n) => [
  { key: `stat${n}Value`, label: `Figure ${n}`, hint: n === 1 ? "e.g. 173 or 10+" : undefined },
  { key: `stat${n}Label`, label: `Label ${n}`, hint: n === 1 ? "e.g. newcomers welcomed in 2024" : undefined },
]);

const sections: { key: Section; title: string; description: string; fields: FieldSpec[] }[] = [
  {
    key: "hero",
    title: "Home page headline",
    description: "The large text over the photo at the top of the home page.",
    fields: [
      { key: "eyebrow", label: "Small line above", hint: "e.g. Montréal · Since 2024", wide: true },
      { key: "title", label: "Headline", hint: highlightHint, wide: true },
      { key: "subtitle", label: "Supporting text", multiline: true, wide: true },
    ],
  },
  {
    key: "contact",
    title: "Contact details",
    description: "Used in the header, footer, contact page and call links.",
    fields: [
      { key: "phoneDisplay", label: "Phone (as displayed)", hint: "e.g. (438) 773-3653" },
      { key: "phone", label: "Phone (for dialling)", hint: "International format without spaces, e.g. +14387733653" },
      { key: "email", label: "Email", type: "email" },
      { key: "address", label: "Address" },
      { key: "mapQuery", label: "Map search", hint: "What Google Maps should look up for the contact page map." },
      { key: "hours", label: "Opening hours", multiline: true, hint: "One line per day or group of days." },
    ],
  },
  {
    key: "links",
    title: "Social media",
    description: "Full profile links. Leave one empty to hide its icon.",
    fields: [
      { key: "facebook", label: "Facebook", type: "url" },
      { key: "instagram", label: "Instagram", type: "url" },
      { key: "x", label: "X (Twitter)", type: "url" },
      { key: "linkedin", label: "LinkedIn", type: "url" },
      { key: "youtube", label: "YouTube", type: "url" },
    ],
  },
  {
    key: "about",
    title: "About the foundation",
    description: "Text on the About page and the introduction on the home page.",
    fields: [
      { key: "headline", label: "Headline", hint: highlightHint, wide: true },
      { key: "intro", label: "Introduction", multiline: true, wide: true },
      { key: "story", label: "Our story", multiline: true, wide: true, hint: "Leave a blank line between paragraphs." },
      { key: "vision", label: "Vision", multiline: true },
      { key: "mission", label: "Mission", multiline: true },
      { key: "quote", label: "Founder’s quote", multiline: true, wide: true },
      { key: "representative", label: "Quote attributed to", hint: "Name and title" },
      { key: "founded", label: "Year founded" },
    ],
  },
  {
    key: "stats",
    title: "Key figures",
    description: "The four numbers on the home and About pages. Keep them accurate — update them each year.",
    fields: statFields,
  },
  {
    key: "donate",
    title: "Donations",
    description: "Text and payment details on the Donate page. Ways to give with an empty field are hidden.",
    fields: [
      { key: "headline", label: "Headline", hint: highlightHint, wide: true },
      { key: "intro", label: "Introduction", multiline: true, wide: true },
      { key: "etransferEmail", label: "Interac e-Transfer email", type: "email", hint: "Empty hides the e-Transfer option." },
      { key: "donationUrl", label: "Online donation link", type: "url", hint: "e.g. CanadaHelps or Zeffy page. Empty hides the button." },
      { key: "charityNumber", label: "Charity registration number", hint: "Only once the CRA has issued one. Empty hides it." },
      { key: "dropOffDays", label: "Goods drop-off times", multiline: true, hint: "One per line: Day · time · note" },
      { key: "recognition", label: "Thank-you note", multiline: true, wide: true },
    ],
  },
];

export default function SettingsPage() {
  const { data, error, reload, setData } = useResource<SiteSettings>("/settings");

  return (
    <div className="space-y-6">
      <PageHeader title="Site settings" description="Text and details used across the website. Changes go live immediately." />
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!data && !error ? <LoadingState /> : null}
      {data
        ? sections.map((section) => (
            <SectionForm
              key={section.key}
              section={section}
              values={data[section.key] as Record<string, string>}
              onSaved={(next) => setData(() => next)}
            />
          ))
        : null}
    </div>
  );
}

function SectionForm({
  section,
  values: initial,
  onSaved,
}: {
  section: (typeof sections)[number];
  values: Record<string, string>;
  onSaved: (settings: SiteSettings) => void;
}) {
  const toast = useToast();
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const dirty = section.fields.some((field) => values[field.key] !== initial[field.key]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const saved = await api<SiteSettings>("/settings", { method: "PUT", json: { [section.key]: values } });
      setValues(saved[section.key] as Record<string, string>);
      onSaved(saved);
      toast(`${section.title} saved`);
    } catch (saveError) {
      toast((saveError as Error).message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-navy">{section.title}</h2>
          <p className="mt-0.5 text-sm text-muted">{section.description}</p>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          {section.fields.map((field) => (
            <Field key={field.key} label={field.label} hint={field.hint} className={field.wide ? "sm:col-span-2" : ""}>
              {field.multiline ? (
                <Textarea
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  maxLength={2000}
                  className="min-h-24"
                />
              ) : (
                <Input
                  type={field.type ?? "text"}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  maxLength={1000}
                />
              )}
            </Field>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-line px-5 py-3 sm:px-6">
          {dirty ? (
            <Button variant="ghost" onClick={() => setValues(initial)}>
              Discard
            </Button>
          ) : null}
          <Button type="submit" busy={busy} disabled={!dirty}>
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
}
