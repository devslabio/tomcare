import { en, type Dictionary } from "./en";
import { fr } from "./fr";
import type { Locale } from "./config";

export const dictionaries: Record<Locale, Dictionary> = { en, fr };

/** Replaces `{name}` placeholders: fill("Call {phone}", { phone }) */
export function fill(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export type { Dictionary, Locale };
