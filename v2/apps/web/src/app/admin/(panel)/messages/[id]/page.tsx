"use client";

import { Archive, ArchiveRestore, ArrowLeft, CheckCheck, Mail, Phone, Reply, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { messageStatus } from "@/components/admin/status";
import { useToast } from "@/components/admin/toast";
import { Badge, Button, Card, ErrorState, LoadingState } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { ContactMessage, MessageStatus } from "@/lib/admin-types";
import { formatDateTime } from "@/lib/format";

export default function MessagePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data: message, error, setData } = useResource<ContactMessage>(`/messages/${id}`);
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(status: MessageStatus) {
    setBusy(status);
    try {
      const updated = await api<ContactMessage>(`/messages/${id}`, { method: "PATCH", json: { status } });
      setData(() => updated);
      toast(status === "ARCHIVED" ? "Message archived" : status === "REPLIED" ? "Marked as replied" : "Message moved to inbox");
    } catch (statusError) {
      toast((statusError as Error).message, "error");
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this message permanently?")) return;
    setBusy("delete");
    try {
      await api(`/messages/${id}`, { method: "DELETE" });
      toast("Message deleted");
      router.replace("/admin/messages");
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/messages" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Messages
      </Link>

      {error ? <ErrorState message={error} /> : null}
      {!message && !error ? <LoadingState /> : null}

      {message ? (
        <Card>
          <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold text-navy sm:text-2xl">{message.subject || "General enquiry"}</h1>
                <Badge tone={messageStatus[message.status].tone}>{messageStatus[message.status].label}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">Received {formatDateTime(message.createdAt)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject ?? "your message to TOMCARE Foundation"}`)}`}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-navy px-3.5 text-sm font-semibold text-white hover:bg-navy-soft"
              >
                <Reply className="size-4" aria-hidden />
                Reply
              </a>
              {message.status !== "REPLIED" && message.status !== "ARCHIVED" ? (
                <Button variant="secondary" size="sm" busy={busy === "REPLIED"} onClick={() => setStatus("REPLIED")}>
                  <CheckCheck className="size-4" aria-hidden />
                  Mark replied
                </Button>
              ) : null}
              {message.status === "ARCHIVED" ? (
                <Button variant="secondary" size="sm" busy={busy === "READ"} onClick={() => setStatus("READ")}>
                  <ArchiveRestore className="size-4" aria-hidden />
                  Move to inbox
                </Button>
              ) : (
                <Button variant="secondary" size="sm" busy={busy === "ARCHIVED"} onClick={() => setStatus("ARCHIVED")}>
                  <Archive className="size-4" aria-hidden />
                  Archive
                </Button>
              )}
              <Button variant="danger" size="sm" busy={busy === "delete"} onClick={remove}>
                <Trash2 className="size-4" aria-hidden />
                Delete
              </Button>
            </div>
          </div>
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_16rem]">
            <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-navy">{message.message}</p>
            <dl className="space-y-4 rounded-2xl bg-sand p-5 text-sm">
              <div>
                <dt className="text-muted">From</dt>
                <dd className="mt-0.5 font-semibold text-navy">{message.name}</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-0.5">
                  <a href={`mailto:${message.email}`} className="inline-flex items-center gap-1.5 break-all font-medium text-navy hover:underline">
                    <Mail className="size-3.5 shrink-0" aria-hidden />
                    {message.email}
                  </a>
                </dd>
              </div>
              {message.phone ? (
                <div>
                  <dt className="text-muted">Phone</dt>
                  <dd className="mt-0.5">
                    <a href={`tel:${message.phone}`} className="inline-flex items-center gap-1.5 font-medium text-navy hover:underline">
                      <Phone className="size-3.5" aria-hidden />
                      {message.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
