"use client";

import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthField, AuthSubmit } from "@/components/admin/auth-fields";
import { AuthLayout } from "@/components/admin/auth-layout";
import { api, getToken, setSession, type SessionUser } from "@/lib/admin-api";

function nextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && /^\/admin(\/|$)/.test(next) && !next.startsWith("/admin/login") ? next : "/admin";
}

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getToken()) router.replace(nextPath());
  }, [router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const { accessToken, user } = await api<{ accessToken: string; user: SessionUser }>("/auth/login", {
        method: "POST",
        json: { email: data.get("email"), password: data.get("password") },
      });
      setSession(accessToken, user);
      router.replace(nextPath());
    } catch (loginError) {
      const message = (loginError as Error).message;
      setError(/too many/i.test(message) ? "Too many attempts. Wait a minute and try again." : message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title={
        <>
          Welcome <span className="text-gradient">back</span>
        </>
      }
      subtitle="Sign in to manage the TOMCARE Foundation website."
    >
      <form onSubmit={onSubmit}>
        {error ? (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        <AuthField
          label="Email"
          icon={Mail}
          name="email"
          type="email"
          required
          autoComplete="username"
          spellCheck={false}
          placeholder="you@tomcarefoundation.org"
          disabled={busy}
        />
        <AuthField
          label="Password"
          icon={Lock}
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          disabled={busy}
        />
        <p className="mb-6 text-right text-xs text-muted">Forgot your password? Ask an administrator to reset it.</p>
        <AuthSubmit busy={busy}>{busy ? "Signing in…" : "Sign in"}</AuthSubmit>
      </form>
    </AuthLayout>
  );
}
