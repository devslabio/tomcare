"use client";

import { Car, CookingPot, Gift, MapPin, Shirt, Sofa, Store } from "lucide-react";
import { useState } from "react";

import { fill } from "@/lib/i18n";
import { useI18n } from "../i18n-provider";
import { Field, FieldLabel, FormError, Honeypot, Sent, SubmitButton, TextArea, useSubmit, type Status } from "./form-kit";

const categories = ["CLOTHING", "HOUSEHOLD", "FURNITURE", "VEHICLE", "OTHER"] as const;
type Category = (typeof categories)[number];
const categoryIcons = { CLOTHING: Shirt, HOUSEHOLD: CookingPot, FURNITURE: Sofa, VEHICLE: Car, OTHER: Gift };

const handoffs = ["DROP_OFF", "PICK_UP"] as const;
type Handoff = (typeof handoffs)[number];
const handoffIcons = { DROP_OFF: Store, PICK_UP: MapPin };

type Answer = "yes" | "no" | "unsure";
const answers: Answer[] = ["yes", "no", "unsure"];
const toBoolean = (answer: Answer | null) => (answer === "yes" ? true : answer === "no" ? false : undefined);

type Offer = { name: string; items: string; handoff: Handoff; vehicle: boolean };

const chip =
  "flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-line bg-white px-3 text-[15px] font-semibold text-ink transition hover:border-indigo/40 peer-checked:border-indigo peer-checked:bg-indigo peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-indigo/20";

export function ItemDonationForm() {
  const { t, locale } = useI18n();
  const copy = t.forms.things;
  const { status, setStatus, submit } = useSubmit("item-donations");

  const [selected, setSelected] = useState<Category[]>([]);
  const [handoff, setHandoff] = useState<Handoff>("DROP_OFF");
  const [handoffChosen, setHandoffChosen] = useState(false);
  const [runs, setRuns] = useState<Answer | null>(null);
  const [ownership, setOwnership] = useState<Answer | null>(null);
  const [localStatus, setLocalStatus] = useState<Status | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);

  const hasVehicle = selected.includes("VEHICLE");

  function toggle(category: Category) {
    const next = selected.includes(category) ? selected.filter((c) => c !== category) : [...selected, category];
    setSelected(categories.filter((c) => next.includes(c)));
    if (!handoffChosen) setHandoff(next.includes("VEHICLE") || next.includes("FURNITURE") ? "PICK_UP" : "DROP_OFF");
    setLocalStatus(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected.length) {
      setLocalStatus({ state: "error", message: copy.categoryRequired });
      return;
    }
    setLocalStatus(null);
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim() || undefined;
    const name = text("name") ?? "";
    const year = Number(text("vehicleYear"));
    const ok = await submit({
      name,
      email: text("email"),
      phone: text("phone"),
      website: text("website"),
      categories: selected,
      description: text("description"),
      handoff,
      ...(handoff === "PICK_UP" && { address: text("address"), postalCode: text("postalCode") }),
      ...(hasVehicle && {
        vehicle: text("vehicle"),
        vehicleYear: Number.isInteger(year) && year > 0 ? year : undefined,
        vehicleRuns: toBoolean(runs),
        hasOwnership: toBoolean(ownership),
      }),
    });
    if (ok) {
      const items = new Intl.ListFormat(locale, { type: "conjunction" }).format(selected.map((c) => copy.categories[c].toLocaleLowerCase(locale)));
      setOffer({ name: name.split(" ")[0], items, handoff, vehicle: hasVehicle });
    }
  }

  if (status.state === "sent" && offer) {
    return (
      <Sent
        title={fill(copy.sentTitle, { name: offer.name })}
        resetLabel={copy.again}
        onReset={() => {
          setOffer(null);
          setSelected([]);
          setHandoff("DROP_OFF");
          setHandoffChosen(false);
          setRuns(null);
          setOwnership(null);
          setStatus({ state: "idle" });
        }}
      >
        <p>{fill(copy.sentText, { items: offer.items })}</p>
        <div className="mt-6 rounded-2xl bg-sand p-5 text-ink">
          <p className="font-bold">{copy.nextTitle}</p>
          <p className="mt-1">{offer.handoff === "PICK_UP" ? copy.nextPickUp : copy.nextDropOff}</p>
          {offer.vehicle ? <p className="mt-3 text-sm text-muted">{copy.nextVehicle}</p> : null}
        </div>
      </Sent>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 rounded-[28px] border border-line bg-white p-6 shadow-[0_30px_60px_-45px_rgba(11,21,55,0.35)] sm:p-10"
    >
      <fieldset>
        <legend className="text-sm font-semibold text-ink">{copy.categoriesLegend}</legend>
        <p className="mb-3 mt-0.5 text-sm text-muted">{copy.categoriesHint}</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            return (
              <label key={category} className="relative">
                <input type="checkbox" className="peer sr-only" checked={selected.includes(category)} onChange={() => toggle(category)} />
                <span className={`${chip} h-14`}>
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {copy.categories[category]}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <TextArea
        label={copy.description}
        name="description"
        required
        rows={3}
        minLength={5}
        maxLength={3000}
        placeholder={copy.descriptionPlaceholder}
      />

      {hasVehicle ? (
        <fieldset className="space-y-5 rounded-2xl bg-paper p-5">
          <legend className="float-left mb-1 w-full text-sm font-semibold text-ink">{copy.vehicleLegend}</legend>
          <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
            <Field label={copy.vehicle} name="vehicle" required maxLength={160} placeholder={copy.vehiclePlaceholder} />
            <Field label={copy.vehicleYear} name="vehicleYear" type="number" maxLength={4} />
          </div>
          <Choice legend={copy.vehicleRuns} name="vehicleRuns" value={runs} onChange={setRuns} />
          <Choice legend={copy.ownership} name="hasOwnership" value={ownership} onChange={setOwnership} />
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">{copy.handoffLegend}</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {handoffs.map((value) => {
            const Icon = handoffIcons[value];
            return (
              <label key={value} className="relative">
                <input
                  type="radio"
                  name="handoff"
                  className="peer sr-only"
                  checked={handoff === value}
                  onChange={() => {
                    setHandoff(value);
                    setHandoffChosen(true);
                  }}
                />
                <span className="flex h-full cursor-pointer gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-indigo/40 peer-checked:border-indigo peer-checked:bg-indigo/[0.04] peer-checked:ring-1 peer-checked:ring-indigo peer-focus-visible:ring-4 peer-focus-visible:ring-indigo/20">
                  <Icon className="mt-0.5 size-5 shrink-0 text-indigo" aria-hidden />
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{copy.handoffs[value].title}</span>
                    <span className="mt-0.5 block text-sm leading-6 text-muted">{copy.handoffs[value].text}</span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {handoff === "PICK_UP" ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_11rem]">
            <Field label={copy.address} name="address" required autoComplete="street-address" maxLength={300} />
            <Field label={copy.postalCode} name="postalCode" autoComplete="postal-code" maxLength={10} />
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-3 text-sm font-semibold text-ink">{copy.detailsLegend}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.forms.name} name="name" required autoComplete="name" maxLength={120} />
          <Field label={t.forms.email} name="email" type="email" required autoComplete="email" />
          <Field label={t.forms.phone} name="phone" type="tel" autoComplete="tel" maxLength={30} />
        </div>
      </fieldset>

      <Honeypot />

      <div className="space-y-4 border-t border-line pt-6">
        <FormError status={localStatus ?? status} />
        <SubmitButton status={status}>{copy.submit}</SubmitButton>
        <p className="text-sm text-muted">{copy.note}</p>
      </div>
    </form>
  );
}

function Choice({ legend, name, value, onChange }: { legend: string; name: string; value: Answer | null; onChange: (answer: Answer) => void }) {
  const { t } = useI18n();
  const copy = t.forms.things;
  const labels = { yes: copy.yes, no: copy.no, unsure: copy.notSure };
  return (
    <fieldset>
      <legend className="mb-2">
        <FieldLabel label={legend} />
      </legend>
      <div className="flex flex-wrap gap-2">
        {answers.map((answer) => (
          <label key={answer} className="relative">
            <input type="radio" name={name} className="peer sr-only" checked={value === answer} onChange={() => onChange(answer)} />
            <span className={`${chip} h-10 px-4 text-sm`}>{labels[answer]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
