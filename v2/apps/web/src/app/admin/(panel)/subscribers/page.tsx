"use client";

import { MailCheck, Trash2 } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/admin/data-table";
import { useToast } from "@/components/admin/toast";
import { Button, PageHeader } from "@/components/admin/ui";
import { api } from "@/lib/admin-api";
import type { Subscriber } from "@/lib/admin-types";
import { formatDateTime } from "@/lib/format";

export default function SubscribersPage() {
  const toast = useToast();
  const [version, setVersion] = useState(0);

  async function remove(subscriber: Subscriber) {
    if (!window.confirm(`Remove ${subscriber.email} from the newsletter list?`)) return;
    try {
      await api(`/subscribers/${subscriber.id}`, { method: "DELETE" });
      toast("Subscriber removed");
      setVersion((current) => current + 1);
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter"
        description="People who signed up in the website footer. Use CSV to import them into your email tool."
      />
      <DataTable<Subscriber>
        path="/subscribers"
        title="Newsletter subscribers"
        searchPlaceholder="Search email"
        rowKey={(s) => s.id}
        version={version}
        defaultPageSize={25}
        empty={{ icon: MailCheck, title: "No subscribers yet", description: "Sign-ups from the website footer will appear here." }}
        columns={[
          {
            header: "Email",
            value: (s) => s.email,
            cell: (s) => (
              <a href={`mailto:${s.email}`} className="font-medium text-navy hover:underline">
                {s.email}
              </a>
            ),
          },
          {
            header: "Signed up",
            value: (s) => formatDateTime(s.createdAt),
            cell: (s) => <span className="whitespace-nowrap text-sm text-muted">{formatDateTime(s.createdAt)}</span>,
          },
          {
            header: "",
            align: "right",
            cell: (s) => (
              <Button variant="ghost" size="sm" onClick={() => remove(s)} aria-label={`Remove ${s.email}`}>
                <Trash2 className="size-4" />
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
