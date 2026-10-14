"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

import { useI18n } from "../i18n-provider";

export type Status = { state: "idle" } | { state: "sending" } | { state: "sent" } | { state: "error"; message: string };

/** Posts JSON to a public API endpoint and turns API errors into readable messages. */
export function useSubmit(path: string) {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function submit(body: Record<string, unknown>) {
    setStatus({ state: "sending" });
    try {
      const response = await fetch(`/v1/public/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 429) throw new Error(t.forms.tooMany);
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string | string[] };
        throw new Error(Array.isArray(data.message) ? data.message.join(", ") : data.message || t.forms.failed);
      }
      setStatus({ state: "sent" });
      return true;
    } catch (error) {
      setStatus({ state: "error", message: (error as Error).message });
      return false;
    }
  }

  return { status, setStatus, submit };
}

/** Reads a form into plain strings, dropping empty optional fields. */
export function formValues(form: HTMLFormElement) {
  const values: Record<string, string> = {};
  for (const [key, value] of new FormData(form)) {
    if (typeof value === "string" && value.trim()) values[key] = value.trim();
  }
  return values;
}

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/35 focus:border-indigo focus:ring-4 focus:ring-indigo/10";

export function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  hint,
  maxLength = 200,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={maxLength}
        defaultValue={defaultValue}
        className={inputClass}
      />
      {hint ? <span className="mt-1.5 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  name,
  required,
  placeholder,
  rows = 5,
  maxLength = 5000,
  minLength,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
}) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        minLength={minLength}
        className={`${inputClass} resize-y`}
      />
    </label>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  const { t } = useI18n();
  return (
    <span className="mb-1.5 block text-sm font-semibold text-ink">
      {label}
      {required ? <span className="text-gold-deep"> *</span> : <span className="font-normal text-muted"> {t.forms.optional}</span>}
    </span>
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue = "",
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  const { t } = useI18n();
  return (
    <label className="block">
      <FieldLabel label={label} />
      <span className="relative block">
        <select name={name} defaultValue={defaultValue} className={`${inputClass} pr-10`}>
          <option value="">{t.forms.choose}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
        </svg>
      </span>
    </label>
  );
}

/** Invisible to people; bots fill it in and the API quietly discards the submission. */
export function Honeypot() {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />;
}

export function FormError({ status }: { status: Status }) {
  if (status.state !== "error") return null;
  return (
    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      {status.message}
    </p>
  );
}

export function SubmitButton({ status, children }: { status: Status; children: React.ReactNode }) {
  const { t } = useI18n();
  const busy = status.state === "sending";
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-indigo px-8 text-base font-semibold text-white shadow-[0_14px_36px_-12px_rgba(45,56,138,0.7)] transition hover:bg-indigo-deep disabled:opacity-60 sm:w-auto"
    >
      {busy ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
      {busy ? t.forms.sending : children}
    </button>
  );
}

export function Sent({ title, children, onReset, resetLabel }: { title: string; children: React.ReactNode; onReset: () => void; resetLabel: string }) {
  return (
    <div className="flex flex-col items-start rounded-[28px] border border-line bg-white p-8 sm:p-10" role="status">
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-gold-soft text-gold-deep">
        <CheckCircle2 className="size-7" aria-hidden />
      </span>
      <h3 className="font-display mt-6 text-2xl text-ink">{title}</h3>
      <div className="mt-3 max-w-md text-[15px] leading-7 text-muted">{children}</div>
      <button type="button" onClick={onReset} className="mt-6 text-sm font-semibold text-indigo underline underline-offset-4">
        {resetLabel}
      </button>
    </div>
  );
}
