export function initials(name?: string | null, email?: string | null) {
  const parts = name?.trim().split(/\s+/) ?? [];
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (email?.trim().slice(0, 2) ?? "RI").toUpperCase();
}

const sizes = {
  sm: "size-8 text-xs",
  md: "size-9 text-sm",
  lg: "size-10 text-sm",
  xl: "size-[72px] text-xl",
};

export function Avatar({
  name,
  email,
  size = "md",
  className = "",
}: {
  name?: string | null;
  email?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-navy ${sizes[size]} ${className}`}
      aria-hidden
    >
      {initials(name, email)}
    </span>
  );
}
