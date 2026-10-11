"use client";

import { ArrowLeft, Reply, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { CasePanel, ContactDetails } from "@/components/admin/inbox";
import { caseStatus } from "@/components/admin/status";
import { useToast } from "@/components/admin/toast";
import { Badge, Button, Card, ErrorState, LoadingState } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { AssistanceRequest } from "@/lib/admin-types";
import { formatDateTime } from "@/lib/format";

export default function RequestPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data: request, error, setData } = useResource<AssistanceRequest>(`/assistance/${id}`);

  async function remove() {
    if (!window.confirm("Delete this request permanently? Consider archiving it instead.")) return;
    try {
      await api(`/assistance/${id}`, { method: "DELETE" });
      toast("Request deleted");
      router.replace("/admin/requests");
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/requests" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Help requests
      </Link>
      {error ? <ErrorState message={error} /> : null}
      {!request && !error ? <LoadingState /> : null}

      {request ? (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Card>
            <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-navy sm:text-2xl">{request.name}</h1>
                  <Badge tone={caseStatus[request.status].tone}>{caseStatus[request.status].label}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">Received {formatDateTime(request.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${request.email}?subject=${encodeURIComponent("Your request to TOMCARE Foundation")}`}
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
              {request.needs.length ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Needs help with</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {request.needs.map((need) => (
                      <li key={need} className="rounded-full bg-gold-soft px-3 py-1 text-sm font-medium text-navy">
                        {need}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Their situation</h2>
                <p className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-7 text-navy">{request.story}</p>
              </div>
            </div>
          </Card>
          <div className="space-y-6">
            <ContactDetails
              name={request.name}
              email={request.email}
              phone={request.phone}
              extra={[
                ...(request.language ? [{ label: "Preferred language", value: request.language }] : []),
                ...(request.city ? [{ label: "City", value: request.city }] : []),
              ]}
            />
            <CasePanel path={`/assistance/${request.id}`} record={request} onSaved={(saved) => setData(() => saved)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
