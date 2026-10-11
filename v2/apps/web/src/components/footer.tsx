import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { lines } from "@/lib/cms";
import type { Program, SiteSettings } from "@/lib/cms-types";
import { site } from "@/lib/site";
import { HandMark, Logo } from "./logo";
import { NewsletterForm } from "./forms/newsletter-form";
import { SocialIcon, socialLinks } from "./social-icons";

export function Footer({
  settings,
  programs,
  pages,
}: {
  settings: SiteSettings;
  programs: Program[];
  pages: { href: string; label: string }[];
}) {
  const { contact } = settings;
  const socials = socialLinks(settings.links);

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <HandMark className="pointer-events-none absolute -right-24 -top-10 h-[34rem] w-auto opacity-[0.04]" color="#ffffff" />
      <div className="pointer-events-none absolute -left-40 top-0 size-[36rem] glow-sky opacity-20" aria-hidden />

      <div className="container-x relative">
        <div className="grid gap-10 border-b border-white/10 py-16 lg:grid-cols-12 lg:items-end lg:py-20">
          <div className="lg:col-span-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-gold">Stay close to the community</p>
            <h2 className="font-display mt-4 text-balance text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.02em]">
              Stories, events and ways to help — <em className="text-gold">once a month.</em>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/60">{site.description}</p>
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
            <h3 className="text-sm font-bold text-white">Foundation</h3>
            <ul className="mt-4 space-y-1 text-[15px] text-white/60">
              {[
                { href: "/about", label: "About us" },
                { href: "/team", label: "Our team" },
                { href: "/events", label: "Events" },
                { href: "/news", label: "News" },
                ...pages,
                { href: "/contact", label: "Contact" },
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
            <h3 className="text-sm font-bold text-white">Programs</h3>
            <ul className="mt-4 space-y-1 text-[15px] text-white/60">
              {programs.slice(0, 6).map((program) => (
                <li key={program.id}>
                  <Link href={`/programs/${program.slug}`} className="inline-block py-1 transition hover:text-white">
                    {program.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/programs" className="inline-block py-1 font-semibold text-gold transition hover:text-white">
                  All programs →
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white">Visit or call</h3>
            <ul className="mt-4 space-y-4 text-[15px] text-white/60">
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

        <div className="flex flex-col gap-3 border-t border-white/10 py-7 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. A non-profit organization in Quebec.
          </p>
          <p className="flex gap-5">
            <Link href="/donate" className="transition hover:text-white">
              Donate
            </Link>
            <Link href="/volunteer" className="transition hover:text-white">
              Volunteer
            </Link>
            <Link href="/admin" className="transition hover:text-white">
              Staff login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
