/** Page-builder blocks. Mirrors apps/api/src/content/blocks.ts, which validates what is stored. */

export type CardItem = { icon?: string; title: string; text?: string };
export type StatItem = { value: string; label: string };
export type FaqItem = { question: string; answer: string };

export type Block =
  | { id: string; type: "richText"; heading?: string; body: string }
  | {
      id: string;
      type: "imageText";
      eyebrow?: string;
      heading: string;
      body: string;
      image: string;
      imageSide?: "left" | "right";
      buttonLabel?: string;
      buttonHref?: string;
    }
  | { id: string; type: "cards"; heading?: string; intro?: string; items: CardItem[] }
  | { id: string; type: "stats"; heading?: string; items: StatItem[] }
  | { id: string; type: "quote"; quote: string; author?: string; role?: string }
  | { id: string; type: "faq"; heading?: string; items: FaqItem[] }
  | { id: string; type: "gallery"; heading?: string; images: string[] }
  | { id: string; type: "cta"; heading: string; text?: string; buttonLabel: string; buttonHref: string };

export type BlockType = Block["type"];

export const blockTypes: { type: BlockType; label: string; description: string }[] = [
  { type: "richText", label: "Text", description: "Heading and paragraphs, lists and links" },
  { type: "imageText", label: "Image & text", description: "A photo beside a short story, with an optional button" },
  { type: "cards", label: "Cards", description: "A grid of icons with short titles and text" },
  { type: "stats", label: "Numbers", description: "Up to six key figures" },
  { type: "quote", label: "Quote", description: "A large pull quote" },
  { type: "faq", label: "Questions", description: "Expandable questions and answers" },
  { type: "gallery", label: "Gallery", description: "A grid of photos" },
  { type: "cta", label: "Call to action", description: "A highlighted band with one button" },
];

export function newBlock(type: BlockType): Block {
  const id = `${type}-${Math.random().toString(36).slice(2, 8)}`;
  switch (type) {
    case "richText":
      return { id, type, heading: "", body: "" };
    case "imageText":
      return { id, type, eyebrow: "", heading: "", body: "", image: "", imageSide: "right", buttonLabel: "", buttonHref: "" };
    case "cards":
      return { id, type, heading: "", intro: "", items: [{ icon: "heart-handshake", title: "", text: "" }] };
    case "stats":
      return { id, type, heading: "", items: [{ value: "", label: "" }] };
    case "quote":
      return { id, type, quote: "", author: "", role: "" };
    case "faq":
      return { id, type, heading: "", items: [{ question: "", answer: "" }] };
    case "gallery":
      return { id, type, heading: "", images: [] };
    case "cta":
      return { id, type, heading: "", text: "", buttonLabel: "", buttonHref: "" };
  }
}
