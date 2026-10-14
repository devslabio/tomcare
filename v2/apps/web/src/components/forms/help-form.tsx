"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { helpNeeds, languages } from "@/lib/site";
import { useI18n } from "../i18n-provider";
import { Field, FormError, formValues, Honeypot, SelectField, Sent, SubmitButton, TextArea, useSubmit } from "./form-kit";

export function HelpForm() {
  const { t } = useI18n();
  const copy = t.forms.help;
  const { status, setStatus, submit } = useSubmit("assistance");
  const [needs, setNeeds] = useState<string[]>([]);

  const toggle = (need: string) =>
    setNeeds((current) => (current.includes(need) ? current.filter((item) => item !== need) : [...current, need]));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (await submit({ ...formValues(form), needs })) {
      form.reset();
      setNeeds([]);
    }
  }

  if (status.state === "sent") {
    return (
      <Sent title={copy.sentTitle} onReset={() => setStatus({ state: "idle" })} resetLabel={copy.again}>
        {copy.sentText}
      </Sent>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">
          {copy.needsLegend} <span className="font-normal text-muted">{copy.needsHint}</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {helpNeeds.map((need) => {
            const selected = needs.includes(need);
            return (
              <button
                key={need}
                type="button"
                onClick={() => toggle(need)}
                aria-pressed={selected}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  selected ? "border-indigo bg-indigo/[0.06] text-ink" : "border-line bg-white text-ink/75 hover:border-ink/30"
                }`}
              >
                <span
                  className={`inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition ${
                    selected ? "border-indigo bg-indigo text-white" : "border-ink/20"
                  }`}
                >
                  {selected ? <Check className="size-3.5" aria-hidden /> : null}
                </span>
                {t.forms.needs[need]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.forms.name} name="name" required autoComplete="name" />
        <Field label={t.forms.email} name="email" type="email" required autoComplete="email" />
        <Field label={t.forms.phone} name="phone" type="tel" autoComplete="tel" maxLength={30} hint={copy.phoneHint} />
        <Field label={copy.city} name="city" autoComplete="address-level2" maxLength={120} />
      </div>
      <SelectField
        label={copy.language}
        name="language"
        options={languages.map((language) => ({ value: language, label: t.forms.languages[language] }))}
      />
      <TextArea
        label={copy.story}
        name="story"
        required
        minLength={10}
        rows={6}
        placeholder={copy.storyPlaceholder}
      />
      <Honeypot />
      <FormError status={status} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SubmitButton status={status}>{copy.submit}</SubmitButton>
        <p className="text-sm leading-6 text-muted">{copy.note}</p>
      </div>
    </form>
  );
}
