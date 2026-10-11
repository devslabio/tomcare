"use client";

import { UserRoundCog } from "lucide-react";

import { LinesEditor } from "@/components/admin/editor-kit";
import { OrderedListPage } from "@/components/admin/ordered-list-page";
import { Field, Input, Textarea } from "@/components/admin/ui";
import type { VolunteerRole } from "@/lib/admin-types";

type Form = { title: string; description: string; commitment: string; location: string; skills: string[]; visible: boolean };

export default function VolunteerRolesAdminPage() {
  return (
    <OrderedListPage<VolunteerRole, Form>
      path="/volunteer-roles"
      title="Volunteer roles"
      description="Open roles on the Volunteer page. Applicants can pick one of these on the form."
      noun="volunteer role"
      icon={UserRoundCog}
      viewHref="/volunteer"
      toForm={(row) => ({
        title: row?.title ?? "",
        description: row?.description ?? "",
        commitment: row?.commitment ?? "",
        location: row?.location ?? "",
        skills: row?.skills ?? [],
        visible: row?.visible ?? true,
      })}
      toPayload={(form) => ({ ...form, skills: form.skills.map((skill) => skill.trim()).filter(Boolean) })}
      preview={(row) => ({ title: row.title, subtitle: `${row.commitment} · ${row.location}` })}
      fields={(form, set) => (
        <>
          <Field label="Role">
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required minLength={2} maxLength={120} />
          </Field>
          <Field label="What volunteers do">
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} required minLength={5} maxLength={500} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Time commitment">
              <Input value={form.commitment} onChange={(e) => set("commitment", e.target.value)} required minLength={2} maxLength={80} placeholder="e.g. 3 hours a week" />
            </Field>
            <Field label="Where">
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} required minLength={2} maxLength={80} placeholder="e.g. Montréal or remote" />
            </Field>
          </div>
          <Field label="Helpful skills">
            <LinesEditor value={form.skills} onChange={(skills) => set("skills", skills)} max={8} maxLength={40} addLabel="Add skill" />
          </Field>
        </>
      )}
    />
  );
}
