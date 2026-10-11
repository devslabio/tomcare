import type { Block } from "./blocks";

export type PublishStatus = "DRAFT" | "PUBLISHED";
export type TeamGroup = "BOARD" | "STAFF" | "VOLUNTEER";

export type Program = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  icon: string;
  image: string | null;
  highlights: string[];
  featured: boolean;
  visible: boolean;
  sortOrder: number;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  visible: boolean;
  sortOrder: number;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  image: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string;
  registerUrl: string | null;
  visible: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  author: string;
  category: string;
  status: PublishStatus;
  publishedAt: string | null;
};

export type PostSummary = Omit<Post, "body" | "status">;

export type Page = {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string | null;
  blocks: Block[];
  status: PublishStatus;
  showInNav: boolean;
  navLabel: string | null;
  sortOrder: number;
  updatedAt: string;
};

export type NavPage = Pick<Page, "slug" | "title" | "navLabel" | "showInNav" | "updatedAt">;

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  group: TeamGroup;
  visible: boolean;
  sortOrder: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  photo: string | null;
  visible: boolean;
  sortOrder: number;
};

export type Partner = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  visible: boolean;
  sortOrder: number;
};

export type VolunteerRole = {
  id: string;
  title: string;
  description: string;
  commitment: string;
  location: string;
  skills: string[];
  visible: boolean;
  sortOrder: number;
};

export type SiteSettings = {
  contact: {
    phoneDisplay: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
    mapQuery: string;
  };
  links: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    x: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  about: {
    headline: string;
    intro: string;
    story: string;
    vision: string;
    mission: string;
    quote: string;
    founded: string;
    representative: string;
  };
  stats: {
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
  };
  donate: {
    headline: string;
    intro: string;
    etransferEmail: string;
    donationUrl: string;
    dropOffDays: string;
    recognition: string;
    charityNumber: string;
  };
};
