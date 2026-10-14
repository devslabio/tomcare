import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { lines } from "@/lib/cms";
import { fill } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import type { Program, SiteSettings } from "@/lib/cms-types";
import { Highlight } from "./highlight";
import { Link } from "./link";
import { HandMark, Logo } from "./logo";
import { NewsletterForm } from "./forms/newsletter-form";
import { SocialIcon, socialLinks } from "./social-icons";

export async function Footer({
  settings,
  programs,
  pages,
}: {
  settings: SiteSettings;
  programs: Program[];
  pages: { href: string; label: string }[];
}) {
  const { t } = await getI18n();
  const { contact } = settings;
  const socials = socialLinks(settings.links);

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <HandMark className="pointer-events-none absolute -right-24 -top-10 h-[34rem] w-auto opacity-[0.04]" color="#ffffff" />
      <div className="pointer-events-none absolute -left-40 top-0 size-[36rem] glow-sky opacity-20" aria-hidden />

      <div className="container-x relative">
        <div className="grid gap-10 border-b border-white/10 py-16 lg:grid-cols-12 lg:items-end lg:py-20">
          <div className="lg:col-span-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-gold">{t.footer.newsletterEyebrow}</p>
            <h2 className="font-display mt-4 text-balance text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.02em]">
              <Highlight text={t.footer.newsletterTitle} />
            </h2>
          </div>
          <div className="lg:col-span-5">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light tagline={t.header.logoTagline} />
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/70">{t.meta.description}</p>
            {socials.length ? (
              <ul className="mt-7 flex gap-2.5">
                {socials.map((social) => (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-gold hover:text-gold"
                    >
                      <SocialIcon name={social.key} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white">{t.footer.foundation}</h3>
            <ul className="mt-4 space-y-1 text-[15px] text-white/70">
              {[
                { href: "/about", label: t.footer.aboutUs },
                { href: "/team", label: t.footer.ourTeam },
                { href: "/events", label: t.nav.events },
                { href: "/news", label: t.nav.news },
                ...pages,
                { href: "/contact", label: t.nav.contact },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-block py-1 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white">{t.footer.programs}</h3>
            <ul className="mt-4 space-y-1 text-[15px] text-white/70">
              {programs.slice(0, 6).map((program) => (
                <li key={program.id}>
                  <Link href={`/programs/${program.slug}`} className="inline-block py-1 transition hover:text-white">
                    {program.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/programs" className="inline-block py-1 font-semibold text-gold transition hover:text-white">
                  {t.footer.allPrograms}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white">{t.footer.reachUs}</h3>
            <ul className="mt-4 space-y-4 text-[15px] text-white/70">
              <li>
                <a href={`tel:${contact.phone}`} className="flex gap-3 transition hover:text-white">
                  <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex gap-3 break-all transition hover:text-white">
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                {contact.address}
              </li>
              {contact.hours ? (
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  <span>
                    {lines(contact.hours).map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-7 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{fill(t.footer.rights, { year: new Date().getFullYear() })}</p>
          <p className="flex gap-5">
            <Link href="/donate" className="transition hover:text-white">
              {t.actions.donate}
            </Link>
            <Link href="/volunteer" className="transition hover:text-white">
              {t.actions.volunteer}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
