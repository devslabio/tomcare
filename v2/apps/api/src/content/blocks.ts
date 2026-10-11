import { BadRequestException } from "@nestjs/common";

import { HREF, ICONS, URL_LIKE } from "./content.dto";

type Field =
  | { kind: "text"; max: number; required?: boolean }
  | { kind: "image"; required?: boolean }
  | { kind: "href"; required?: boolean }
  | { kind: "enum"; values: readonly string[] }
  | { kind: "images"; max: number }
  | { kind: "items"; max: number; fields: Record<string, Field> };

/** Every block type the page builder can produce, with the fields each one keeps. Mirrors apps/web/src/lib/blocks.ts. */
const BLOCKS: Record<string, Record<string, Field>> = {
  richText: { heading: { kind: "text", max: 160 }, body: { kind: "text", max: 20000, required: true } },
  imageText: {
    eyebrow: { kind: "text", max: 60 },
    heading: { kind: "text", max: 160, required: true },
    body: { kind: "text", max: 5000, required: true },
    image: { kind: "image", required: true },
    imageSide: { kind: "enum", values: ["left", "right"] },
    buttonLabel: { kind: "text", max: 40 },
    buttonHref: { kind: "href" },
  },
  cards: {
    heading: { kind: "text", max: 160 },
    intro: { kind: "text", max: 600 },
    items: {
      kind: "items",
      max: 12,
      fields: {
        icon: { kind: "enum", values: ICONS },
        title: { kind: "text", max: 120, required: true },
        text: { kind: "text", max: 600 },
      },
    },
  },
  stats: {
    heading: { kind: "text", max: 160 },
    items: {
      kind: "items",
      max: 6,
      fields: { value: { kind: "text", max: 20, required: true }, label: { kind: "text", max: 80, required: true } },
    },
  },
  quote: {
    quote: { kind: "text", max: 1000, required: true },
    author: { kind: "text", max: 120 },
    role: { kind: "text", max: 120 },
  },
  faq: {
    heading: { kind: "text", max: 160 },
    items: {
      kind: "items",
      max: 30,
      fields: { question: { kind: "text", max: 300, required: true }, answer: { kind: "text", max: 3000, required: true } },
    },
  },
  gallery: { heading: { kind: "text", max: 160 }, images: { kind: "images", max: 24 } },
  cta: {
    heading: { kind: "text", max: 160, required: true },
    text: { kind: "text", max: 600 },
    buttonLabel: { kind: "text", max: 40, required: true },
    buttonHref: { kind: "href", required: true },
  },
};

function clean(fields: Record<string, Field>, input: Record<string, unknown>, where: string) {
  const out: Record<string, unknown> = {};
  for (const [name, field] of Object.entries(fields)) {
    const value = input[name];
    const label = `${where}: ${name}`;
    switch (field.kind) {
      case "text": {
        const text = typeof value === "string" ? value.trim() : "";
        if (field.required && !text) throw new BadRequestException(`${label} is required`);
        if (text.length > field.max) throw new BadRequestException(`${label} must be at most ${field.max} characters`);
        if (text) out[name] = text;
        break;
      }
      case "image":
      case "href": {
        const text = typeof value === "string" ? value.trim() : "";
        if (field.required && !text) throw new BadRequestException(`${label} is required`);
        if (text && !(field.kind === "image" ? URL_LIKE : HREF).test(text)) {
          throw new BadRequestException(`${label} must be a site link or a full URL`);
        }
        if (text) out[name] = text;
        break;
      }
      case "enum":
        if (typeof value === "string" && field.values.includes(value)) out[name] = value;
        break;
      case "images": {
        const list = Array.isArray(value) ? value.filter((url): url is string => typeof url === "string" && URL_LIKE.test(url)) : [];
        out[name] = list.slice(0, field.max);
        break;
      }
      case "items": {
        const list = Array.isArray(value) ? value : [];
        if (list.length > field.max) throw new BadRequestException(`${label}: at most ${field.max} items`);
        out[name] = list.map((item, index) =>
          clean(field.fields, (item ?? {}) as Record<string, unknown>, `${where} item ${index + 1}`),
        );
        break;
      }
    }
  }
  return out;
}

export function cleanBlocks(blocks: Record<string, unknown>[]) {
  return blocks.map((block, index) => {
    const type = typeof block.type === "string" ? block.type : "";
    const fields = BLOCKS[type];
    if (!fields) throw new BadRequestException(`Block ${index + 1} has an unknown type`);
    const id = typeof block.id === "string" && /^[\w-]{1,40}$/.test(block.id) ? block.id : `b${index + 1}`;
    return { id, type, ...clean(fields, block, `Block ${index + 1} (${type})`) };
  });
}
