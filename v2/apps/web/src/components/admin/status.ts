import type { BadgeTone } from "@/components/admin/ui";
import type { CaseStatus, DonationFrequency, DonationMethod, ItemCategory, ItemHandoff, MessageStatus } from "@/lib/admin-types";

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

export const frequencyLabels: Record<DonationFrequency, string> = {
  ONCE: "One time",
  MONTHLY: "Monthly",
  QUARTERLY: "Every 3 months",
  YEARLY: "Yearly",
};

export const methodLabels: Record<DonationMethod, string> = {
  ETRANSFER: "Interac e-Transfer",
  ONLINE: "Online, by card",
  IN_PERSON: "Cheque or in person",
};

export const itemCategoryLabels: Record<ItemCategory, string> = {
  CLOTHING: "Clothing",
  HOUSEHOLD: "Household goods",
  FURNITURE: "Furniture",
  VEHICLE: "Vehicle",
  OTHER: "Other",
};

export const handoffLabels: Record<ItemHandoff, string> = {
  DROP_OFF: "Drop-off",
  PICK_UP: "Pick-up",
};
