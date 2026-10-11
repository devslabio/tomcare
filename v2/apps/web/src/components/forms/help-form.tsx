"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { helpNeeds, languages } from "@/lib/site";
import { Field, FormError, formValues, Honeypot, SelectField, Sent, SubmitButton, TextArea, useSubmit } from "./form-kit";

export function HelpForm() {
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
      <Sent title="We’ve received your request." onReset={() => setStatus({ state: "idle" })} resetLabel="Send another request">
        A member of our team will contact you soon — usually within two working days — to talk about what you need. Everything you
        shared stays confidential.
      </Sent>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">
          What do you need help with? <span className="font-normal text-muted">Choose all that apply.</span>
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
                {need}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" maxLength={30} hint="We’ll call you if you prefer." />
        <Field label="City or neighbourhood" name="city" autoComplete="address-level2" maxLength={120} />
      </div>
      <SelectField label="Preferred language" name="language" options={languages} />
      <TextArea
        label="Tell us a little about your situation"
        name="story"
        required
        minLength={10}
        rows={6}
        placeholder="For example: when you arrived, who is with you, and what would make the biggest difference right now."
      />
      <Honeypot />
      <FormError status={status} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SubmitButton status={status}>Send my request</SubmitButton>
        <p className="text-xs leading-5 text-muted">Free and confidential. We only use your details to contact you about your request.</p>
      </div>
    </form>
  );
}
