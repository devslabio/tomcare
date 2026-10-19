"use client";

import { ArrowLeft, Reply, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { CasePanel, ContactDetails } from "@/components/admin/inbox";
import { caseStatus, handoffLabels, itemCategoryLabels } from "@/components/admin/status";
import { useToast } from "@/components/admin/toast";
import { Badge, Button, Card, ErrorState, LoadingState } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { ItemDonation } from "@/lib/admin-types";
import { formatDateTime } from "@/lib/format";

const answer = (value: boolean | null) => (value === null ? "Not sure" : value ? "Yes" : "No");

export default function DonatedItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data: donation, error, setData } = useResource<ItemDonation>(`/item-donations/${id}`);

  async function remove() {
    if (!window.confirm("Delete this item donation permanently?")) return;
    try {
      await api(`/item-donations/${id}`, { method: "DELETE" });
      toast("Item donation deleted");
      router.replace("/admin/donated-items");
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  const items = donation ? donation.categories.map((c) => itemCategoryLabels[c]).join(", ") : "";
  const facts = donation
    ? [
        { label: "Items", value: items },
        { label: "Handoff", value: handoffLabels[donation.handoff] },
        ...(donation.handoff === "PICK_UP"
          ? [
              { label: "Pick-up address", value: donation.address ?? "—" },
              { label: "Postal code", value: donation.postalCode ?? "—" },
            ]
          : []),
        ...(donation.categories.includes("VEHICLE")
          ? [
              { label: "Vehicle", value: [donation.vehicle, donation.vehicleYear].filter(Boolean).join(", ") || "—" },
              { label: "Runs", value: answer(donation.vehicleRuns) },
              { label: "Ownership papers", value: answer(donation.hasOwnership) },
            ]
          : []),
      ]
    : [];

  return (
    <div className="space-y-6">
      <Link href="/admin/donated-items" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Donated items
      </Link>
      {error ? <ErrorState message={error} /> : null}
      {!donation && !error ? <LoadingState /> : null}

      {donation ? (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Card>
            <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-navy sm:text-2xl">
                    {items} from {donation.name}
                  </h1>
                  <Badge tone={caseStatus[donation.status].tone}>{caseStatus[donation.status].label}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {handoffLabels[donation.handoff]} · offered {formatDateTime(donation.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${donation.email}?subject=${encodeURIComponent("Your donation to TOMCARE Foundation")}`}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-navy px-3.5 text-sm font-semibold text-white hover:bg-navy-soft"
                >
                  <Reply className="size-4" aria-hidden />
                  Email
                </a>
                <Button variant="danger" size="sm" onClick={remove}>
                  <Trash2 className="size-4" aria-hidden />
                  Delete
                </Button>
              </div>
            </div>
            <div className="space-y-6 p-5 sm:p-6">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">What they’re giving</h2>
                <p className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-7 text-navy">{donation.description}</p>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-sm font-semibold uppercase tracking-wider text-muted">{fact.label}</dt>
                    <dd className="mt-1 text-[15px] text-navy">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>
          <div className="space-y-6">
            <ContactDetails name={donation.name} email={donation.email} phone={donation.phone} extra={[]} />
            <CasePanel path={`/item-donations/${donation.id}`} record={donation} onSaved={(saved) => setData(() => saved)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
