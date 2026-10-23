"use client";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { ArrowLeft, Check, Loader2, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { fill } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import { useI18n } from "../i18n-provider";
import { Field, FieldLabel, FormError, Honeypot, Sent, SubmitButton, TextArea, useSubmit, type Status } from "./form-kit";

const presets = [25, 50, 100, 250, 500, 1000];
const frequencies = ["ONCE", "MONTHLY", "QUARTERLY", "YEARLY"] as const;
type Frequency = (typeof frequencies)[number];

type Gift = {
  name: string;
  amount: number;
  frequency: Frequency;
  cause: string;
  /** Card gifts only: whether Stripe has confirmed the payment (null while it's still being confirmed). */
  paid?: boolean | null;
};

type Checkout = { sessionId: string; clientSecret: string; stripe: Promise<Stripe | null> };

const chip =
  "flex cursor-pointer items-center justify-center rounded-2xl border border-line bg-white px-3 text-[15px] font-semibold text-ink transition hover:border-indigo/40 peer-checked:border-indigo peer-checked:bg-indigo peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-indigo/20";

/** Collapses the gap left by an empty placeholder, e.g. a one-time gift has no "every month". */
const sentence = (text: string) =>
  text
    .replace(/\s+/g, " ")
    .replace(/\s([.,:])/g, "$1")
    .trim();

const stripes = new Map<string, Promise<Stripe | null>>();
const stripeFor = (key: string) => {
  if (!stripes.has(key)) stripes.set(key, loadStripe(key).catch(() => null));
  return stripes.get(key)!;
};

type Confirmation = { paid: boolean; amount: number | null; frequency: Frequency | null; firstName: string | null };

async function confirmPayment(sessionId: string): Promise<Confirmation | null> {
  try {
    const response = await fetch("/v1/public/donations/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    return response.ok ? ((await response.json()) as Confirmation) : null;
  } catch {
    return null;
  }
}

export function DonationForm({ programs, card }: { programs: { slug: string; title: string }[]; card: boolean }) {
  const { t, locale } = useI18n();
  const copy = t.forms.donate;
  const { status, setStatus, submit } = useSubmit("donations");
  const top = useRef<HTMLDivElement>(null);

  const [preset, setPreset] = useState<number | null>(50);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("ONCE");
  const [program, setProgram] = useState("");
  const [localStatus, setLocalStatus] = useState<Status | null>(null);
  const [gift, setGift] = useState<Gift | null>(null);
  const [checkout, setCheckout] = useState<(Checkout & { gift: Gift }) | null>(null);
  const [confirming, setConfirming] = useState(false);

  const amount = preset ?? (Number(custom.replace(",", ".")) || 0);
  const money = amount >= 1 ? formatMoney(amount, locale) : "";
  const programTitle = programs.find((p) => p.slug === program)?.title;
  const cause = programTitle ? fill(copy.causeProgram, { title: programTitle }) : copy.causeGeneralPhrase;
  const impact = t.donate.impact.find((item) => Number(item.amount.replace(/\D/g, "")) === amount)?.text;

  // Back from Stripe after a payment method that needed a redirect (cards and wallets finish on this page).
  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("paid");
    if (!sessionId?.startsWith("cs_")) return;
    url.searchParams.delete("paid");
    window.history.replaceState(null, "", url);
    confirmPayment(sessionId).then((result) => {
      if (!result?.amount || !result.frequency) return;
      setGift({ name: result.firstName ?? "", amount: result.amount, frequency: result.frequency, cause: "", paid: result.paid });
    });
  }, []);

  const scrollToTop = () =>
    requestAnimationFrame(() => {
      if (top.current && top.current.getBoundingClientRect().top < 0) top.current.scrollIntoView({ behavior: "smooth", block: "start" });
    });

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
    const reply = await submit({
      name,
      email: text("email"),
      phone: text("phone"),
      message: text("message"),
      website: text("website"),
      anonymous: data.get("anonymous") === "on",
      amount: Math.round(amount * 100) / 100,
      frequency,
      method: card ? "CARD" : "IN_PERSON",
      program: program || undefined,
      locale,
    });
    if (!reply) return;
    const pledged: Gift = { name: name.split(" ")[0], amount, frequency, cause };
    const { sessionId, clientSecret, publishableKey } = reply;
    if (typeof sessionId === "string" && typeof clientSecret === "string" && typeof publishableKey === "string") {
      setCheckout({ sessionId, clientSecret, stripe: stripeFor(publishableKey), gift: pledged });
      scrollToTop();
    } else {
      setGift(pledged);
    }
  }

  async function onPaid() {
    if (!checkout) return;
    setConfirming(true);
    const result = await confirmPayment(checkout.sessionId);
    setGift({ ...checkout.gift, paid: result?.paid ?? null });
    setCheckout(null);
    setConfirming(false);
  }

  function reset() {
    setGift(null);
    setCheckout(null);
    setStatus({ state: "idle" });
  }

  if (gift) {
    const giftMoney = formatMoney(gift.amount, locale);
    const every = copy.every[gift.frequency];
    if (gift.paid !== undefined) {
      return (
        <Sent title={gift.name ? fill(copy.paidTitleNamed, { name: gift.name }) : copy.paidTitle} resetLabel={copy.again} onReset={reset}>
          <p>{sentence(fill(copy.paidText, { amount: giftMoney, every }))}</p>
          <div className="mt-6 rounded-2xl bg-sand p-5 text-ink">
            <p className="font-bold">{copy.nextTitle}</p>
            <p className="mt-1">{gift.paid ? copy.paidNext : copy.paidPending}</p>
            {gift.paid && gift.frequency !== "ONCE" ? <p className="mt-3 text-sm text-muted">{copy.paidRecurring}</p> : null}
          </div>
        </Sent>
      );
    }
    return (
      <Sent title={fill(copy.sentTitle, { name: gift.name })} resetLabel={copy.again} onReset={reset}>
        <p>{sentence(fill(copy.sentText, { amount: giftMoney, every, cause: gift.cause }))}</p>
        <div className="mt-6 rounded-2xl bg-sand p-5 text-ink">
          <p className="font-bold">{copy.nextTitle}</p>
          <p className="mt-1">{copy.nextInPerson}</p>
          {gift.frequency !== "ONCE" ? <p className="mt-3 text-sm text-muted">{copy.nextRecurring}</p> : null}
        </div>
      </Sent>
    );
  }

  if (checkout || confirming) {
    return (
      <div ref={top} className="scroll-mt-32 rounded-[28px] border border-line bg-white p-3 shadow-[0_30px_60px_-45px_rgba(11,21,55,0.35)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-4 pt-2">
          <p className="font-display text-xl text-ink">{copy.checkoutTitle}</p>
          {checkout && !confirming ? (
            <button
              type="button"
              onClick={() => {
                setCheckout(null);
                setStatus({ state: "idle" });
              }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden />
              {copy.checkoutBack}
            </button>
          ) : null}
        </div>
        {confirming || !checkout ? (
          <p className="flex items-center gap-2 px-3 pb-6 text-[15px] text-muted" role="status">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {copy.confirming}
          </p>
        ) : (
          <EmbeddedCheckoutProvider key={checkout.clientSecret} stripe={checkout.stripe} options={{ clientSecret: checkout.clientSecret, onComplete: onPaid }}>
            <EmbeddedCheckout className="min-h-[28rem]" />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    );
  }

  const shownStatus = localStatus ?? status;

  return (
    <div ref={top} className="scroll-mt-32">
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
              {sentence(fill(copy.summary, { amount: money, every: copy.every[frequency], cause }))}
            </p>
          ) : null}
          <FormError status={shownStatus} />
          <SubmitButton status={status} tone="gold">
            {money ? fill(card ? copy.submitCard : copy.submit, { amount: money }) : copy.submitEmpty}
          </SubmitButton>
          {card ? (
            <p className="flex gap-2 text-sm text-muted">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
              {copy.noteCard}
            </p>
          ) : (
            <p className="text-sm text-muted">{copy.note}</p>
          )}
        </div>
      </form>
    </div>
  );
}
