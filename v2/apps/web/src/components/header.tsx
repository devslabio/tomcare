"use client";

import { ArrowRight, Heart, Mail, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "./logo";

type NavItem = { href: string; label: string };

export function Header({
  nav,
  phone,
  phoneDisplay,
  email,
}: {
  nav: NavItem[];
  phone: string;
  phoneDisplay: string;
  email: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close the mobile menu after navigating.
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled && !open;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`hidden overflow-hidden bg-ink text-[13px] text-white/70 transition-[max-height,opacity] duration-500 md:block ${
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="container-x flex h-10 items-center justify-between">
          <p>
            Free, confidential support for newcomers and families in Montréal —{" "}
            <Link href="/get-help" className="font-semibold text-gold hover:underline">
              ask for help
            </Link>
          </p>
          <div className="flex items-center gap-6">
            <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Phone className="size-3.5" aria-hidden />
              {phoneDisplay}
            </a>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Mail className="size-3.5" aria-hidden />
              {email}
            </a>
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ${
          solid
            ? "border-b border-line/80 bg-cream/90 shadow-[0_10px_30px_-20px_rgba(11,21,55,0.35)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6 lg:h-20">
          <Link href="/" className="relative z-10 flex shrink-0 items-center" aria-label="TOMCARE Foundation — home">
            <Logo light={!solid} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors ${
                  solid
                    ? isActive(item.href)
                      ? "text-ink"
                      : "text-ink/65 hover:text-ink"
                    : isActive(item.href)
                      ? "text-white"
                      : "text-white/75 hover:text-white"
                }`}
              >
                {item.label}
                {isActive(item.href) ? (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-gold" aria-hidden />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 xl:flex">
            <Link
              href="/get-help"
              className={`inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold transition ${
                solid ? "border-ink/15 text-ink hover:border-ink/40" : "border-white/30 text-white hover:border-white/70"
              }`}
            >
              Get help
            </Link>
            <Link
              href="/donate"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-bold text-ink shadow-[0_10px_26px_-10px_rgba(229,172,27,0.9)] transition hover:bg-[#f0bb2e]"
            >
              <Heart className="size-4 fill-ink/90 transition-transform group-hover:scale-110" aria-hidden />
              Donate
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              setOpenedAt(pathname);
              setOpen((value) => !value);
            }}
            className={`relative z-10 inline-flex size-11 items-center justify-center rounded-full transition xl:hidden ${
              solid ? "text-ink hover:bg-sand" : "text-white hover:bg-white/10"
            }`}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 -z-10 overflow-y-auto bg-ink transition-[opacity,visibility] duration-500 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute -right-32 top-24 size-96 glow-sky opacity-40" aria-hidden />
        <div className="pointer-events-none absolute -left-24 bottom-10 size-80 glow-gold opacity-30" aria-hidden />
        <nav aria-label="Mobile" className="container-x relative flex min-h-full flex-col pb-10 pt-28">
          <ul className="space-y-0.5">
            {[{ href: "/", label: "Home" }, ...nav].map((item, index) => (
              <li
                key={item.href}
                className="transition-all duration-500"
                style={{
                  transitionDelay: open ? `${60 + index * 40}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "none" : "translateY(14px)",
                }}
              >
                <Link
                  href={item.href}
                  className={`font-display flex items-center justify-between border-b border-white/10 py-3.5 text-[1.75rem] ${
                    (item.href === "/" ? pathname === "/" : isActive(item.href)) ? "text-gold" : "text-white"
                  }`}
                >
                  {item.label}
                  <ArrowRight className="size-5 text-white/35" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link href="/donate" className="flex h-14 items-center justify-center gap-2 rounded-full bg-gold font-bold text-ink">
              <Heart className="size-4 fill-ink" aria-hidden />
              Donate
            </Link>
            <Link
              href="/get-help"
              className="flex h-14 items-center justify-center rounded-full border border-white/25 font-semibold text-white"
            >
              Get help
            </Link>
          </div>
          <a href={`tel:${phone}`} className="mt-6 inline-flex items-center justify-center gap-2 text-white/70">
            <Phone className="size-4" aria-hidden />
            {phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
