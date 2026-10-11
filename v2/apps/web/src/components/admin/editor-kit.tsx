"use client";

import { Plus, X } from "lucide-react";

import { moveItem, ReorderButtons } from "@/components/admin/reorder";
import { Button, Card, Input } from "@/components/admin/ui";
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

/** Turns empty strings into undefined so optional API fields are skipped instead of rejected. */
export function optional(value: string) {
  return value.trim() ? value.trim() : undefined;
}
