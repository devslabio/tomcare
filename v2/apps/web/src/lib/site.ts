import { en, type Dictionary } from "./i18n/en";

export const site = {
  name: "TOMCARE Foundation",
  shortName: "TOMCARE",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tomcarefoundation.org").replace(/\/$/, ""),
  description:
    "TOMCARE Foundation is a Montréal non-profit supporting newcomers, people living with disabilities, seniors and families in hardship across Quebec — with practical help, guidance and community.",
};

export const mainNav: { href: string; key: keyof Dictionary["nav"] }[] = [
  { href: "/about", key: "about" },
  { href: "/programs", key: "programs" },
  { href: "/events", key: "events" },
  { href: "/news", key: "news" },
  { href: "/volunteer", key: "volunteer" },
  { href: "/contact", key: "contact" },
];

/** The kinds of help a person can ask for on the Get help form; labels are translated, values stay in English. */
export const helpNeeds = Object.keys(en.forms.needs) as (keyof Dictionary["forms"]["needs"])[];

export const languages = Object.keys(en.forms.languages) as (keyof Dictionary["forms"]["languages"])[];

export const contactSubjects = Object.keys(en.forms.subjects) as (keyof Dictionary["forms"]["subjects"])[];
