"use client";

import { Field, FormError, formValues, Honeypot, SelectField, Sent, SubmitButton, TextArea, useSubmit } from "./form-kit";

export function VolunteerForm({ roles }: { roles: string[] }) {
  const { status, setStatus, submit } = useSubmit("volunteers");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (await submit(formValues(form))) form.reset();
  }

  if (status.state === "sent") {
    return (
      <Sent title="Thank you for offering your time." onReset={() => setStatus({ state: "idle" })} resetLabel="Send another application">
        Our volunteer coordinator will be in touch to arrange a short conversation and an orientation session.
      </Sent>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" maxLength={30} />
        <SelectField label="Role you’re interested in" name="role" options={[...roles, "Not sure yet"]} />
      </div>
      <Field
        label="When are you available?"
        name="availability"
        placeholder="e.g. Saturday mornings, two evenings a week"
        maxLength={300}
      />
      <TextArea label="Relevant experience or languages you speak" name="experience" rows={3} maxLength={3000} />
      <TextArea label="Anything else you’d like us to know" name="message" rows={3} maxLength={3000} />
      <Honeypot />
      <FormError status={status} />
      <SubmitButton status={status}>Apply to volunteer</SubmitButton>
    </form>
  );
}
