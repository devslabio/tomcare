"use client";

import { LifeBuoy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DataTable, type Column } from "@/components/admin/data-table";
import { caseFilters, StatusFilter } from "@/components/admin/inbox";
import { caseStatus } from "@/components/admin/status";
import { Badge, PageHeader } from "@/components/admin/ui";
import type { AssistanceRequest, CaseStatus } from "@/lib/admin-types";
import { formatDateTime } from "@/lib/format";

const columns: Column<AssistanceRequest>[] = [
  {
    header: "Name",
    sort: "name",
    value: (r) => r.name,
    cell: (r) => (
      <Link href={`/admin/requests/${r.id}`} className="flex items-center gap-2 whitespace-nowrap hover:underline">
        {r.status === "NEW" ? <span className="size-2 shrink-0 rounded-full bg-gold" aria-label="New" /> : null}
        <span className={r.status === "NEW" ? "font-semibold text-navy" : "text-navy"}>{r.name}</span>
      </Link>
    ),
  },
  { header: "Email", value: (r) => r.email },
  { header: "Phone", value: (r) => r.phone },
  {
    header: "Needs",
    value: (r) => r.needs.join("; "),
    className: "max-w-md",
    cell: (r) => (
      <Link href={`/admin/requests/${r.id}`} className="block truncate text-sm text-navy hover:underline">
        {r.needs.length ? r.needs.join(" · ") : <span className="text-muted">{r.story}</span>}
      </Link>
    ),
  },
  { header: "City", sort: "city", value: (r) => r.city, cell: (r) => <span className="whitespace-nowrap text-sm">{r.city ?? "—"}</span> },
  { header: "Language", value: (r) => r.language },
  { header: "Story", value: (r) => r.story },
  {
    header: "Status",
    sort: "status",
    value: (r) => caseStatus[r.status].label,
    cell: (r) => <Badge tone={caseStatus[r.status].tone}>{caseStatus[r.status].label}</Badge>,
  },
  {
    header: "Received",
    sort: "createdAt",
    value: (r) => formatDateTime(r.createdAt),
    cell: (r) => <span className="whitespace-nowrap text-sm text-muted">{formatDateTime(r.createdAt)}</span>,
  },
];

export default function RequestsPage() {
  const [status, setStatus] = useState<CaseStatus | "">("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help requests"
        description="People who asked for support through the Get help form. Treat these details as confidential."
      />
      <DataTable
        path="/assistance"
        title="Help requests"
        columns={columns}
        rowKey={(r) => r.id}
        filters={{ status }}
        searchPlaceholder="Search name, email, city, story"
        empty={{ icon: LifeBuoy, title: "No requests here", description: "New requests from the Get help form will appear here." }}
        toolbar={<StatusFilter value={status} onChange={setStatus} options={caseFilters} />}
      />
    </div>
  );
}
