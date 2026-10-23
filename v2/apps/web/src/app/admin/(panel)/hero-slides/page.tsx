"use client";

import { GalleryHorizontal } from "lucide-react";

import { FrenchFields, FrenchSection, type FrenchValues } from "@/components/admin/editor-kit";
import { OrderedListPage } from "@/components/admin/ordered-list-page";
import { Field, ImageField, Input, Textarea } from "@/components/admin/ui";
import { stripStars } from "@/components/highlight";
import { Photo } from "@/components/photo";
import type { HeroSlide } from "@/lib/admin-types";

type Form = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  visible: boolean;
  fr: FrenchValues;
};

const highlightHint = "Wrap words in *stars* to show them in the gold italic accent.";

export default function HeroSlidesAdminPage() {
  return (
    <OrderedListPage<HeroSlide, Form>
      path="/hero-slides"
      title="Home slideshow"
      description="The photos and headlines that rotate at the top of the home page, in this order. The first slide is shown first and is the page’s main headline. Keep three to five."
      noun="slide"
      icon={GalleryHorizontal}
      viewHref="/"
      toForm={(row) => ({
        eyebrow: row?.eyebrow ?? "",
        title: row?.title ?? "",
        subtitle: row?.subtitle ?? "",
        image: row?.image ?? "",
        imageAlt: row?.imageAlt ?? "",
        ctaLabel: row?.ctaLabel ?? "",
        ctaHref: row?.ctaHref ?? "",
        visible: row?.visible ?? true,
        fr: row?.fr ?? {},
      })}
      toPayload={(form) => ({ ...form, ctaHref: form.ctaLabel.trim() ? form.ctaHref : "" })}
      preview={(row) => ({
        title: stripStars(row.title),
        subtitle: [row.eyebrow, row.ctaLabel ? `Button: ${row.ctaLabel} → ${row.ctaHref}` : "No button"].filter(Boolean).join(" · "),
        media: (
          <span className="relative block h-12 w-20 overflow-hidden rounded-lg bg-sand">
            <Photo src={row.image} alt="" fill sizes="80px" className="object-cover" />
          </span>
        ),
      })}
      fields={(form, set) => (
        <>
          <ImageField
            label="Photo"
            value={form.image}
            onChange={(url) => set("image", url)}
            aspect="aspect-[16/9]"
            hint="Landscape, at least 2400 px wide. Keep faces to the right — the text sits on the left."
          />
          <Field label="Photo description" hint="For people using screen readers, e.g. “Volunteers sorting winter coats”.">
            <Input value={form.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} maxLength={200} />
          </Field>
          <Field label="Small line above" hint="e.g. Programs, Give things, Montréal · Since 2024">
            <Input value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} maxLength={80} />
          </Field>
          <Field label="Headline" hint={highlightHint}>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required minLength={3} maxLength={160} />
          </Field>
          <Field label="Supporting text" hint="One or two sentences. Hidden on phones to keep the slide short.">
            <Textarea value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} maxLength={400} className="min-h-20" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Button label" hint="Optional. Leave empty for no button.">
              <Input value={form.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} maxLength={40} placeholder="e.g. Explore our programs" />
            </Field>
            <Field label="Button link" hint="A page on the site, e.g. /programs or /donate#give-things">
              <Input
                value={form.ctaHref}
                onChange={(e) => set("ctaHref", e.target.value)}
                required={Boolean(form.ctaLabel.trim())}
                disabled={!form.ctaLabel.trim()}
                placeholder="/programs"
              />
            </Field>
          </div>
          <FrenchSection>
            <FrenchFields
              value={form.fr}
              onChange={(fr) => set("fr", fr)}
              fields={[
                { key: "eyebrow", label: "Small line above", max: 80, english: form.eyebrow },
                { key: "ctaLabel", label: "Button label", max: 40, english: form.ctaLabel },
                { key: "title", label: "Headline", max: 160, english: form.title, wide: true },
                { key: "subtitle", label: "Supporting text", max: 400, english: form.subtitle, kind: "long" },
                { key: "imageAlt", label: "Photo description", max: 200, english: form.imageAlt, wide: true },
              ]}
            />
          </FrenchSection>
        </>
      )}
    />
  );
}
