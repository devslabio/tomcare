"use client";

import { useState } from "react";

import { contactSubjects } from "@/lib/site";
import { useI18n } from "../i18n-provider";
import { Field, FormError, formValues, Honeypot, Sent, SubmitButton, TextArea, useSubmit } from "./form-kit";

export function ContactForm() {
  const { t } = useI18n();
  const copy = t.forms.contact;
  const { status, setStatus, submit } = useSubmit("messages");
  const [subject, setSubject] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = formValues(form);
    if (await submit({ ...values, subject: subject || undefined })) {
      form.reset();
      setSubject("");
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
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">{copy.subjectLegend}</legend>
        <div className="flex flex-wrap gap-2">
          {contactSubjects.map((option) => {
            const selected = subject === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setSubject(selected ? "" : option)}
                aria-pressed={selected}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selected ? "border-transparent bg-ink text-white" : "border-line bg-white text-ink/75 hover:border-ink/30"
                }`}
              >
                {t.forms.subjects[option]}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.forms.name} name="name" required autoComplete="name" />
        <Field label={t.forms.email} name="email" type="email" required autoComplete="email" />
      </div>
      <Field label={t.forms.phone} name="phone" type="tel" autoComplete="tel" maxLength={30} />
      <TextArea label={copy.message} name="message" required minLength={5} placeholder={copy.messagePlaceholder} />
      <Honeypot />
      <FormError status={status} />
      <SubmitButton status={status}>{copy.submit}</SubmitButton>
    </form>
  );
}
