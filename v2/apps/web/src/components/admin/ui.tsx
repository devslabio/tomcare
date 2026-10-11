"use client";

import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { uploadImage } from "@/lib/admin-api";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-navy text-white hover:bg-navy-soft",
  secondary: "border border-line bg-white text-navy hover:bg-sand",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  ghost: "text-navy hover:bg-sand",
};

export function Button({
  variant = "primary",
  size = "md",
  busy,
  className = "",
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled || busy}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        size === "sm" ? "h-9 px-3.5 text-sm" : "h-11 px-5 text-sm"
      } ${buttonStyles[variant]} ${className}`}
      {...props}
    >
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-navy outline-none transition placeholder:text-muted/60 focus:border-navy focus:ring-4 focus:ring-navy/5 disabled:bg-sand";

export function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-navy">{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {hint ? <span className="mt-1.5 block text-xs leading-5 text-muted">{hint}</span> : null}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-28 resize-y leading-6 ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} pr-8 ${props.className ?? ""}`} />;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className="relative mt-0.5 h-6 w-10 shrink-0 rounded-full bg-line transition peer-checked:bg-brand-dark peer-focus-visible:ring-4 peer-focus-visible:ring-navy/10 after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-4"
      />
      <span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        {description ? <span className="block text-xs leading-5 text-muted">{description}</span> : null}
      </span>
    </label>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-[15px] text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-line bg-white ${className}`}>{children}</div>;
}

const badgeTones = {
  green: "bg-teal/10 text-[#0b7a66]",
  navy: "bg-navy text-white",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-50 text-red-700",
  gray: "bg-sand text-muted",
  blue: "bg-sky-50 text-sky-800",
} as const;

export type BadgeTone = keyof typeof badgeTones;

export function Badge({ tone = "gray", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="mt-2 font-semibold underline underline-offset-4">
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-sand text-navy">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-semibold text-navy">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className={`m-auto w-[calc(100%-2rem)] rounded-3xl bg-white p-0 text-navy shadow-2xl backdrop:bg-navy/40 backdrop:backdrop-blur-[2px] ${
        wide ? "max-w-3xl" : "max-w-lg"
      }`}
    >
      {open ? (
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-9 items-center justify-center rounded-full hover:bg-sand"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}

export function FormActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-line pt-5">{children}</div>;
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      {message}
    </p>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex h-11 w-full items-center gap-2 rounded-full border border-line bg-white px-4 focus-within:border-navy sm:w-72">
      <Search className="size-4 shrink-0 text-muted" aria-hidden />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
      />
    </label>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm text-muted">
      <span>
        Page {page} of {pages} · {total} total
      </span>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="ghost" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  hint = "JPEG, PNG or WebP, up to 10 MB",
  aspect = "aspect-[4/5]",
  contain,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  aspect?: string;
  contain?: boolean;
}) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return setError("Images must be 10 MB or smaller.");
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadImage(file));
    } catch (uploadError) {
      setError((uploadError as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="text-sm font-medium text-navy">{label}</span>
      <div className="mt-1.5 flex items-center gap-4">
        <div className={`relative w-28 shrink-0 overflow-hidden rounded-xl border border-line bg-sand ${aspect}`}>
          {value ? (
            // Previews include uploaded files and static assets of unknown size.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className={`size-full ${contain ? "object-contain p-2" : "object-cover object-top"}`} />
          ) : (
            <span className="flex size-full items-center justify-center text-navy/30">
              <ImagePlus className="size-6" aria-hidden />
            </span>
          )}
          {busy ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="size-5 animate-spin text-navy" aria-hidden />
            </span>
          ) : null}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={id}
              className="inline-flex h-9 cursor-pointer items-center rounded-full border border-line bg-white px-3.5 text-sm font-semibold text-navy hover:bg-sand"
            >
              {value ? "Replace" : "Upload"}
            </label>
            {value ? (
              <Button variant="ghost" size="sm" onClick={() => onChange("")}>
                Remove
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted">{hint}</p>
          <input
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              void onFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <input
            type="url"
            key={value}
            defaultValue={value.startsWith("http") ? value : ""}
            placeholder="…or paste an image link (https://)"
            onBlur={(event) => {
              const url = event.target.value.trim();
              if (url === (value.startsWith("http") ? value : "")) return;
              if (!url) return onChange("");
              if (!/^https:\/\/\S+$/.test(url)) return setError("Image links must start with https://");
              setError(null);
              onChange(url);
            }}
            className="h-9 w-full min-w-56 rounded-full border border-line bg-white px-3.5 text-xs text-navy outline-none placeholder:text-muted/70 focus:border-navy"
          />
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

export function GalleryField({
  label,
  value,
  onChange,
  max = 40,
}: {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: File[]) {
    if (!files.length) return;
    const room = max - value.length;
    const accepted = files.filter((file) => file.size <= 10 * 1024 * 1024).slice(0, room);
    setBusy(true);
    setError(
      accepted.length < files.length ? `Some files were skipped (10 MB limit, at most ${max} photos).` : null,
    );
    const urls: string[] = [];
    try {
      for (const file of accepted) urls.push(await uploadImage(file));
    } catch (uploadError) {
      setError((uploadError as Error).message);
    } finally {
      if (urls.length) onChange([...value, ...urls]);
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="text-sm font-medium text-navy">{label}</span>
      <div className="mt-1.5 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((url, index) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-sand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="absolute right-1 top-1 inline-flex size-7 items-center justify-center rounded-full bg-white/90 text-navy shadow hover:bg-white"
              aria-label={`Remove photo ${index + 1}`}
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {value.length < max ? (
          <label
            htmlFor={id}
            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-white text-xs font-semibold text-muted hover:bg-sand"
          >
            {busy ? <Loader2 className="size-5 animate-spin text-navy" aria-hidden /> : <ImagePlus className="size-5" aria-hidden />}
            {busy ? "Uploading…" : "Add photos"}
          </label>
        ) : null}
      </div>
      <input
        id={id}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={busy}
        onChange={(event) => {
          void onFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
      <p className="mt-1.5 text-xs text-muted">JPEG, PNG or WebP, up to 10 MB each.</p>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

export function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
