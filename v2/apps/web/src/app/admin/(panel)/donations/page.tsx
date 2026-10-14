"use client";

import { CircleDollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DataTable, type Column } from "@/components/admin/data-table";
import { caseFilters, StatusFilter } from "@/components/admin/inbox";
import { caseStatus, frequencyLabels, methodLabels } from "@/components/admin/status";
import { Badge, PageHeader } from "@/components/admin/ui";
import type { CaseStatus, DonationPledge } from "@/lib/admin-types";
import { formatDateTime, formatMoney } from "@/lib/format";

const columns: Column<DonationPledge>[] = [
  {
    header: "Donor",
    sort: "name",
    value: (d) => d.name,
    cell: (d) => (
      <Link href={`/admin/donations/${d.id}`} className="flex items-center gap-2 whitespace-nowrap hover:underline">
        {d.status === "NEW" ? <span className="size-2 shrink-0 rounded-full bg-gold" aria-label="New" /> : null}
        <span className={d.status === "NEW" ? "font-semibold text-navy" : "text-navy"}>{d.name}</span>
      </Link>
    ),
  },
  {
    header: "Amount",
    sort: "amount",
    value: (d) => formatMoney(d.amountCents / 100),
    cell: (d) => <span className="whitespace-nowrap font-semibold tabular-nums text-navy">{formatMoney(d.amountCents / 100)}</span>,
  },
  {
    header: "How often",
    value: (d) => frequencyLabels[d.frequency],
    cell: (d) => <span className="whitespace-nowrap text-sm">{frequencyLabels[d.frequency]}</span>,
  },
  {
    header: "For",
    value: (d) => d.cause ?? "Where needed most",
    cell: (d) => <span className="text-sm">{d.cause ?? "Where needed most"}</span>,
  },
  {
    header: "Paying by",
    value: (d) => methodLabels[d.method],
    cell: (d) => <span className="whitespace-nowrap text-sm">{methodLabels[d.method]}</span>,
  },
  {
    header: "Email",
    value: (d) => d.email,
    cell: (d) => <span className="text-sm">{d.email}</span>,
  },
  { header: "Phone", value: (d) => d.phone },
  { header: "Anonymous", value: (d) => (d.anonymous ? "Yes" : "No") },
  { header: "Note", value: (d) => d.message },
  {
    header: "Status",
    sort: "status",
    value: (d) => caseStatus[d.status].label,
    cell: (d) => <Badge tone={caseStatus[d.status].tone}>{caseStatus[d.status].label}</Badge>,
  },
  {
    header: "Pledged",
    sort: "createdAt",
    value: (d) => formatDateTime(d.createdAt),
    cell: (d) => <span className="whitespace-nowrap text-sm text-muted">{formatDateTime(d.createdAt)}</span>,
  },
];

export default function DonationsPage() {
  const [status, setStatus] = useState<CaseStatus | "">("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donations"
        description="Gifts pledged on the Donate page. No payment is taken on the website — confirm each gift when it arrives and mark it accepted."
      />
      <DataTable
        path="/donations"
        title="Donations"
        columns={columns}
        rowKey={(d) => d.id}
        filters={{ status }}
        searchPlaceholder="Search donor, email, program"
        empty={{
          icon: CircleDollarSign,
          title: "No donations here",
          description: "Gifts pledged on the Donate page will appear here.",
        }}
        toolbar={<StatusFilter value={status} onChange={setStatus} options={caseFilters} />}
      />
    </div>
  );
}
