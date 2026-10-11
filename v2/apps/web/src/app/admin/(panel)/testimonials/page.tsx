"use client";

import { Quote } from "lucide-react";

import { optional } from "@/components/admin/editor-kit";
import { OrderedListPage } from "@/components/admin/ordered-list-page";
import { Field, ImageField, Input, Textarea } from "@/components/admin/ui";
import { Avatar } from "@/components/ui";
import type { Testimonial } from "@/lib/admin-types";

type Form = { quote: string; name: string; role: string; photo: string; visible: boolean };

export default function TestimonialsAdminPage() {
  return (
    <OrderedListPage<Testimonial, Form>
      path="/testimonials"
      title="Testimonials"
      description="Quotes on the home page. The first one is shown large. Only publish quotes people have agreed to share."
      noun="testimonial"
      icon={Quote}
      toForm={(row) => ({
        quote: row?.quote ?? "",
        name: row?.name ?? "",
        role: row?.role ?? "",
        photo: row?.photo ?? "",
        visible: row?.visible ?? true,
      })}
      toPayload={(form) => ({ ...form, photo: optional(form.photo) })}
      preview={(row) => ({
        title: `“${row.quote}”`,
        subtitle: `${row.name} · ${row.role}`,
        media: <Avatar name={row.name} photo={row.photo} className="size-11 text-sm" />,
      })}
      fields={(form, set) => (
        <>
          <Field label="Quote">
            <Textarea value={form.quote} onChange={(e) => set("quote", e.target.value)} required minLength={10} maxLength={1000} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" hint="A first name and initial is fine for privacy.">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} required minLength={2} maxLength={120} />
            </Field>
            <Field label="Who they are">
              <Input value={form.role} onChange={(e) => set("role", e.target.value)} required minLength={2} maxLength={120} placeholder="e.g. Newcomer and mother of two" />
            </Field>
          </div>
          <ImageField label="Photo" value={form.photo} onChange={(url) => set("photo", url)} aspect="aspect-square" hint="Optional — initials are shown without one." />
        </>
      )}
    />
  );
}
