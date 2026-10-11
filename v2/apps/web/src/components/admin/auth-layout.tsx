import Link from "next/link";

import { Logo } from "@/components/logo";
import { Photo } from "@/components/photo";
import { photos } from "@/lib/photos";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col lg:flex-row">
      <section className="flex w-full min-w-0 flex-1 items-center justify-center bg-white px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))] sm:px-8 lg:w-[42%] lg:min-w-[500px] lg:shrink-0">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 flex justify-center">
            <Link href="/" aria-label="TOMCARE Foundation website">
              <Logo className="scale-125" />
            </Link>
          </div>
          <h1 className="mb-2 text-center font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
            {title}
          </h1>
          {subtitle ? <p className="mb-8 text-center text-sm leading-relaxed text-muted">{subtitle}</p> : null}
          {children}
          <footer className="mt-12 text-center text-[11px] leading-relaxed text-muted">
            © {new Date().getFullYear()} TOMCARE Foundation · Montréal, Quebec
          </footer>
        </div>
      </section>

      <section className="relative hidden min-h-0 flex-1 overflow-hidden bg-ink lg:block" aria-hidden>
        <Photo src={photos.handsTogether} alt="" fill sizes="58vw" quality={90} className="animate-kenburns object-cover opacity-70" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="absolute inset-x-0 top-0 h-1 bg-gold" />
        <div className="absolute inset-x-0 bottom-0 p-12 xl:p-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">Staff portal</p>
          <p className="mt-4 max-w-xl font-display text-4xl leading-[1.1] tracking-tight text-white xl:text-5xl">
            No one should have to start over <em className="text-gold">alone.</em>
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
            Answer help requests and volunteer applications, publish news and events, and build new pages — all in one place.
          </p>
        </div>
      </section>
    </div>
  );
}
