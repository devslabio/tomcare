import { ArrowRight } from "lucide-react";
import { Link } from "@/components/link";

type Variant = "primary" | "gold" | "light" | "outline" | "outline-light" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-indigo text-white shadow-[0_12px_30px_-12px_rgba(45,56,138,0.7)] hover:bg-indigo-deep",
  gold: "bg-gold text-ink shadow-[0_12px_30px_-12px_rgba(229,172,27,0.8)] hover:bg-[#f0bb2e]",
  light: "bg-white text-ink hover:bg-cream",
  outline: "border border-ink/15 bg-white/60 text-ink hover:border-ink/40 hover:bg-white",
  "outline-light": "border border-white/30 text-white hover:border-white/70 hover:bg-white/10",
  ghost: "text-indigo hover:text-indigo-deep px-0! h-auto!",
};

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
  arrow = true,
}: {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  arrow?: boolean;
}) {
  const classes = `group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-all duration-300 ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow ? (
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      ) : null}
    </>
  );
  if (/^(https?:|tel:|mailto:)/.test(href)) {
    return (
      <a href={href} className={classes} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

export function Eyebrow({ children, light, className = "" }: { children: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <p
      className={`inline-flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.2em] ${
        light ? "text-gold" : "text-indigo"
      } ${className}`}
    >
      <span className={`h-[2px] w-6 rounded-full ${light ? "bg-gold" : "bg-gold"}`} aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  light,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  light?: boolean;
  align?: "left" | "center";
  action?: React.ReactNode;
}) {
  const centered = align === "center";
  return (
    <div
      data-reveal
      className={`flex flex-col gap-6 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}
    >
      <div className={centered ? "max-w-3xl" : "max-w-2xl"}>
        {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
        <h2
          className={`font-display text-h2 mt-4 text-balance font-medium ${
            light ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {description ? (
          <p className={`text-lead mt-5 ${light ? "text-white/75" : "text-muted"}`}>{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Avatar({ name, photo, className = "size-12" }: { name: string; photo?: string | null; className?: string }) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt="" className={`${className} shrink-0 rounded-full object-cover`} />;
  }
  return (
    <span
      className={`${className} inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-brand font-bold tracking-wide text-white`}
      aria-hidden
    >
      {letters}
    </span>
  );
}
