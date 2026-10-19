"use client";

import { Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DataTable, type Column } from "@/components/admin/data-table";
import { caseFilters, StatusFilter } from "@/components/admin/inbox";
import { caseStatus, handoffLabels, itemCategoryLabels } from "@/components/admin/status";
import { Badge, PageHeader } from "@/components/admin/ui";
import type { CaseStatus, ItemDonation } from "@/lib/admin-types";
import { formatDateTime } from "@/lib/format";

const itemsOf = (d: ItemDonation) => d.categories.map((c) => itemCategoryLabels[c]).join(", ");

const columns: Column<ItemDonation>[] = [
  {
    header: "Donor",
    sort: "name",
    value: (d) => d.name,
    cell: (d) => (
      <Link href={`/admin/donated-items/${d.id}`} className="flex items-center gap-2 whitespace-nowrap hover:underline">
        {d.status === "NEW" ? <span className="size-2 shrink-0 rounded-full bg-gold" aria-label="New" /> : null}
        <span className={d.status === "NEW" ? "font-semibold text-navy" : "text-navy"}>{d.name}</span>
      </Link>
    ),
  },
  { header: "Items", value: itemsOf, cell: (d) => <span className="text-sm">{itemsOf(d)}</span> },
  { header: "Description", value: (d) => d.description },
  {
    header: "Handoff",
    sort: "handoff",
    value: (d) => handoffLabels[d.handoff],
    cell: (d) => <Badge tone={d.handoff === "PICK_UP" ? "blue" : "gray"}>{handoffLabels[d.handoff]}</Badge>,
  },
  { header: "Postal code", value: (d) => d.postalCode, cell: (d) => <span className="whitespace-nowrap text-sm">{d.postalCode ?? "—"}</span> },
  { header: "Vehicle", value: (d) => d.vehicle },
  { header: "Email", value: (d) => d.email, cell: (d) => <span className="text-sm">{d.email}</span> },
  { header: "Phone", value: (d) => d.phone },
  {
    header: "Status",
    sort: "status",
    value: (d) => caseStatus[d.status].label,
    cell: (d) => <Badge tone={caseStatus[d.status].tone}>{caseStatus[d.status].label}</Badge>,
  },
  {
    header: "Offered",
    sort: "createdAt",
    value: (d) => formatDateTime(d.createdAt),
    cell: (d) => <span className="whitespace-nowrap text-sm text-muted">{formatDateTime(d.createdAt)}</span>,
  },
];

export default function DonatedItemsPage() {
  const [status, setStatus] = useState<CaseStatus | "">("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donated items"
        description="Clothes, household goods, furniture and vehicles offered on the Donate page. Reply to confirm what you can accept and arrange drop-off or pick-up."
      />
      <DataTable
        path="/item-donations"
        title="Donated items"
        columns={columns}
        rowKey={(d) => d.id}
        filters={{ status }}
        searchPlaceholder="Search donor, items, address, vehicle"
        empty={{ icon: Package, title: "No item donations here", description: "Items offered on the Donate page will appear here." }}
        toolbar={<StatusFilter value={status} onChange={setStatus} options={caseFilters} />}
      />
    </div>
  );
}
