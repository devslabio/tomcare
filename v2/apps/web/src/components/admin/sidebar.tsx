"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/admin/avatar";
import { Logo } from "@/components/logo";
import { adminNav, isActive, roleLabels } from "@/components/admin/nav";
import { canAccess, type SessionUser } from "@/lib/admin-api";

export function AdminSidebar({
  user,
  mobileOpen,
  onCloseMobile,
}: {
  user: SessionUser;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-[2px] lg:hidden"
          aria-label="Close menu"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-60 max-w-[85vw] flex-col bg-navy pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-white transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
          <Link href="/admin" className="flex items-center gap-2.5" onClick={onCloseMobile}>
            <Logo light className="origin-left scale-[0.8]" />
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">
              Admin
            </span>
          </Link>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 border-b border-white/10 px-6 py-6">
          <Link href="/admin/account" onClick={onCloseMobile} className="group" aria-label="My account">
            <Avatar
              name={user.name}
              email={user.email}
              size="xl"
              className="ring-2 ring-white/15 transition group-hover:ring-gold"
            />
          </Link>
          <div className="min-w-0 max-w-full text-center">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="mt-0.5 truncate text-xs text-white/55">{roleLabels[user.role]}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Admin">
          {adminNav.map((section, index) => {
            const items = section.items.filter((item) => canAccess(user, item.roles));
            if (!items.length) return null;
            return (
              <div key={section.title ?? index}>
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  {section.title ?? "Overview"}
                </p>
                <ul className="space-y-1">
                  {items.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onCloseMobile}
                          aria-current={active ? "page" : undefined}
                          className={`flex min-h-11 items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-2.5 text-sm transition-colors sm:min-h-0 sm:py-2 ${
                            active
                              ? "border-gold bg-white/10 font-medium text-white"
                              : "border-transparent text-white/75 hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >
                          <item.icon className={`size-4 ${active ? "text-gold" : ""}`} aria-hidden />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
