"use client";

import { useI18n } from "../i18n-provider";
import { Field, FormError, formValues, Honeypot, SelectField, Sent, SubmitButton, TextArea, useSubmit } from "./form-kit";

export function VolunteerForm({ roles }: { roles: string[] }) {
  const { t } = useI18n();
  const copy = t.forms.volunteer;
  const { status, setStatus, submit } = useSubmit("volunteers");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (await submit(formValues(form))) form.reset();
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.forms.name} name="name" required autoComplete="name" />
        <Field label={t.forms.email} name="email" type="email" required autoComplete="email" />
        <Field label={t.forms.phone} name="phone" type="tel" autoComplete="tel" maxLength={30} />
        <SelectField
          label={copy.role}
          name="role"
          options={[...roles.map((role) => ({ value: role, label: role })), { value: "Not sure yet", label: copy.notSure }]}
        />
      </div>
      <Field
        label={copy.availability}
        name="availability"
        placeholder={copy.availabilityPlaceholder}
        maxLength={300}
      />
      <TextArea label={copy.experience} name="experience" rows={3} maxLength={3000} />
      <TextArea label={copy.message} name="message" rows={3} maxLength={3000} />
      <Honeypot />
      <FormError status={status} />
      <SubmitButton status={status}>{copy.submit}</SubmitButton>
    </form>
  );
}
