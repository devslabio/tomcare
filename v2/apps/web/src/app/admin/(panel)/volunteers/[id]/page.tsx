"use client";

import { ArrowLeft, Reply, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { CasePanel, ContactDetails } from "@/components/admin/inbox";
import { caseStatus } from "@/components/admin/status";
import { useToast } from "@/components/admin/toast";
import { Badge, Button, Card, ErrorState, LoadingState } from "@/components/admin/ui";
import { api, useResource } from "@/lib/admin-api";
import type { VolunteerApplication } from "@/lib/admin-types";
import { formatDateTime } from "@/lib/format";

export default function VolunteerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data: application, error, setData } = useResource<VolunteerApplication>(`/volunteers/${id}`);

  async function remove() {
    if (!window.confirm("Delete this application permanently?")) return;
    try {
      await api(`/volunteers/${id}`, { method: "DELETE" });
      toast("Application deleted");
      router.replace("/admin/volunteers");
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  const sections = application
    ? [
        { title: "Availability", text: application.availability },
        { title: "Experience and skills", text: application.experience },
        { title: "Why they want to volunteer", text: application.message },
      ].filter((section) => section.text)
    : [];

  return (
    <div className="space-y-6">
      <Link href="/admin/volunteers" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Volunteer applications
      </Link>
      {error ? <ErrorState message={error} /> : null}
      {!application && !error ? <LoadingState /> : null}

      {application ? (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Card>
            <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-navy sm:text-2xl">{application.name}</h1>
                  <Badge tone={caseStatus[application.status].tone}>{caseStatus[application.status].label}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {application.role ?? "Any role"} · applied {formatDateTime(application.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${application.email}?subject=${encodeURIComponent("Volunteering with TOMCARE Foundation")}`}
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
              {sections.length ? (
                sections.map((section) => (
                  <div key={section.title}>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{section.title}</h2>
                    <p className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-7 text-navy">{section.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">No further details were given.</p>
              )}
            </div>
          </Card>
          <div className="space-y-6">
            <ContactDetails
              name={application.name}
              email={application.email}
              phone={application.phone}
              extra={application.role ? [{ label: "Role", value: application.role }] : []}
            />
            <CasePanel path={`/volunteers/${application.id}`} record={application} onSaved={(saved) => setData(() => saved)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
