"use client";

import { ArrowLeft, Reply, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { CasePanel, ContactDetails } from "@/components/admin/inbox";
import { caseStatus, frequencyLabels, methodLabels } from "@/components/admin/status";
import { useToast } from "@/components/admin/toast";
import { Badge, Button, Card, ErrorState, LoadingState } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { DonationPledge } from "@/lib/admin-types";
import { formatDateTime, formatMoney } from "@/lib/format";

export default function DonationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data: donation, error, setData } = useResource<DonationPledge>(`/donations/${id}`);

  async function remove() {
    if (!window.confirm("Delete this donation record permanently?")) return;
    try {
      await api(`/donations/${id}`, { method: "DELETE" });
      toast("Donation deleted");
      router.replace("/admin/donations");
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  const facts = donation
    ? [
        { label: "Amount", value: formatMoney(donation.amountCents / 100) },
        { label: "How often", value: frequencyLabels[donation.frequency] },
        { label: "For", value: donation.cause ?? "Where it’s needed most" },
        { label: "Paying by", value: methodLabels[donation.method] },
        {
          label: "Recognition",
          value: donation.anonymous ? "Keep anonymous" : "Can be thanked publicly",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <Link href="/admin/donations" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Donations
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
                    {formatMoney(donation.amountCents / 100)} from {donation.name}
                  </h1>
                  <Badge tone={caseStatus[donation.status].tone}>{caseStatus[donation.status].label}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {frequencyLabels[donation.frequency]} · pledged {formatDateTime(donation.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${donation.email}?subject=${encodeURIComponent("Thank you for your gift to TOMCARE Foundation")}`}
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
              <dl className="grid gap-4 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-sm font-semibold uppercase tracking-wider text-muted">{fact.label}</dt>
                    <dd className="mt-1 text-[15px] text-navy">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              {donation.message ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Note from the donor</h2>
                  <p className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-7 text-navy">{donation.message}</p>
                </div>
              ) : null}
              <p className="rounded-xl bg-sand px-4 py-3 text-sm text-navy">
                No payment is taken on the website. Mark this gift as accepted once the money arrives, and send the tax receipt.
              </p>
            </div>
          </Card>
          <div className="space-y-6">
            <ContactDetails name={donation.name} email={donation.email} phone={donation.phone} extra={[]} />
            <CasePanel path={`/donations/${donation.id}`} record={donation} onSaved={(saved) => setData(() => saved)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
