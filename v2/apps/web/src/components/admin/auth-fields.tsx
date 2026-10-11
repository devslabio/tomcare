"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useState } from "react";

const fieldClass =
  "h-12 w-full rounded-lg border border-transparent bg-navy/[0.045] pl-10 text-[15px] text-navy outline-none transition placeholder:text-muted/80 hover:bg-navy/[0.07] focus:border-navy/25 focus:bg-white focus:ring-4 focus:ring-brand/25 disabled:opacity-60";

export function AuthField({
  label,
  icon: Icon,
  type = "text",
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & { label: string; icon: LucideIcon }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-medium text-navy">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input {...props} type={isPassword && visible ? "text" : type} className={`${fieldClass} ${isPassword ? "pr-12" : "pr-3.5"}`} />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted transition hover:bg-brand/15 hover:text-navy"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        ) : null}
      </span>
    </label>
  );
}

export function AuthSubmit({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-navy text-base font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60"
    >
      {children}
    </button>
  );
}
