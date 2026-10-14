"use client";

import { ArrowRight, Globe, Heart, Mail, Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { localizeHref, stripLocale } from "@/lib/i18n/config";
import { useI18n } from "./i18n-provider";
import { Link } from "./link";
import { Logo } from "./logo";

type NavItem = { href: string; label: string };

/** Full page load, so the whole page (including <html lang>) switches language. */
function LanguageSwitch({ path, className = "" }: { path: string; className?: string }) {
  const { locale, t } = useI18n();
  return (
    <a
      href={localizeHref(path, locale === "fr" ? "en" : "fr")}
      hrefLang={locale === "fr" ? "en" : "fr"}
      lang={locale === "fr" ? "en" : "fr"}
      aria-label={t.header.switchToLabel}
      className={className}
    >
      <Globe className="size-4" aria-hidden />
      {t.header.switchTo}
    </a>
  );
}

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
  const { t } = useI18n();
  const pathname = usePathname();
  const path = stripLocale(pathname);
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
  const isActive = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`hidden overflow-hidden bg-ink text-[13px] text-white/75 transition-[max-height,opacity] duration-500 md:block ${
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="container-x flex h-10 items-center justify-between gap-6">
          <p className="truncate">{t.header.topBar}</p>
          <div className="flex shrink-0 items-center gap-6">
            <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Phone className="size-3.5" aria-hidden />
              {phoneDisplay}
            </a>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Mail className="size-3.5" aria-hidden />
              {email}
            </a>
            <LanguageSwitch path={path} className="inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-gold" />
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
        <div className="container-x flex h-16 items-center justify-between gap-3 lg:h-20">
          <Link href="/" className="relative z-10 flex shrink-0 items-center" aria-label={t.nav.homeLabel}>
            <Logo light={!solid} compact tagline={t.header.logoTagline} />
          </Link>

          <nav aria-label={t.nav.main} className="hidden items-center gap-1 xl:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-base transition-colors ${active ? "font-bold" : "font-medium"} ${
                    solid
                      ? active
                        ? "text-ink"
                        : "text-ink/70 hover:text-ink"
                      : active
                        ? "text-white"
                        : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                  {active ? <span className="absolute inset-x-3.5 -bottom-1 h-[3px] rounded-full bg-gold" aria-hidden /> : null}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <Link
              href="/get-help"
              className={`inline-flex h-10 items-center rounded-full border px-3.5 text-[13px] font-semibold transition sm:px-5 sm:text-sm lg:h-11 ${
                solid ? "border-ink/20 text-ink hover:border-ink/50" : "border-white/40 text-white hover:border-white"
              }`}
            >
              {t.actions.getHelp}
            </Link>
            <Link
              href="/donate"
              className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-gold px-3.5 text-[13px] font-bold text-ink shadow-[0_10px_26px_-10px_rgba(229,172,27,0.9)] transition hover:bg-[#f0bb2e] sm:gap-2 sm:px-5 sm:text-sm lg:h-11"
            >
              <Heart className="size-3.5 fill-ink/90 transition-transform group-hover:scale-110 sm:size-4" aria-hidden />
              {t.actions.donate}
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpenedAt(pathname);
                setOpen((value) => !value);
              }}
              className={`inline-flex size-10 items-center justify-center rounded-full transition xl:hidden ${
                solid ? "text-ink hover:bg-sand" : "text-white hover:bg-white/10"
              }`}
              aria-expanded={open}
              aria-label={open ? t.header.closeMenu : t.header.openMenu}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 -z-10 overflow-y-auto bg-ink transition-[opacity,visibility] duration-500 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute -right-32 top-24 size-96 glow-sky opacity-40" aria-hidden />
        <div className="pointer-events-none absolute -left-24 bottom-10 size-80 glow-gold opacity-30" aria-hidden />
        <nav aria-label={t.nav.mobile} className="container-x relative flex min-h-full flex-col pb-10 pt-24">
          <div className="mb-4 flex justify-end">
            <LanguageSwitch
              path={path}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-semibold text-white"
            />
          </div>
          <ul className="space-y-0.5">
            {[{ href: "/", label: t.nav.home }, ...nav].map((item, index) => (
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
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`font-display flex items-center justify-between border-b border-white/10 py-3.5 text-[1.625rem] ${
                    isActive(item.href) ? "text-gold" : "text-white"
                  }`}
                >
                  {item.label}
                  <ArrowRight className="size-5 text-white/35" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 grid grid-cols-2 gap-3">
            <Link href="/get-help" className="flex h-14 items-center justify-center rounded-full bg-white font-bold text-ink">
              {t.actions.getHelp}
            </Link>
            <Link href="/donate" className="flex h-14 items-center justify-center gap-2 rounded-full bg-gold font-bold text-ink">
              <Heart className="size-4 fill-ink" aria-hidden />
              {t.actions.donate}
            </Link>
          </div>
          <a href={`tel:${phone}`} className="mt-6 inline-flex items-center justify-center gap-2 text-white/75">
            <Phone className="size-4" aria-hidden />
            {phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
