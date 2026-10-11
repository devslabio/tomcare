"use client";

import { useState } from "react";

import { Field, FormError, formValues, Honeypot, Sent, SubmitButton, TextArea, useSubmit } from "./form-kit";

const subjects = ["I need help", "I want to volunteer", "Donations", "Partnership", "Media", "Something else"];

export function ContactForm() {
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
      <Sent title="Thank you — we’ve received your message." onReset={() => setStatus({ state: "idle" })} resetLabel="Send another message">
        Someone from our team will reply by email or phone, usually within two working days.
      </Sent>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">What is your message about?</legend>
        <div className="flex flex-wrap gap-2">
          {subjects.map((option) => {
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
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" maxLength={30} />
      <TextArea label="Message" name="message" required minLength={5} placeholder="How can we help?" />
      <Honeypot />
      <FormError status={status} />
      <SubmitButton status={status}>Send message</SubmitButton>
    </form>
  );
}
