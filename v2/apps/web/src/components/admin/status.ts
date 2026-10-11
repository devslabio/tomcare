import type { BadgeTone } from "@/components/admin/ui";
import type { CaseStatus, MessageStatus } from "@/lib/admin-types";

export const messageStatus: Record<MessageStatus, { label: string; tone: BadgeTone }> = {
  NEW: { label: "New", tone: "green" },
  READ: { label: "Read", tone: "gray" },
  REPLIED: { label: "Replied", tone: "blue" },
  ARCHIVED: { label: "Archived", tone: "gray" },
};

export const caseStatus: Record<CaseStatus, { label: string; tone: BadgeTone }> = {
  NEW: { label: "New", tone: "green" },
  IN_PROGRESS: { label: "In progress", tone: "blue" },
  ACCEPTED: { label: "Accepted", tone: "amber" },
  CLOSED: { label: "Closed", tone: "gray" },
  ARCHIVED: { label: "Archived", tone: "gray" },
};
