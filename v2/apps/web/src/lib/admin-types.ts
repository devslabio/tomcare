import type { StaffRole } from "./admin-api";
import type {
  Event,
  Page,
  Partner,
  Post,
  Program,
  Service,
  SiteSettings,
  TeamGroup,
  TeamMember,
  Testimonial,
  VolunteerRole,
} from "./cms-types";

export type { Event, Page, Partner, Post, Program, Service, SiteSettings, TeamGroup, TeamMember, Testimonial, VolunteerRole };

export type MessageStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";
export type CaseStatus = "NEW" | "IN_PROGRESS" | "ACCEPTED" | "CLOSED" | "ARCHIVED";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: MessageStatus;
  createdAt: string;
  readAt: string | null;
};

export type VolunteerApplication = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string | null;
  availability: string | null;
  experience: string | null;
  message: string | null;
  status: CaseStatus;
  notes: string;
  createdAt: string;
};

export type AssistanceRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  language: string | null;
  city: string | null;
  needs: string[];
  story: string;
  status: CaseStatus;
  notes: string;
  createdAt: string;
};

export type DonationFrequency = "ONCE" | "MONTHLY" | "QUARTERLY" | "YEARLY";
export type DonationMethod = "ETRANSFER" | "ONLINE" | "IN_PERSON";

export type DonationPledge = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  amountCents: number;
  frequency: DonationFrequency;
  cause: string | null;
  method: DonationMethod;
  message: string | null;
  anonymous: boolean;
  status: CaseStatus;
  notes: string;
  createdAt: string;
};

export type ItemCategory = "CLOTHING" | "HOUSEHOLD" | "FURNITURE" | "VEHICLE" | "OTHER";
export type ItemHandoff = "DROP_OFF" | "PICK_UP";

export type ItemDonation = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  categories: ItemCategory[];
  description: string;
  handoff: ItemHandoff;
  address: string | null;
  postalCode: string | null;
  vehicle: string | null;
  vehicleYear: number | null;
  vehicleRuns: boolean | null;
  hasOwnership: boolean | null;
  status: CaseStatus;
  notes: string;
  createdAt: string;
};

export type Subscriber = { id: string; email: string; createdAt: string };

export type AdminPost = Omit<Post, "body">;
export type AdminPage = Omit<Page, "blocks"> & { createdAt: string };

export type Dashboard = {
  inbox: { messages: number; volunteers: number; requests: number; donations: number; items: number };
  subscribers: number;
  content: { programs: number; upcomingEvents: number; posts: number; pages: number };
  recentRequests: Pick<AssistanceRequest, "id" | "name" | "city" | "needs" | "status" | "createdAt">[];
  recentVolunteers: Pick<VolunteerApplication, "id" | "name" | "role" | "status" | "createdAt">[];
  recentMessages: Pick<ContactMessage, "id" | "name" | "subject" | "status" | "createdAt">[];
  /** Last 30 days, Montréal calendar days. */
  activity: { date: string; messages: number; volunteers: number; requests: number }[];
  topNeeds: { key: string; value: number }[];
};
