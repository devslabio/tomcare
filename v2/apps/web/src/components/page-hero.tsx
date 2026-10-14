import { ChevronRight } from "lucide-react";
import { Link } from "@/components/link";

import { getI18n } from "@/lib/i18n/server";
import { Photo } from "./photo";
import { Eyebrow } from "./ui";

export async function PageHero({
  eyebrow,
  title,
  description,
  image,
  imagePosition = "center",
  crumbs = [],
  children,
  compact,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  image?: string | null;
  /** CSS object-position, so faces near the edge of a photo aren't cropped out. */
  imagePosition?: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
  compact?: boolean;
}) {
  const { t } = await getI18n();
  return (
    <section
      className={`grain relative isolate overflow-hidden bg-ink text-white ${
        compact ? "pb-14 pt-36 lg:pb-20 lg:pt-48" : "pb-16 pt-40 sm:pb-24 lg:pb-32 lg:pt-56"
      }`}
    >
      {image ? (
        <>
          <Photo src={image} alt="" fill priority sizes="100vw" quality={90} className="animate-kenburns -z-20 object-cover" style={{ objectPosition: imagePosition }} />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/75 to-ink/30" aria-hidden />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-transparent to-ink/50" aria-hidden />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute -right-40 -top-20 -z-10 size-[34rem] glow-sky opacity-40" aria-hidden />
          <div className="pointer-events-none absolute -bottom-40 left-0 -z-10 size-[28rem] glow-gold opacity-25" aria-hidden />
        </>
      )}

      <div className="container-x">
        <nav aria-label={t.nav.breadcrumb} className="animate-rise mb-8 flex flex-wrap items-center gap-1.5 text-sm text-white/70">
          <Link href="/" className="transition hover:text-white">
            {t.nav.home}
          </Link>
          {crumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" aria-hidden />
              <Link href={crumb.href} className="transition hover:text-white">
                {crumb.label}
              </Link>
            </span>
          ))}
        </nav>
        <div className="animate-rise max-w-4xl [animation-delay:80ms]">
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className="font-display text-display mt-5 text-balance font-normal">
            {title}
          </h1>
          {description ? <p className="text-lead mt-6 max-w-2xl text-white/80">{description}</p> : null}
          {children}
        </div>
      </div>
    </section>
  );
}
