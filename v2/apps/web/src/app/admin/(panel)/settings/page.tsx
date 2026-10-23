"use client";

import { useState } from "react";
import { useToast } from "@/components/admin/toast";
import { Button, Card, ErrorState, Field, Input, LoadingState, PageHeader, Textarea } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { SiteSettings } from "@/lib/admin-types";

type Section = keyof SiteSettings;
type FieldSpec = {
  key: string;
  label: string;
  hint?: string;
  type?: string;
  multiline?: boolean;
  wide?: boolean;
  /** Setting whose English text is shown as the placeholder of a French field. */
  english?: [Exclude<Section, "fr">, string];
};

const highlightHint = "Wrap words in *stars* to show them in the gold italic accent.";

const statFields = [1, 2, 3, 4].flatMap((n) => [
  { key: `stat${n}Value`, label: `Figure ${n}`, hint: n === 1 ? "e.g. 173 or 10+" : undefined },
  { key: `stat${n}Label`, label: `Label ${n}`, hint: n === 1 ? "e.g. newcomers welcomed in 2024" : undefined },
]);

const sections: { key: Section; title: string; description: string; fields: FieldSpec[] }[] = [
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
      { key: "quoteAuthor", label: "Quote by", hint: "Who said the quote, e.g. Muhammad Ali" },
      { key: "representative", label: "Founder name and title", hint: "e.g. Tom Ntambara, Founder" },
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
      { key: "donationUrl", label: "Online donation link", type: "url", hint: "Only shown while card payments (Stripe) aren't set up. e.g. CanadaHelps or Zeffy page." },
      { key: "charityNumber", label: "Charity registration number", hint: "Only once the CRA has issued one. Empty hides it." },
      { key: "dropOffDays", label: "Goods drop-off times", multiline: true, hint: "One per line: Day · time · note" },
      { key: "recognition", label: "Thank-you note", multiline: true, wide: true },
    ],
  },
  {
    key: "fr",
    title: "Français",
    description: "The French version of the text above, shown on the French site. Leave a field empty to show the English text there.",
    fields: [
      { key: "aboutHeadline", label: "About: headline", hint: highlightHint, english: ["about", "headline"], wide: true },
      { key: "aboutIntro", label: "About: introduction", multiline: true, english: ["about", "intro"], wide: true },
      { key: "aboutStory", label: "About: our story", multiline: true, english: ["about", "story"], wide: true },
      { key: "aboutVision", label: "About: vision", multiline: true, english: ["about", "vision"] },
      { key: "aboutMission", label: "About: mission", multiline: true, english: ["about", "mission"] },
      { key: "aboutQuote", label: "About: quote", multiline: true, english: ["about", "quote"], wide: true },
      { key: "aboutRepresentative", label: "About: founder name and title", english: ["about", "representative"], wide: true },
      ...[1, 2, 3, 4].map((n) => ({ key: `stat${n}Label`, label: `Key figure ${n}: label`, english: ["stats", `stat${n}Label`] as FieldSpec["english"] })),
      { key: "donateHeadline", label: "Donations: headline", hint: highlightHint, english: ["donate", "headline"], wide: true },
      { key: "donateIntro", label: "Donations: introduction", multiline: true, english: ["donate", "intro"], wide: true },
      { key: "donateDropOffDays", label: "Donations: drop-off times", multiline: true, hint: "One per line: Day · time · note", english: ["donate", "dropOffDays"] },
      { key: "donateRecognition", label: "Donations: thank-you note", multiline: true, english: ["donate", "recognition"] },
      { key: "contactAddress", label: "Contact: address", english: ["contact", "address"] },
      { key: "contactHours", label: "Contact: opening hours", multiline: true, english: ["contact", "hours"] },
    ],
  },
];

export default function SettingsPage() {
  const { data, error, reload, setData } = useResource<SiteSettings>("/settings");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site settings"
        description="Text and details used across the website. Changes go live immediately. The home page headlines are edited under Home slideshow."
      />
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!data && !error ? <LoadingState /> : null}
      {data
        ? sections.map((section) => (
            <SectionForm
              key={section.key}
              section={section}
              values={data[section.key] as Record<string, string>}
              settings={data}
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
  settings,
  onSaved,
}: {
  section: (typeof sections)[number];
  values: Record<string, string>;
  settings: SiteSettings;
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
          {section.fields.map((field) => {
            const placeholder = field.english ? (settings[field.english[0]] as Record<string, string>)[field.english[1]] : undefined;
            return (
            <Field key={field.key} label={field.label} hint={field.hint} className={field.wide ? "sm:col-span-2" : ""}>
              {field.multiline ? (
                <Textarea
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  maxLength={2000}
                  placeholder={placeholder}
                  className="min-h-24"
                />
              ) : (
                <Input
                  type={field.type ?? "text"}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  maxLength={1000}
                  placeholder={placeholder}
                />
              )}
            </Field>
            );
          })}
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
