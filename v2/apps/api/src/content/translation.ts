import { BadRequestException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { cleanBlocks } from "./blocks";

/** Max length of a text field, a list of short lines, or page-builder blocks. */
export type TranslationSpec = Record<string, number | { lines: number } | "blocks">;

/**
 * The French version of a record is stored beside the English one as `fr`, holding only the
 * translatable fields. Empty fields are dropped, so the site falls back to English for them.
 */
export function cleanTranslation(input: unknown, spec: TranslationSpec): Prisma.InputJsonObject {
  if (input === undefined || input === null) return {};
  if (typeof input !== "object" || Array.isArray(input)) throw new BadRequestException("fr must be an object");
  const source = input as Record<string, unknown>;
  const out: Record<string, Prisma.InputJsonValue> = {};
  for (const [field, rule] of Object.entries(spec)) {
    const value = source[field];
    if (value === undefined || value === null) continue;
    const label = `French ${field}`;
    if (rule === "blocks") {
      if (!Array.isArray(value)) throw new BadRequestException(`${label} must be a list of blocks`);
      if (value.length > 60) throw new BadRequestException(`${label}: at most 60 blocks`);
      if (value.length) out[field] = cleanBlocks(value as Record<string, unknown>[]) as Prisma.InputJsonValue;
    } else if (typeof rule === "object") {
      if (!Array.isArray(value)) throw new BadRequestException(`${label} must be a list`);
      const list = value.map((line) => (typeof line === "string" ? line.trim() : "")).filter(Boolean);
      if (list.length > 12 || list.some((line) => line.length > rule.lines)) {
        throw new BadRequestException(`${label}: at most 12 lines of ${rule.lines} characters`);
      }
      if (list.length) out[field] = list;
    } else {
      if (typeof value !== "string") throw new BadRequestException(`${label} must be text`);
      const text = value.trim();
      if (text.length > rule) throw new BadRequestException(`${label} must be at most ${rule} characters`);
      if (text) out[field] = text;
    }
  }
  return out;
}

/** Only touch `fr` when the request sends it, so older clients can't wipe a translation. */
export const withTranslation = (input: unknown, spec: TranslationSpec) =>
  input === undefined ? {} : { fr: cleanTranslation(input, spec) };

export const TRANSLATIONS = {
  program: { title: 120, category: 60, summary: 400, body: 20000, highlights: { lines: 120 } },
  service: { title: 120, description: 300 },
  event: { title: 160, summary: 400, body: 20000, location: 200 },
  post: { title: 200, excerpt: 400, body: 50000, category: 60 },
  page: { title: 160, description: 400, navLabel: 40, blocks: "blocks" },
  teamMember: { role: 120, bio: 1500 },
  testimonial: { quote: 1000, role: 120 },
  partner: { description: 400 },
  heroSlide: { eyebrow: 80, title: 160, subtitle: 400, imageAlt: 200, ctaLabel: 40 },
  volunteerRole: { title: 120, description: 500, commitment: 80, location: 80, skills: { lines: 40 } },
} satisfies Record<string, TranslationSpec>;
