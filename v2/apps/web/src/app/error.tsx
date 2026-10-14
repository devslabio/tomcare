"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Logo } from "@/components/logo";
import { dictionaries, fill } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n/config";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname();
  const locale = pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
  const t = dictionaries[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grain relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-white">
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 size-[30rem] glow-sky opacity-35" aria-hidden />
      <Link href={localizeHref("/", locale)} aria-label={t.nav.homeLabel}>
        <Logo light tagline={t.header.logoTagline} />
      </Link>
      <h1 className="font-display mt-14 text-[clamp(2rem,5vw,3.25rem)] leading-tight">{t.error.title}</h1>
      <p className="mt-4 max-w-md text-white/75">{t.error.text}</p>
      {error.digest ? <p className="mt-4 font-mono text-xs text-white/50">{fill(t.error.reference, { digest: error.digest })}</p> : null}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-bold text-ink">
          {t.error.retry}
        </button>
        <Link
          href={localizeHref("/", locale)}
          className="inline-flex h-12 items-center rounded-full border border-white/25 px-6 font-semibold hover:bg-white/10"
        >
          {t.notFound.home}
        </Link>
      </div>
    </main>
  );
}
