"use client";

import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { adminNav } from "@/components/admin/nav";
import { canAccess, type SessionUser } from "@/lib/admin-api";

const extraPages = [
  { href: "/admin/news/new", label: "Write a news story", section: "Website", roles: ["EDITOR" as const] },
  { href: "/admin/events/new", label: "Add an event", section: "Website", roles: ["EDITOR" as const] },
  { href: "/admin/pages/new", label: "Build a new page", section: "Website", roles: ["EDITOR" as const] },
  { href: "/admin/programs/new", label: "Add a program", section: "Website", roles: ["EDITOR" as const] },
  { href: "/admin/account", label: "My account", section: "Account", roles: undefined },
];

export function CommandPalette({ user, open, onClose }: { user: SessionUser; open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const pages = [
    ...adminNav.flatMap((section) =>
      section.items.map((item) => ({ href: item.href, label: item.label, section: section.title ?? "Overview", roles: item.roles })),
    ),
    ...extraPages,
  ].filter((page) => canAccess(user, page.roles));
  const needle = query.trim().toLowerCase();
  const results = needle
    ? pages.filter((page) => `${page.label} ${page.section}`.toLowerCase().includes(needle))
    : pages;
  const selected = Math.min(active, Math.max(results.length - 1, 0));

  function close() {
    setQuery("");
    setActive(0);
    onClose();
  }

  function go(href: string) {
    close();
    router.push(href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") close();
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((selected + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((selected - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === "Enter" && results[selected]) go(results[selected].href);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" onKeyDown={onKeyDown}>
      <button type="button" className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]" aria-label="Close search" onClick={close} />
      <div role="dialog" aria-label="Go to page" className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-line">
        <div className="flex items-center gap-2.5 border-b border-line px-4">
          <Search className="size-4 shrink-0 text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            placeholder="Go to page…"
            className="h-12 w-full bg-transparent text-[15px] text-navy outline-none placeholder:text-muted"
          />
          <kbd className="rounded bg-sand px-1.5 py-0.5 text-[10px] font-medium text-muted">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.length ? (
            results.map((page, index) => (
              <li key={page.href}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(page.href)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
                    index === selected ? "bg-sand text-navy" : "text-navy/80"
                  }`}
                >
                  <span>
                    <span className="font-medium">{page.label}</span>
                    <span className="ml-2 text-xs text-muted">{page.section}</span>
                  </span>
                  {index === selected ? <CornerDownLeft className="size-3.5 text-muted" aria-hidden /> : null}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-6 text-center text-sm text-muted">No pages match “{query}”.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
