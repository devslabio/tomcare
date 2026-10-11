"use client";

import { Mail, Phone } from "lucide-react";
import { useState } from "react";

import { caseStatus } from "@/components/admin/status";
import { useToast } from "@/components/admin/toast";
import { Button, Card, Field, Select, Textarea } from "@/components/admin/ui";
import { api } from "@/lib/admin-api";
import type { CaseStatus } from "@/lib/admin-types";

export function StatusFilter<S extends string>({
  value,
  onChange,
  options,
}: {
  value: S | "";
  onChange: (value: S | "") => void;
  options: { value: S | ""; label: string }[];
}) {
  return (
    <div className="no-scrollbar flex max-w-full gap-1.5 overflow-x-auto">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => onChange(option.value)}
          className={`h-9 shrink-0 rounded-full px-4 text-sm font-medium transition ${
            value === option.value ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-line hover:bg-sand"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export const caseFilters: { value: CaseStatus | ""; label: string }[] = [
  { value: "", label: "Open" },
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "CLOSED", label: "Closed" },
  { value: "ARCHIVED", label: "Archived" },
];

export function ContactDetails({
  name,
  email,
  phone,
  extra = [],
}: {
  name: string;
  email: string;
  phone: string | null;
  extra?: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="space-y-4 rounded-2xl bg-sand p-5 text-sm">
      <div>
        <dt className="text-muted">Name</dt>
        <dd className="mt-0.5 font-semibold text-navy">{name}</dd>
      </div>
      <div>
        <dt className="text-muted">Email</dt>
        <dd className="mt-0.5">
          <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 break-all font-medium text-navy hover:underline">
            <Mail className="size-3.5 shrink-0" aria-hidden />
            {email}
          </a>
        </dd>
      </div>
      {phone ? (
        <div>
          <dt className="text-muted">Phone</dt>
          <dd className="mt-0.5">
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 font-medium text-navy hover:underline">
              <Phone className="size-3.5" aria-hidden />
              {phone}
            </a>
          </dd>
        </div>
      ) : null}
      {extra.map((item) => (
        <div key={item.label}>
          <dt className="text-muted">{item.label}</dt>
          <dd className="mt-0.5 font-medium text-navy">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Status and private notes for a help request or volunteer application. */
export function CasePanel<T extends { status: CaseStatus; notes: string }>({
  path,
  record,
  onSaved,
}: {
  path: string;
  record: T;
  onSaved: (record: T) => void;
}) {
  const toast = useToast();
  const [status, setStatus] = useState(record.status);
  const [notes, setNotes] = useState(record.notes);
  const [busy, setBusy] = useState(false);
  const dirty = status !== record.status || notes !== record.notes;

  async function save() {
    setBusy(true);
    try {
      const saved = await api<T>(path, { method: "PATCH", json: { status, notes } });
      onSaved(saved);
      toast("Saved");
    } catch (saveError) {
      toast((saveError as Error).message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="space-y-4 p-5">
      <Field label="Status">
        <Select value={status} onChange={(e) => setStatus(e.target.value as CaseStatus)}>
          {Object.entries(caseStatus).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Team notes" hint="Private — never shown to the person.">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={5000} className="min-h-32" placeholder="Calls made, next steps, who is following up…" />
      </Field>
      <Button onClick={save} busy={busy} disabled={!dirty} className="w-full">
        Save
      </Button>
    </Card>
  );
}
