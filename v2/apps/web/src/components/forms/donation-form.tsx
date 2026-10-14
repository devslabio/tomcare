"use client";

import { Check, Copy, CreditCard, ExternalLink, HandCoins, Mail } from "lucide-react";
import { useState } from "react";

import { fill } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import { useI18n } from "../i18n-provider";
import { Field, FieldLabel, FormError, Honeypot, Sent, SubmitButton, TextArea, useSubmit, type Status } from "./form-kit";

const presets = [25, 50, 100, 250, 500, 1000];
const frequencies = ["ONCE", "MONTHLY", "QUARTERLY", "YEARLY"] as const;
type Frequency = (typeof frequencies)[number];
type Method = "ETRANSFER" | "ONLINE" | "IN_PERSON";
const methodIcons = {
  ETRANSFER: Mail,
  ONLINE: CreditCard,
  IN_PERSON: HandCoins,
};

type Gift = {
  name: string;
  amount: number;
  frequency: Frequency;
  cause: string;
  method: Method;
};

const chip =
  "flex cursor-pointer items-center justify-center rounded-2xl border border-line bg-white px-3 text-[15px] font-semibold text-ink transition hover:border-indigo/40 peer-checked:border-indigo peer-checked:bg-indigo peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-indigo/20";

/** Collapses the gap left by an empty placeholder, e.g. a one-time gift has no "every month". */
const sentence = (text: string) =>
  text
    .replace(/\s+/g, " ")
    .replace(/\s([.,:])/g, "$1")
    .trim();

export function DonationForm({
  programs,
  etransferEmail,
  donationUrl,
}: {
  programs: { slug: string; title: string }[];
  etransferEmail: string;
  donationUrl: string;
}) {
  const { t, locale } = useI18n();
  const copy = t.forms.donate;
  const { status, setStatus, submit } = useSubmit("donations");
  const methods = (["ETRANSFER", "ONLINE", "IN_PERSON"] as const).filter(
    (method) => (method !== "ETRANSFER" || etransferEmail) && (method !== "ONLINE" || donationUrl),
  );

  const [preset, setPreset] = useState<number | null>(50);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("ONCE");
  const [program, setProgram] = useState("");
  const [method, setMethod] = useState<Method>(methods[0]);
  const [localStatus, setLocalStatus] = useState<Status | null>(null);
  const [gift, setGift] = useState<Gift | null>(null);

  const amount = preset ?? (Number(custom.replace(",", ".")) || 0);
  const money = amount >= 1 ? formatMoney(amount, locale) : "";
  const programTitle = programs.find((p) => p.slug === program)?.title;
  const cause = programTitle ? fill(copy.causeProgram, { title: programTitle }) : copy.causeGeneralPhrase;
  const impact = t.donate.impact.find((item) => Number(item.amount.replace(/\D/g, "")) === amount)?.text;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (amount < 1) {
      setLocalStatus({ state: "error", message: copy.amountRequired });
      return;
    }
    setLocalStatus(null);
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim() || undefined;
    const name = text("name") ?? "";
    const ok = await submit({
      name,
      email: text("email"),
      phone: text("phone"),
      message: text("message"),
      website: text("website"),
      anonymous: data.get("anonymous") === "on",
      amount: Math.round(amount * 100) / 100,
      frequency,
      method,
      program: program || undefined,
    });
    if (ok) setGift({ name: name.split(" ")[0], amount, frequency, cause, method });
  }

  if (status.state === "sent" && gift) {
    const giftMoney = formatMoney(gift.amount, locale);
    return (
      <Sent
        title={fill(copy.sentTitle, { name: gift.name })}
        resetLabel={copy.again}
        onReset={() => {
          setGift(null);
          setStatus({ state: "idle" });
        }}
      >
        <p>
          {sentence(
            fill(copy.sentText, {
              amount: giftMoney,
              every: copy.every[gift.frequency],
              cause: gift.cause,
            }),
          )}
        </p>
        <div className="mt-6 rounded-2xl bg-sand p-5 text-ink">
          <p className="font-bold">{copy.nextTitle}</p>
          {gift.method === "ETRANSFER" ? (
            <>
              <p className="mt-1">{fill(copy.nextEtransfer, { amount: giftMoney })}</p>
              <CopyLine value={etransferEmail} />
            </>
          ) : gift.method === "ONLINE" ? (
            <>
              <p className="mt-1">{copy.nextOnline}</p>
              <a
                href={donationUrl}
                target="_blank"
                rel="noopener"
                className="mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-[15px] font-semibold text-ink transition hover:bg-[#f0bb2e]"
              >
                {copy.continueOnline}
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </>
          ) : (
            <p className="mt-1">{copy.nextInPerson}</p>
          )}
          {gift.frequency !== "ONCE" ? <p className="mt-3 text-sm text-muted">{copy.nextRecurring}</p> : null}
        </div>
      </Sent>
    );
  }

  const shownStatus = localStatus ?? status;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 rounded-[28px] border border-line bg-white p-6 shadow-[0_30px_60px_-45px_rgba(11,21,55,0.35)] sm:p-10"
    >
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">{copy.amountLegend}</legend>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {presets.map((value) => (
            <label key={value} className="relative">
              <input
                type="radio"
                name="preset"
                className="peer sr-only"
                checked={preset === value}
                onChange={() => {
                  setPreset(value);
                  setCustom("");
                }}
              />
              <span className={`${chip} h-14 tabular-nums`}>{formatMoney(value, locale)}</span>
            </label>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="sr-only">{copy.customAmount}</span>
          <span className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-muted" aria-hidden>
              $
            </span>
            <input
              inputMode="decimal"
              value={custom}
              onChange={(event) => {
                setCustom(event.target.value.replace(/[^\d.,]/g, ""));
                setPreset(null);
              }}
              onFocus={() => setPreset(null)}
              placeholder={copy.customAmount}
              className={`w-full rounded-xl border bg-white py-3 pl-9 pr-4 text-[15px] text-ink outline-none transition placeholder:text-ink/35 focus:border-indigo focus:ring-4 focus:ring-indigo/10 ${
                preset === null && custom ? "border-indigo" : "border-line"
              }`}
            />
          </span>
        </label>
        {impact ? (
          <p className="mt-3 flex gap-2 text-[15px] leading-7 text-ink/80" aria-live="polite">
            <Check className="mt-1 size-4 shrink-0 text-gold-deep" aria-hidden />
            {impact}
          </p>
        ) : null}
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">{copy.frequencyLegend}</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {frequencies.map((value) => (
            <label key={value} className="relative">
              <input
                type="radio"
                name="frequency"
                className="peer sr-only"
                checked={frequency === value}
                onChange={() => setFrequency(value)}
              />
              <span className={`${chip} h-12 text-sm`}>{copy.frequencies[value]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <FieldLabel label={copy.cause} required />
        <span className="relative block">
          <select
            value={program}
            onChange={(event) => setProgram(event.target.value)}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 pr-10 text-[15px] text-ink outline-none transition focus:border-indigo focus:ring-4 focus:ring-indigo/10"
          >
            <option value="">{copy.causeGeneral}</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
          </svg>
        </span>
      </label>

      {methods.length === 1 ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">{copy.methodLegend}</p>
          <MethodCard method={methods[0]} />
        </div>
      ) : (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-ink">{copy.methodLegend}</legend>
          <div className={`grid gap-2.5 ${methods.length === 3 ? "sm:grid-cols-3" : methods.length === 2 ? "sm:grid-cols-2" : ""}`}>
            {methods.map((value) => {
              return (
                <label key={value} className="relative">
                  <input type="radio" name="method" className="peer sr-only" checked={method === value} onChange={() => setMethod(value)} />
                  <MethodCard method={value} selectable />
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <fieldset className="space-y-5">
        <legend className="mb-3 text-sm font-semibold text-ink">{copy.detailsLegend}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.forms.name} name="name" required autoComplete="name" maxLength={120} />
          <Field label={t.forms.email} name="email" type="email" required autoComplete="email" />
          <Field label={t.forms.phone} name="phone" type="tel" autoComplete="tel" maxLength={30} />
        </div>
        <TextArea label={copy.message} name="message" rows={3} maxLength={2000} />
        <label className="flex cursor-pointer items-start gap-3 text-[15px] text-ink/85">
          <input type="checkbox" name="anonymous" className="mt-1 size-4 shrink-0 accent-indigo" />
          {copy.anonymous}
        </label>
      </fieldset>

      <Honeypot />

      <div className="space-y-4 border-t border-line pt-6">
        {money ? (
          <p className="text-[15px] text-ink" aria-live="polite">
            {sentence(
              fill(copy.summary, {
                amount: money,
                every: copy.every[frequency],
                cause,
              }),
            )}
          </p>
        ) : null}
        <FormError status={shownStatus} />
        <SubmitButton status={status} tone="gold">
          {money ? fill(copy.submit, { amount: money }) : copy.submitEmpty}
        </SubmitButton>
        <p className="text-sm text-muted">{copy.note}</p>
      </div>
    </form>
  );
}

function CopyLine({ value }: { value: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-white py-2 pl-4 pr-2">
      <span className="min-w-0 flex-1 break-all font-semibold">{value}</span>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-indigo hover:bg-indigo/5"
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {copied ? t.forms.donate.copied : t.forms.donate.copy}
      </button>
    </div>
  );
}

function MethodCard({ method, selectable = false }: { method: Method; selectable?: boolean }) {
  const { t } = useI18n();
  const copy = t.forms.donate;
  const Icon = methodIcons[method];
  return (
    <span
      className={`flex h-full gap-3 rounded-2xl border border-line p-4 ${
        selectable
          ? "cursor-pointer bg-white transition hover:border-indigo/40 peer-checked:border-indigo peer-checked:bg-indigo/[0.04] peer-checked:ring-1 peer-checked:ring-indigo peer-focus-visible:ring-4 peer-focus-visible:ring-indigo/20"
          : "bg-paper"
      }`}
    >
      <Icon className="mt-0.5 size-5 shrink-0 text-indigo" aria-hidden />
      <span>
        <span className="block text-[15px] font-semibold text-ink">{copy.methods[method].title}</span>
        <span className="mt-0.5 block text-sm leading-6 text-muted">{copy.methods[method].text}</span>
      </span>
    </span>
  );
}
