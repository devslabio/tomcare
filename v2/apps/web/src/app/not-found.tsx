import Link from "next/link";

import { HandMark, Logo } from "@/components/logo";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t, href } = await getI18n();
  return (
    <main className="grain relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-white">
      <HandMark className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-[30rem] w-auto opacity-[0.05]" color="#fff" />
      <Link href={href("/")} aria-label={t.nav.homeLabel}>
        <Logo light tagline={t.header.logoTagline} />
      </Link>
      <p className="mt-16 text-[12px] font-bold uppercase tracking-[0.2em] text-gold">{t.notFound.eyebrow}</p>
      <h1 className="font-display mt-4 max-w-2xl text-balance text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05]">{t.notFound.title}</h1>
      <p className="mt-5 max-w-md text-white/75">{t.notFound.text}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href={href("/")} className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-bold text-ink">
          {t.notFound.home}
        </Link>
        <Link href={href("/get-help")} className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 font-semibold">
          {t.actions.getHelp}
        </Link>
      </div>
    </main>
  );
}
