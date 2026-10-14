"use client";

import { Users } from "lucide-react";

import { FrenchFields, FrenchSection, optional, type FrenchValues } from "@/components/admin/editor-kit";
import { OrderedListPage } from "@/components/admin/ordered-list-page";
import { Field, ImageField, Input, Select, Textarea } from "@/components/admin/ui";
import { Avatar } from "@/components/ui";
import type { TeamGroup, TeamMember } from "@/lib/admin-types";

const groups: Record<TeamGroup, string> = { BOARD: "Leadership", STAFF: "Staff", VOLUNTEER: "Volunteer lead" };

type Form = { name: string; role: string; bio: string; photo: string; group: TeamGroup; visible: boolean; fr: FrenchValues };

export default function TeamAdminPage() {
  return (
    <OrderedListPage<TeamMember, Form>
      path="/team"
      title="Team"
      description="People shown on the Team and About pages, grouped by role and in this order."
      noun="team member"
      icon={Users}
      viewHref="/team"
      toForm={(row) => ({
        name: row?.name ?? "",
        role: row?.role ?? "",
        bio: row?.bio ?? "",
        photo: row?.photo ?? "",
        group: row?.group ?? "STAFF",
        visible: row?.visible ?? true,
        fr: row?.fr ?? {},
      })}
      toPayload={(form) => ({ ...form, photo: optional(form.photo), bio: form.bio })}
      preview={(row) => ({
        title: row.name,
        subtitle: `${row.role} · ${groups[row.group]}`,
        media: <Avatar name={row.name} photo={row.photo} className="size-11 text-sm" />,
      })}
      fields={(form, set) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} required minLength={2} maxLength={120} />
            </Field>
            <Field label="Role">
              <Input value={form.role} onChange={(e) => set("role", e.target.value)} required minLength={2} maxLength={120} placeholder="e.g. Volunteer coordinator" />
            </Field>
          </div>
          <Field label="Group">
            <Select value={form.group} onChange={(e) => set("group", e.target.value as TeamGroup)}>
              {Object.entries(groups).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Short bio" hint="Optional. Two or three sentences.">
            <Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} maxLength={1500} className="min-h-24" />
          </Field>
          <FrenchSection>
            <FrenchFields
              value={form.fr}
              onChange={(fr) => set("fr", fr)}
              fields={[
                { key: "role", label: "Role", max: 120, english: form.role, wide: true },
                { key: "bio", label: "Short bio", max: 1500, english: form.bio, kind: "long" },
              ]}
            />
          </FrenchSection>
          <ImageField
            label="Photo"
            value={form.photo}
            onChange={(url) => set("photo", url)}
            aspect="aspect-square"
            hint="Optional — initials are shown without one. Use a real photo of this person only."
          />
        </>
      )}
    />
  );
}
