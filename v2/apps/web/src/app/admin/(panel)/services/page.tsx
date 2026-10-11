"use client";

import { ListChecks } from "lucide-react";

import { IconPicker, Section } from "@/components/admin/editor-kit";
import { OrderedListPage } from "@/components/admin/ordered-list-page";
import { Field, Input, Textarea } from "@/components/admin/ui";
import type { Service } from "@/lib/admin-types";
import { Icon } from "@/lib/icons";

export default function ServicesAdminPage() {
  return (
    <OrderedListPage<Service, { title: string; description: string; icon: string; visible: boolean }>
      path="/services"
      title="Everyday services"
      description="The free drop-in services listed on the home and Programs pages, in this order."
      noun="service"
      icon={ListChecks}
      viewHref="/programs#services"
      toForm={(row) => ({
        title: row?.title ?? "",
        description: row?.description ?? "",
        icon: row?.icon ?? "file-text",
        visible: row?.visible ?? true,
      })}
      toPayload={(form) => form}
      preview={(row) => ({
        title: row.title,
        subtitle: row.description,
        media: (
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-sand text-navy">
            <Icon name={row.icon} className="size-5" />
          </span>
        ),
      })}
      fields={(form, set) => (
        <>
          <Field label="Name">
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required minLength={2} maxLength={120} />
          </Field>
          <Field label="Short description">
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
              minLength={2}
              maxLength={300}
              className="min-h-20"
            />
          </Field>
          <Section title="Icon">
            <IconPicker value={form.icon} onChange={(icon) => set("icon", icon)} />
          </Section>
        </>
      )}
    />
  );
}
