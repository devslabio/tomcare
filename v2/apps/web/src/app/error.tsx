"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Logo } from "@/components/logo";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grain relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-white">
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 size-[30rem] glow-sky opacity-35" aria-hidden />
      <Link href="/" aria-label="TOMCARE Foundation — home">
        <Logo light />
      </Link>
      <h1 className="font-display mt-14 text-[clamp(2rem,5vw,3.25rem)] leading-tight">Something went wrong on our side.</h1>
      <p className="mt-4 max-w-md text-white/65">
        Please try again in a moment. If you need help urgently, call or email us — we’re still here.
      </p>
      {error.digest ? <p className="mt-4 font-mono text-xs text-white/35">Reference: {error.digest}</p> : null}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-bold text-ink">
          Try again
        </button>
        <Link href="/" className="inline-flex h-12 items-center rounded-full border border-white/25 px-6 font-semibold hover:bg-white/10">
          Back to home
        </Link>
      </div>
    </main>
  );
}
