import {
  CalendarDays,
  CircleDollarSign,
  FileText,
  HandHeart,
  Handshake,
  HeartHandshake,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  Mail,
  Newspaper,
  Package,
  Quote,
  Settings,
  ShieldCheck,
  UserRoundCog,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { StaffRole } from "@/lib/admin-api";

export type NavItem = { href: string; label: string; icon: LucideIcon; roles?: StaffRole[] };
export type NavSection = { title?: string; items: NavItem[] };

export const adminNav: NavSection[] = [
  {
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Inbox",
    items: [
      { href: "/admin/requests", label: "Help requests", icon: LifeBuoy, roles: ["EDITOR"] },
      { href: "/admin/volunteers", label: "Volunteer applications", icon: HandHeart, roles: ["EDITOR"] },
      { href: "/admin/donations", label: "Donations", icon: CircleDollarSign, roles: ["EDITOR"] },
      { href: "/admin/donated-items", label: "Donated items", icon: Package, roles: ["EDITOR"] },
      { href: "/admin/messages", label: "Messages", icon: Inbox, roles: ["EDITOR"] },
      { href: "/admin/subscribers", label: "Subscribers", icon: Mail, roles: ["EDITOR"] },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/pages", label: "Pages", icon: FileText, roles: ["EDITOR"] },
      { href: "/admin/programs", label: "Programs", icon: HeartHandshake, roles: ["EDITOR"] },
      { href: "/admin/services", label: "Everyday services", icon: ListChecks, roles: ["EDITOR"] },
      { href: "/admin/events", label: "Events", icon: CalendarDays, roles: ["EDITOR"] },
      { href: "/admin/news", label: "News", icon: Newspaper, roles: ["EDITOR"] },
      { href: "/admin/volunteer-roles", label: "Volunteer roles", icon: UserRoundCog, roles: ["EDITOR"] },
      { href: "/admin/team", label: "Team", icon: Users, roles: ["EDITOR"] },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote, roles: ["EDITOR"] },
      { href: "/admin/partners", label: "Partners", icon: Handshake, roles: ["EDITOR"] },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/settings", label: "Site settings", icon: Settings, roles: ["ADMIN"] },
      { href: "/admin/users", label: "Staff accounts", icon: ShieldCheck, roles: ["ADMIN"] },
    ],
  },
];

export function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

export function requiredRoles(pathname: string): StaffRole[] | undefined {
  for (const section of adminNav) {
    for (const item of section.items) {
      if (item.href !== "/admin" && isActive(pathname, item.href)) return item.roles;
    }
  }
  return undefined;
}

export const roleLabels: Record<StaffRole, string> = {
  ADMIN: "Administrator",
  EDITOR: "Editor",
};
