"use client";

import { Plus, X } from "lucide-react";

import { moveItem, ReorderButtons } from "@/components/admin/reorder";
import { Button, Card, Field, Input, Textarea } from "@/components/admin/ui";
import { Icon, iconNames } from "@/lib/icons";

export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="font-semibold text-navy">{title}</h2>
        {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
      </div>
      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </Card>
  );
}

export function IconPicker({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 xl:grid-cols-5">
      {iconNames.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          aria-label={name}
          title={name}
          aria-pressed={value === name}
          className={`inline-flex aspect-square items-center justify-center rounded-xl border transition ${
            value === name ? "border-navy bg-navy text-white" : "border-line text-navy hover:bg-sand"
          }`}
        >
          <Icon name={name} className="size-5" />
        </button>
      ))}
    </div>
  );
}

/** Editable list of short lines (highlights, skills). */
export function LinesEditor({
  value,
  onChange,
  max,
  maxLength = 120,
  addLabel,
  placeholder,
}: {
  value: string[];
  onChange: (lines: string[]) => void;
  max: number;
  maxLength?: number;
  addLabel: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((line, index) => (
        <div key={index} className="flex items-center gap-2">
          <ReorderButtons index={index} count={value.length} onMove={(delta) => onChange(moveItem(value, index, delta))} />
          <Input
            value={line}
            onChange={(event) => onChange(value.map((item, i) => (i === index ? event.target.value : item)))}
            maxLength={maxLength}
            placeholder={placeholder}
            aria-label={`Line ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-sand hover:text-navy"
            aria-label={`Remove line ${index + 1}`}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      {value.length < max ? (
        <Button variant="secondary" size="sm" onClick={() => onChange([...value, ""])}>
          <Plus className="size-4" aria-hidden />
          {addLabel}
        </Button>
      ) : null}
    </div>
  );
}

export const markdownHint = (
  <>
    Leave a blank line between paragraphs. Start a line with <code>## </code> for a heading, <code>- </code> for a bullet, and write{" "}
    <code>**bold**</code> or <code>[link text](/contact)</code>.
  </>
);

const montrealClock = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "America/Toronto",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** ISO timestamp → value for <input type="datetime-local">, in Montréal time. */
export function toMontrealInput(iso: string | null | undefined) {
  if (!iso) return "";
  return montrealClock.format(new Date(iso)).replace(" ", "T");
}

/** <input type="datetime-local"> value read as Montréal time → ISO timestamp. */
export function fromMontrealInput(value: string) {
  if (!value) return undefined;
  const asUtc = Date.parse(`${value}:00Z`);
  const offsetAt = (time: number) => Date.parse(`${toMontrealInput(new Date(time).toISOString())}:00Z`) - time;
  const guess = asUtc - offsetAt(asUtc);
  return new Date(asUtc - offsetAt(guess)).toISOString();
}

export type FrenchValues = Record<string, unknown>;

export type FrenchField = {
  key: string;
  label: string;
  max: number;
  /** The English text, shown as a placeholder so translators can see what they are translating. */
  english?: string | string[] | null;
  kind?: "text" | "long" | "markdown" | "lines";
  wide?: boolean;
};

/** French versions of a record's text fields. Empty fields fall back to English on the French site. */
export function FrenchFields({
  fields,
  value,
  onChange,
}: {
  fields: FrenchField[];
  value: FrenchValues;
  onChange: (next: FrenchValues) => void;
}) {
  const set = (key: string, next: unknown) => onChange({ ...value, [key]: next });
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => {
        const kind = field.kind ?? "text";
        const english = Array.isArray(field.english) ? field.english.join(" · ") : (field.english ?? "");
        const wide = field.wide ?? kind !== "text";
        return (
          <Field key={field.key} label={field.label} hint={kind === "markdown" ? markdownHint : undefined} className={wide ? "sm:col-span-2" : ""}>
            {kind === "lines" ? (
              <LinesEditor
                value={(value[field.key] as string[] | undefined) ?? []}
                onChange={(lines) => set(field.key, lines)}
                max={12}
                maxLength={field.max}
                addLabel="Add line"
                placeholder={english || undefined}
              />
            ) : kind === "text" ? (
              <Input value={(value[field.key] as string | undefined) ?? ""} onChange={(e) => set(field.key, e.target.value)} maxLength={field.max} placeholder={english} lang="fr" />
            ) : (
              <Textarea
                value={(value[field.key] as string | undefined) ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
                maxLength={field.max}
                placeholder={english}
                lang="fr"
                className={kind === "markdown" ? "min-h-56 leading-7" : "min-h-20"}
              />
            )}
          </Field>
        );
      })}
    </div>
  );
}

export function FrenchSection({ children, description }: { children: React.ReactNode; description?: string }) {
  return (
    <Section title="Français" description={description ?? "Shown on the French site. Leave a field empty to show the English text there."}>
      {children}
    </Section>
  );
}

/** Turns empty strings into undefined so optional API fields are skipped instead of rejected. */
export function optional(value: string) {
  return value.trim() ? value.trim() : undefined;
}
