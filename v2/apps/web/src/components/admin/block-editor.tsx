"use client";

import {
  ChevronDown,
  Copy,
  GalleryHorizontalEnd,
  HelpCircle,
  Image as ImageIcon,
  LayoutGrid,
  Megaphone,
  Plus,
  Quote,
  Sigma,
  Trash2,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { markdownHint } from "@/components/admin/editor-kit";
import { moveItem, ReorderButtons } from "@/components/admin/reorder";
import { Button, Field, GalleryField, ImageField, Input, Select, Textarea } from "@/components/admin/ui";
import { blockTypes, newBlock, type Block, type BlockType } from "@/lib/blocks";
import { iconNames } from "@/lib/icons";

const MAX_BLOCKS = 60;

const blockIcons: Record<BlockType, LucideIcon> = {
  richText: Type,
  imageText: ImageIcon,
  cards: LayoutGrid,
  stats: Sigma,
  quote: Quote,
  faq: HelpCircle,
  gallery: GalleryHorizontalEnd,
  cta: Megaphone,
};

const labelOf = (type: BlockType) => blockTypes.find((entry) => entry.type === type)?.label ?? type;

function blockTitle(block: Block) {
  switch (block.type) {
    case "quote":
      return block.quote;
    case "gallery":
      return block.heading || `${block.images.length} photos`;
    default:
      return block.heading ?? "";
  }
}

export function BlockEditor({ value, onChange }: { value: Block[]; onChange: (blocks: Block[]) => void }) {
  const [open, setOpen] = useState<string | null>(value[0]?.id ?? null);
  const [picking, setPicking] = useState(false);

  const update = (index: number, block: Block) => onChange(value.map((current, i) => (i === index ? block : current)));

  function add(type: BlockType) {
    const block = newBlock(type);
    onChange([...value, block]);
    setOpen(block.id);
    setPicking(false);
  }

  function duplicate(index: number) {
    const copy = { ...structuredClone(value[index]), id: newBlock(value[index].type).id } as Block;
    onChange([...value.slice(0, index + 1), copy, ...value.slice(index + 1)]);
    setOpen(copy.id);
  }

  return (
    <div className="space-y-3">
      {value.length ? (
        <ol className="space-y-3">
          {value.map((block, index) => {
            const BlockIcon = blockIcons[block.type];
            const expanded = open === block.id;
            const title = blockTitle(block);
            return (
              <li key={block.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
                  <ReorderButtons index={index} count={value.length} onMove={(delta) => onChange(moveItem(value, index, delta))} />
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : block.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    aria-expanded={expanded}
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-sand text-navy">
                      <BlockIcon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted">{labelOf(block.type)}</span>
                      <span className="block truncate font-semibold text-navy">{title || <span className="font-normal text-muted">Untitled</span>}</span>
                    </span>
                    <ChevronDown className={`ml-auto size-4 shrink-0 text-muted transition ${expanded ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicate(index)}
                    disabled={value.length >= MAX_BLOCKS}
                    className="hidden size-8 items-center justify-center rounded-full text-muted hover:bg-sand hover:text-navy disabled:opacity-40 sm:inline-flex"
                    aria-label="Duplicate section"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Remove this ${labelOf(block.type).toLowerCase()} section?`)) {
                        onChange(value.filter((_, i) => i !== index));
                      }
                    }}
                    className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                    aria-label="Remove section"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                {expanded ? (
                  <div className="space-y-5 border-t border-line bg-[#fcfaf6] p-4 sm:p-5">
                    <BlockFields block={block} onChange={(next) => update(index, next)} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="rounded-2xl border border-dashed border-line px-5 py-8 text-center text-sm text-muted">
          This page has no sections yet. Add one to start building it.
        </p>
      )}

      {value.length < MAX_BLOCKS ? (
        picking ? (
          <div className="rounded-2xl border border-line bg-white p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-semibold text-navy">Add a section</p>
              <button type="button" onClick={() => setPicking(false)} className="text-muted hover:text-navy" aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {blockTypes.map((entry) => {
                const EntryIcon = blockIcons[entry.type];
                return (
                  <button
                    key={entry.type}
                    type="button"
                    onClick={() => add(entry.type)}
                    className="flex items-start gap-3 rounded-xl border border-line p-3 text-left transition hover:border-navy hover:bg-sand/50"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-sand text-navy">
                      <EntryIcon className="size-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-navy">{entry.label}</span>
                      <span className="block text-xs text-muted">{entry.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setPicking(true)}>
            <Plus className="size-4" aria-hidden />
            Add section
          </Button>
        )
      ) : null}
    </div>
  );
}

function ItemsEditor<T>({
  items,
  onChange,
  max,
  blank,
  noun,
  render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  max: number;
  blank: () => T;
  noun: string;
  render: (item: T, set: (patch: Partial<T>) => void, index: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex gap-3 rounded-xl border border-line bg-white p-3">
          <div className="flex flex-col items-center gap-1 pt-1">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-sand text-[11px] font-semibold text-navy">{index + 1}</span>
            <ReorderButtons index={index} count={items.length} onMove={(delta) => onChange(moveItem(items, index, delta))} />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            {render(item, (patch) => onChange(items.map((current, i) => (i === index ? { ...current, ...patch } : current))), index)}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-sand hover:text-navy"
            aria-label={`Remove ${noun} ${index + 1}`}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      {items.length < max ? (
        <Button variant="secondary" size="sm" onClick={() => onChange([...items, blank()])}>
          <Plus className="size-4" aria-hidden />
          Add {noun}
        </Button>
      ) : null}
    </div>
  );
}

const linkHint = "A page on this site like /donate, or a full https:// link.";

function BlockFields({ block, onChange }: { block: Block; onChange: (block: Block) => void }) {
  const patch = (fields: Partial<Block>) => onChange({ ...block, ...fields } as Block);

  switch (block.type) {
    case "richText":
      return (
        <>
          <Field label="Heading" hint="Optional.">
            <Input value={block.heading ?? ""} onChange={(e) => patch({ heading: e.target.value })} maxLength={160} />
          </Field>
          <Field label="Text" hint={markdownHint}>
            <Textarea value={block.body} onChange={(e) => patch({ body: e.target.value })} required maxLength={20000} className="min-h-56 leading-7" />
          </Field>
        </>
      );
    case "imageText":
      return (
        <>
          <div className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <Field label="Small label" hint="Optional, above the heading.">
              <Input value={block.eyebrow ?? ""} onChange={(e) => patch({ eyebrow: e.target.value })} maxLength={60} />
            </Field>
            <Field label="Heading">
              <Input value={block.heading} onChange={(e) => patch({ heading: e.target.value })} required maxLength={160} />
            </Field>
          </div>
          <Field label="Text" hint={markdownHint}>
            <Textarea value={block.body} onChange={(e) => patch({ body: e.target.value })} required maxLength={5000} className="min-h-36" />
          </Field>
          <ImageField label="Photo" value={block.image} onChange={(image) => patch({ image })} aspect="aspect-[4/3]" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Photo side">
              <Select value={block.imageSide ?? "right"} onChange={(e) => patch({ imageSide: e.target.value as "left" | "right" })}>
                <option value="right">Right</option>
                <option value="left">Left</option>
              </Select>
            </Field>
            <Field label="Button text" hint="Optional.">
              <Input value={block.buttonLabel ?? ""} onChange={(e) => patch({ buttonLabel: e.target.value })} maxLength={40} />
            </Field>
            <Field label="Button link" hint={linkHint}>
              <Input value={block.buttonHref ?? ""} onChange={(e) => patch({ buttonHref: e.target.value })} placeholder="/contact" />
            </Field>
          </div>
        </>
      );
    case "cards":
      return (
        <>
          <Field label="Heading" hint="Optional.">
            <Input value={block.heading ?? ""} onChange={(e) => patch({ heading: e.target.value })} maxLength={160} />
          </Field>
          <Field label="Introduction" hint="Optional.">
            <Textarea value={block.intro ?? ""} onChange={(e) => patch({ intro: e.target.value })} maxLength={600} className="min-h-20" />
          </Field>
          <ItemsEditor
            items={block.items}
            onChange={(items) => patch({ items })}
            max={12}
            noun="card"
            blank={() => ({ icon: "heart-handshake", title: "", text: "" })}
            render={(item, set) => (
              <>
                <div className="grid gap-2 sm:grid-cols-[11rem_minmax(0,1fr)]">
                  <Select value={item.icon ?? ""} onChange={(e) => set({ icon: e.target.value || undefined })} aria-label="Icon">
                    <option value="">No icon</option>
                    {iconNames.map((name) => (
                      <option key={name} value={name}>
                        {name.replaceAll("-", " ")}
                      </option>
                    ))}
                  </Select>
                  <Input value={item.title} onChange={(e) => set({ title: e.target.value })} placeholder="Title" required maxLength={120} aria-label="Title" />
                </div>
                <Textarea value={item.text ?? ""} onChange={(e) => set({ text: e.target.value })} placeholder="Short text (optional)" maxLength={600} className="min-h-16" aria-label="Text" />
              </>
            )}
          />
        </>
      );
    case "stats":
      return (
        <>
          <Field label="Heading" hint="Optional.">
            <Input value={block.heading ?? ""} onChange={(e) => patch({ heading: e.target.value })} maxLength={160} />
          </Field>
          <ItemsEditor
            items={block.items}
            onChange={(items) => patch({ items })}
            max={6}
            noun="figure"
            blank={() => ({ value: "", label: "" })}
            render={(item, set) => (
              <div className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <Input value={item.value} onChange={(e) => set({ value: e.target.value })} placeholder="173" required maxLength={20} aria-label="Figure" />
                <Input value={item.label} onChange={(e) => set({ label: e.target.value })} placeholder="newcomers welcomed" required maxLength={80} aria-label="Label" />
              </div>
            )}
          />
        </>
      );
    case "quote":
      return (
        <>
          <Field label="Quote">
            <Textarea value={block.quote} onChange={(e) => patch({ quote: e.target.value })} required maxLength={1000} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Who said it" hint="Optional.">
              <Input value={block.author ?? ""} onChange={(e) => patch({ author: e.target.value })} maxLength={120} />
            </Field>
            <Field label="Their role" hint="Optional.">
              <Input value={block.role ?? ""} onChange={(e) => patch({ role: e.target.value })} maxLength={120} />
            </Field>
          </div>
        </>
      );
    case "faq":
      return (
        <>
          <Field label="Heading" hint="Optional.">
            <Input value={block.heading ?? ""} onChange={(e) => patch({ heading: e.target.value })} maxLength={160} />
          </Field>
          <ItemsEditor
            items={block.items}
            onChange={(items) => patch({ items })}
            max={30}
            noun="question"
            blank={() => ({ question: "", answer: "" })}
            render={(item, set) => (
              <>
                <Input value={item.question} onChange={(e) => set({ question: e.target.value })} placeholder="Question" required maxLength={300} aria-label="Question" />
                <Textarea value={item.answer} onChange={(e) => set({ answer: e.target.value })} placeholder="Answer" required maxLength={3000} className="min-h-20" aria-label="Answer" />
              </>
            )}
          />
        </>
      );
    case "gallery":
      return (
        <>
          <Field label="Heading" hint="Optional.">
            <Input value={block.heading ?? ""} onChange={(e) => patch({ heading: e.target.value })} maxLength={160} />
          </Field>
          <GalleryField label="Photos" value={block.images} onChange={(images) => patch({ images })} max={24} />
        </>
      );
    case "cta":
      return (
        <>
          <Field label="Heading">
            <Input value={block.heading} onChange={(e) => patch({ heading: e.target.value })} required maxLength={160} />
          </Field>
          <Field label="Text" hint="Optional.">
            <Textarea value={block.text ?? ""} onChange={(e) => patch({ text: e.target.value })} maxLength={600} className="min-h-20" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button text">
              <Input value={block.buttonLabel} onChange={(e) => patch({ buttonLabel: e.target.value })} required maxLength={40} />
            </Field>
            <Field label="Button link" hint={linkHint}>
              <Input value={block.buttonHref} onChange={(e) => patch({ buttonHref: e.target.value })} required placeholder="/donate" />
            </Field>
          </div>
        </>
      );
  }
}
