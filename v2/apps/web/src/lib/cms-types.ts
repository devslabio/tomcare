import type { Block } from "./blocks";

/** French version of a record's text fields, as entered in the admin; empty fields fall back to English. */
export type French<T, K extends keyof T> = Partial<Pick<T, K>>;

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
  fr?: French<Program, "title" | "category" | "summary" | "body" | "highlights">;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  visible: boolean;
  sortOrder: number;
  fr?: French<Service, "title" | "description">;
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
  fr?: French<Event, "title" | "summary" | "body" | "location">;
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
  fr?: French<Post, "title" | "excerpt" | "body" | "category">;
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
  fr?: French<Page, "title" | "description" | "navLabel" | "blocks">;
};

export type NavPage = Pick<Page, "slug" | "title" | "navLabel" | "showInNav" | "updatedAt" | "fr">;

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  group: TeamGroup;
  visible: boolean;
  sortOrder: number;
  fr?: French<TeamMember, "role" | "bio">;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  photo: string | null;
  visible: boolean;
  sortOrder: number;
  fr?: French<Testimonial, "quote" | "role">;
};

export type Partner = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  visible: boolean;
  sortOrder: number;
  fr?: French<Partner, "description">;
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
  fr?: French<VolunteerRole, "title" | "description" | "commitment" | "location" | "skills">;
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
    quoteAuthor: string;
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
  fr: Record<
    | "heroEyebrow"
    | "heroTitle"
    | "heroSubtitle"
    | "aboutHeadline"
    | "aboutIntro"
    | "aboutStory"
    | "aboutVision"
    | "aboutMission"
    | "aboutQuote"
    | "aboutRepresentative"
    | "stat1Label"
    | "stat2Label"
    | "stat3Label"
    | "stat4Label"
    | "donateHeadline"
    | "donateIntro"
    | "donateDropOffDays"
    | "donateRecognition"
    | "contactAddress"
    | "contactHours",
    string
  >;
};
