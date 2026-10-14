import { Link } from "@/components/link";
import type { ReactNode } from "react";

/**
 * Renders the small markdown subset staff write in the admin: ## and ### headings, - and 1. lists,
 * > quotes, **bold**, *italic*, [links](/path) and blank-line paragraphs. Output is React elements only.
 */

const SAFE_HREF = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i;

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let index = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${index++}`;
    if (match[1] !== undefined) nodes.push(<strong key={key}>{inline(match[1], key)}</strong>);
    else if (match[2] !== undefined) nodes.push(<em key={key}>{inline(match[2], key)}</em>);
    else {
      const [, , , label, href] = match;
      if (!SAFE_HREF.test(href)) nodes.push(label);
      else if (href.startsWith("/")) nodes.push(<Link key={key} href={href}>{label}</Link>);
      else
        nodes.push(
          <a key={key} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
            {label}
          </a>,
        );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Chunk =
  | { kind: "h2" | "h3" | "p" | "quote"; text: string }
  | { kind: "ul" | "ol"; items: string[] };

function parse(source: string): Chunk[] {
  const chunks: Chunk[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) chunks.push({ kind: "p", text: paragraph.join(" ") });
    paragraph = [];
  };

  for (const raw of source.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    const last = chunks[chunks.length - 1];
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      chunks.push({ kind: "h3", text: line.slice(4) });
    } else if (line.startsWith("## ")) {
      flush();
      chunks.push({ kind: "h2", text: line.slice(3) });
    } else if (/^[-*•] /.test(line)) {
      flush();
      if (last?.kind === "ul") last.items.push(line.slice(2));
      else chunks.push({ kind: "ul", items: [line.slice(2)] });
    } else if (/^\d+[.)] /.test(line)) {
      flush();
      const item = line.replace(/^\d+[.)] /, "");
      if (last?.kind === "ol") last.items.push(item);
      else chunks.push({ kind: "ol", items: [item] });
    } else if (line.startsWith("> ")) {
      flush();
      if (last?.kind === "quote") last.text += ` ${line.slice(2)}`;
      else chunks.push({ kind: "quote", text: line.slice(2) });
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return chunks;
}

export function Markdown({ source, className = "" }: { source: string; className?: string }) {
  return (
    <div className={`prose-tc ${className}`}>
      {parse(source).map((chunk, index) => {
        const key = `c${index}`;
        switch (chunk.kind) {
          case "h2":
            return <h2 key={key}>{inline(chunk.text, key)}</h2>;
          case "h3":
            return <h3 key={key}>{inline(chunk.text, key)}</h3>;
          case "quote":
            return <blockquote key={key}>{inline(chunk.text, key)}</blockquote>;
          case "ul":
          case "ol": {
            const List = chunk.kind;
            return (
              <List key={key}>
                {chunk.items.map((item, i) => (
                  <li key={i}>{inline(item, `${key}-${i}`)}</li>
                ))}
              </List>
            );
          }
          default:
            return <p key={key}>{inline(chunk.text, key)}</p>;
        }
      })}
    </div>
  );
}
