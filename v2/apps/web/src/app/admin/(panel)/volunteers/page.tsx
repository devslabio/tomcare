"use client";

import { HandHeart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DataTable, type Column } from "@/components/admin/data-table";
import { caseFilters, StatusFilter } from "@/components/admin/inbox";
import { caseStatus } from "@/components/admin/status";
import { Badge, PageHeader } from "@/components/admin/ui";
import type { CaseStatus, VolunteerApplication } from "@/lib/admin-types";
import { formatDateTime } from "@/lib/format";

const columns: Column<VolunteerApplication>[] = [
  {
    header: "Name",
    sort: "name",
    value: (v) => v.name,
    cell: (v) => (
      <Link href={`/admin/volunteers/${v.id}`} className="flex items-center gap-2 whitespace-nowrap hover:underline">
        {v.status === "NEW" ? <span className="size-2 shrink-0 rounded-full bg-gold" aria-label="New" /> : null}
        <span className={v.status === "NEW" ? "font-semibold text-navy" : "text-navy"}>{v.name}</span>
      </Link>
    ),
  },
  { header: "Email", value: (v) => v.email, cell: (v) => <span className="text-sm">{v.email}</span> },
  { header: "Phone", value: (v) => v.phone },
  { header: "Role", sort: "role", value: (v) => v.role, cell: (v) => <span className="whitespace-nowrap text-sm">{v.role ?? "Any"}</span> },
  { header: "Availability", value: (v) => v.availability },
  { header: "Experience", value: (v) => v.experience },
  { header: "Message", value: (v) => v.message },
  {
    header: "Status",
    sort: "status",
    value: (v) => caseStatus[v.status].label,
    cell: (v) => <Badge tone={caseStatus[v.status].tone}>{caseStatus[v.status].label}</Badge>,
  },
  {
    header: "Applied",
    sort: "createdAt",
    value: (v) => formatDateTime(v.createdAt),
    cell: (v) => <span className="whitespace-nowrap text-sm text-muted">{formatDateTime(v.createdAt)}</span>,
  },
];

export default function VolunteersPage() {
  const [status, setStatus] = useState<CaseStatus | "">("");

  return (
    <div className="space-y-6">
      <PageHeader title="Volunteer applications" description="People who offered their time through the Volunteer page." />
      <DataTable
        path="/volunteers"
        title="Volunteer applications"
        columns={columns}
        rowKey={(v) => v.id}
        filters={{ status }}
        searchPlaceholder="Search name, email, role"
        empty={{ icon: HandHeart, title: "No applications here", description: "New applications from the Volunteer page will appear here." }}
        toolbar={<StatusFilter value={status} onChange={setStatus} options={caseFilters} />}
      />
    </div>
  );
}
