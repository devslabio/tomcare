"use client";

import { Inbox } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { messageStatus } from "@/components/admin/status";
import { Badge, PageHeader } from "@/components/admin/ui";
import type { ContactMessage, MessageStatus } from "@/lib/admin-types";
import { formatDateTime } from "@/lib/format";

const filters: { value: MessageStatus | ""; label: string }[] = [
  { value: "", label: "Inbox" },
  { value: "NEW", label: "Unread" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
];

const columns: Column<ContactMessage>[] = [
  {
    header: "From",
    sort: "name",
    value: (m) => m.name,
    cell: (m) => (
      <span className="flex items-center gap-2">
        {m.status === "NEW" ? (
          <span className="size-2 shrink-0 rounded-full bg-gold" aria-label="Unread" />
        ) : null}
        <span className={`whitespace-nowrap ${m.status === "NEW" ? "font-semibold text-navy" : "text-navy"}`}>
          {m.name}
        </span>
      </span>
    ),
  },
  { header: "Email", value: (m) => m.email },
  { header: "Phone", value: (m) => m.phone },
  {
    header: "Subject",
    sort: "subject",
    value: (m) => m.subject,
    className: "max-w-xl",
    cell: (m) => (
      <Link href={`/admin/messages/${m.id}`} className="block truncate text-[15px] hover:underline">
        <span className={m.status === "NEW" ? "font-semibold text-navy" : "text-navy"}>{m.subject || "General enquiry"}</span>
        <span className="text-muted"> — {m.message}</span>
      </Link>
    ),
  },
  { header: "Message", value: (m) => m.message },
  {
    header: "Status",
    sort: "status",
    value: (m) => messageStatus[m.status].label,
    cell: (m) => <Badge tone={messageStatus[m.status].tone}>{messageStatus[m.status].label}</Badge>,
  },
  {
    header: "Received",
    sort: "createdAt",
    value: (m) => formatDateTime(m.createdAt),
    cell: (m) => <span className="whitespace-nowrap text-sm text-muted">{formatDateTime(m.createdAt)}</span>,
  },
];

export default function MessagesPage() {
  const [status, setStatus] = useState<MessageStatus | "">("");

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Everything sent through the contact form on the website." />
      <DataTable
        path="/messages"
        title="Messages"
        columns={columns}
        rowKey={(m) => m.id}
        filters={{ status }}
        searchPlaceholder="Search name, email, subject, message"
        empty={{
          icon: Inbox,
          title: "No messages here",
          description: "New contact form submissions will appear in the inbox.",
        }}
        toolbar={
          <div className="no-scrollbar flex max-w-full gap-1.5 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => setStatus(filter.value)}
                className={`h-9 shrink-0 rounded-full px-4 text-sm font-medium transition ${
                  status === filter.value ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-line hover:bg-sand"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
}
