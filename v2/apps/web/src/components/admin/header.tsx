"use client";

import { Bell, ChevronDown, ExternalLink, HandHeart, Inbox, LifeBuoy, LogOut, Menu, Search, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/admin/avatar";
import { roleLabels } from "@/components/admin/nav";
import { api, type SessionUser } from "@/lib/admin-api";
import type { Dashboard } from "@/lib/admin-types";

type Counts = Dashboard["inbox"];

export function AdminHeader({
  user,
  onMenuClick,
  onSearchClick,
  onSignOut,
}: {
  user: SessionUser;
  onMenuClick: () => void;
  onSearchClick: () => void;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState<"user" | "notifications" | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api<Dashboard>("/dashboard").then(
      (data) => setCounts(data.inbox),
      () => undefined,
    );
  }, [pathname]);

  useEffect(() => {
    function onDocument(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(null);
    }
    document.addEventListener("mousedown", onDocument);
    return () => document.removeEventListener("mousedown", onDocument);
  }, []);

  const plural = (count: number, word: string) => `${count} new ${word}${count === 1 ? "" : "s"}`;
  const notifications = [
    counts?.requests ? { href: "/admin/requests", icon: LifeBuoy, label: plural(counts.requests, "help request") } : null,
    counts?.volunteers ? { href: "/admin/volunteers", icon: HandHeart, label: plural(counts.volunteers, "volunteer application") } : null,
    counts?.messages ? { href: "/admin/messages", icon: Inbox, label: plural(counts.messages, "message") } : null,
  ].filter((item) => item !== null);
  const total = (counts?.requests ?? 0) + (counts?.volunteers ?? 0) + (counts?.messages ?? 0);
  const panel =
    "absolute right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-line bg-white/95 shadow-[0_8px_28px_rgba(14,31,53,0.14)] backdrop-blur-xl";

  return (
    <header className="sticky top-0 z-30 flex h-[calc(3.5rem+env(safe-area-inset-top))] min-w-0 items-center justify-between gap-2 border-b border-line bg-white/80 px-2 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 sm:gap-3 sm:px-3 md:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-sand hover:text-navy lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <button
          type="button"
          onClick={onSearchClick}
          className="flex h-10 w-full min-w-0 max-w-[380px] items-center gap-2 rounded-lg border border-line bg-sand/60 px-3 text-left text-sm text-muted transition-colors hover:border-navy/20 sm:h-9"
        >
          <Search className="size-3.5 shrink-0 opacity-70" aria-hidden />
          <span className="min-w-0 flex-1 truncate">Search pages…</span>
          <kbd className="hidden shrink-0 rounded bg-navy/[0.06] px-1.5 py-0.5 text-[10px] font-medium sm:inline">⌘K</kbd>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1" ref={menuRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((current) => (current === "notifications" ? null : "notifications"))}
            className="relative inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-sand hover:text-navy"
            aria-label={total ? `Notifications, ${total} new` : "Notifications"}
          >
            <Bell className="size-[18px]" />
            {total ? (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-dark px-1 text-[9px] font-semibold text-white">
                {total > 99 ? "99+" : total}
              </span>
            ) : null}
          </button>
          {open === "notifications" ? (
            <div className={`${panel} w-[min(320px,calc(100vw-2rem))]`}>
              <p className="border-b border-line px-4 py-2.5 text-[13px] font-semibold text-navy">Notifications</p>
              {notifications.length ? (
                <ul className="py-1">
                  {notifications.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(null)}
                        className="flex min-h-11 items-center gap-2.5 px-4 py-2.5 text-sm text-navy hover:bg-sand"
                      >
                        <item.icon className="size-4 text-brand-dark" aria-hidden />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-6 text-center text-[13px] text-muted">You’re all caught up.</p>
              )}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((current) => (current === "user" ? null : "user"))}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-1.5 transition-colors hover:bg-sand"
            aria-label="Account menu"
          >
            <Avatar name={user.name} email={user.email} size="sm" />
            <span className="hidden text-left md:block">
              <span className="block max-w-[140px] truncate text-[13px] font-medium leading-tight text-navy">{user.name}</span>
              <span className="block max-w-[140px] truncate text-[11px] text-muted">{roleLabels[user.role]}</span>
            </span>
            <ChevronDown className="hidden size-3.5 text-muted md:block" aria-hidden />
          </button>
          {open === "user" ? (
            <div className={`${panel} w-64`}>
              <div className="flex items-start gap-3 border-b border-line px-3.5 py-3">
                <Avatar name={user.name} email={user.email} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-navy">{user.name}</p>
                  <p className="truncate text-[11px] text-muted">{user.email}</p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-medium text-navy">
                    <Shield className="size-2.5" aria-hidden />
                    {roleLabels[user.role]}
                  </span>
                </div>
              </div>
              <div className="py-1">
                <Link
                  href="/admin/account"
                  onClick={() => setOpen(null)}
                  className="flex min-h-11 items-center gap-2 px-3.5 py-2.5 text-sm text-navy hover:bg-sand"
                >
                  <UserRound className="size-4 text-muted" aria-hidden />
                  My account
                </Link>
                <a
                  href="/"
                  target="_blank"
                  onClick={() => setOpen(null)}
                  className="flex min-h-11 items-center gap-2 px-3.5 py-2.5 text-sm text-navy hover:bg-sand"
                >
                  <ExternalLink className="size-4 text-muted" aria-hidden />
                  View website
                </a>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex min-h-11 w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-navy hover:bg-sand"
                >
                  <LogOut className="size-4 text-muted" aria-hidden />
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
