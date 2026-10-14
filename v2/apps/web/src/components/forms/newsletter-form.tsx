"use client";

import { ArrowRight, Check, Loader2 } from "lucide-react";

import { useI18n } from "../i18n-provider";
import { formValues, Honeypot, useSubmit } from "./form-kit";

export function NewsletterForm() {
  const { t } = useI18n();
  const copy = t.forms.newsletter;
  const { status, submit } = useSubmit("subscribe");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (await submit(formValues(form))) form.reset();
  }

  if (status.state === "sent") {
    return (
      <p className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-white" role="status">
        <Check className="size-5 text-gold" aria-hidden />
        {copy.done}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="newsletter-email" className="sr-only">
        {copy.label}
      </label>
      <div className="flex rounded-full border border-white/15 bg-white/5 p-1.5 focus-within:border-gold/60">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={copy.placeholder}
          className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-gold px-5 text-sm font-bold text-ink transition hover:bg-[#f0bb2e] disabled:opacity-60"
        >
          {status.state === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {copy.submit}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
      <Honeypot />
      {status.state === "error" ? (
        <p className="mt-3 text-sm text-red-300" role="alert">
          {status.message}
        </p>
      ) : (
        <p className="mt-3 text-sm text-white/75">{copy.note}</p>
      )}
    </form>
  );
}
