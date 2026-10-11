"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { CommandPalette } from "@/components/admin/command-palette";
import { AdminHeader } from "@/components/admin/header";
import { requiredRoles } from "@/components/admin/nav";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ToastProvider } from "@/components/admin/toast";
import { api, canAccess, clearSession, getToken, updateSessionUser, type SessionUser } from "@/lib/admin-api";

const SessionContext = createContext<{ user: SessionUser; setUser: (user: SessionUser) => void } | null>(null);

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside the admin shell");
  return value;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUserState] = useState<SessionUser | null>(null);
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuOpen = menuOpenOn === pathname;

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/admin/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    api<SessionUser>("/auth/me").then(
      (me) => {
        updateSessionUser(me);
        setUserState(me);
      },
      () => {
        clearSession();
        router.replace("/admin/login");
      },
    );
  }, [router]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  function setUser(next: SessionUser) {
    updateSessionUser(next);
    setUserState(next);
  }

  function signOut() {
    clearSession();
    router.replace("/admin/login");
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-sand text-sm text-muted">
        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
        Checking your session…
      </div>
    );
  }

  const allowed = canAccess(user, requiredRoles(pathname));

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      <ToastProvider>
        <div className="min-h-dvh bg-[#f6f3ee] text-navy">
          <AdminSidebar user={user} mobileOpen={menuOpen} onCloseMobile={() => setMenuOpenOn(null)} />
          <div className="flex min-h-dvh min-w-0 flex-col lg:pl-60">
            <AdminHeader
              user={user}
              onMenuClick={() => setMenuOpenOn(pathname)}
              onSearchClick={() => setSearchOpen(true)}
              onSignOut={signOut}
            />
            <main className="mx-auto w-full max-w-[1600px] flex-1 px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-5 sm:pt-6 md:px-8">
              {allowed ? (
                children
              ) : (
                <div className="rounded-2xl border border-line bg-white px-6 py-14 text-center">
                  <p className="font-semibold text-navy">You don’t have access to this section</p>
                  <p className="mt-1 text-sm text-muted">Ask an administrator if you need it.</p>
                  <Link href="/admin" className="mt-5 inline-flex font-semibold text-navy underline underline-offset-4">
                    Back to dashboard
                  </Link>
                </div>
              )}
            </main>
          </div>
          <CommandPalette user={user} open={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
      </ToastProvider>
    </SessionContext.Provider>
  );
}
