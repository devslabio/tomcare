"use client";

import { Handshake } from "lucide-react";

import { FrenchFields, FrenchSection, optional, type FrenchValues } from "@/components/admin/editor-kit";
import { OrderedListPage } from "@/components/admin/ordered-list-page";
import { Field, ImageField, Input, Textarea } from "@/components/admin/ui";
import type { Partner } from "@/lib/admin-types";

type Form = { name: string; logoUrl: string; website: string; description: string; visible: boolean; fr: FrenchValues };

export default function PartnersAdminPage() {
  return (
    <OrderedListPage<Partner, Form>
      path="/partners"
      title="Partners"
      description="Organizations that work with us. Shown on the About page when at least one is visible."
      noun="partner"
      icon={Handshake}
      toForm={(row) => ({
        name: row?.name ?? "",
        logoUrl: row?.logoUrl ?? "",
        website: row?.website ?? "",
        description: row?.description ?? "",
        visible: row?.visible ?? true,
        fr: row?.fr ?? {},
      })}
      toPayload={(form) => ({
        name: form.name,
        logoUrl: optional(form.logoUrl),
        website: optional(form.website),
        description: optional(form.description),
        visible: form.visible,
        fr: form.fr,
      })}
      preview={(row) => ({
        title: row.name,
        subtitle: row.website ?? row.description ?? undefined,
        media: (
          <span className="flex h-11 w-16 items-center justify-center overflow-hidden rounded-lg border border-line bg-white">
            {row.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.logoUrl} alt="" className="max-h-9 max-w-14 object-contain" />
            ) : (
              <Handshake className="size-5 text-navy/40" aria-hidden />
            )}
          </span>
        ),
      })}
      fields={(form, set) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} required maxLength={120} />
            </Field>
            <Field label="Website">
              <Input type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
            </Field>
          </div>
          <Field label="Description" hint="Optional. What you do together.">
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={400} className="min-h-20" />
          </Field>
          <FrenchSection>
            <FrenchFields
              value={form.fr}
              onChange={(fr) => set("fr", fr)}
              fields={[{ key: "description", label: "Description", max: 400, english: form.description, kind: "long" }]}
            />
          </FrenchSection>
          <ImageField label="Logo" value={form.logoUrl} onChange={(url) => set("logoUrl", url)} aspect="aspect-[3/2]" contain />
        </>
      )}
    />
  );
}
