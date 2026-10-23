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
  CARD: "Card, on the website",
  ETRANSFER: "Interac e-Transfer",
  ONLINE: "Online donation page",
  IN_PERSON: "Cheque or in person",
};

/** Card gifts are paid on the website; the rest are pledges staff confirm by hand. */
export function payment(donation: { method: DonationMethod; paidAt: string | null }): { label: string; tone: BadgeTone } | null {
  if (donation.method !== "CARD") return null;
  return donation.paidAt ? { label: "Paid", tone: "green" } : { label: "Payment not completed", tone: "amber" };
}

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
