import Link from "next/link";

import { HandMark, Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="grain relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-white">
      <HandMark className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-[30rem] w-auto opacity-[0.05]" color="#fff" />
      <Link href="/" aria-label="TOMCARE Foundation — home">
        <Logo light />
      </Link>
      <p className="mt-16 text-[12px] font-bold uppercase tracking-[0.2em] text-gold">Page not found</p>
      <h1 className="font-display mt-4 max-w-2xl text-balance text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05]">
        This page has moved on — but we’re still right here.
      </h1>
      <p className="mt-5 max-w-md text-white/65">The link may be old or mistyped. Let’s get you back to somewhere useful.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-bold text-ink">
          Back to home
        </Link>
        <Link href="/get-help" className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 font-semibold">
          I need help
        </Link>
      </div>
    </main>
  );
}
