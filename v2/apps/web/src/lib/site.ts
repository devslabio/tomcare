export const site = {
  name: "TOMCARE Foundation",
  shortName: "TOMCARE",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tomcarefoundation.org").replace(/\/$/, ""),
  description:
    "TOMCARE Foundation is a Montréal non-profit supporting newcomers, people living with disabilities, seniors and families in hardship across Quebec — with practical help, guidance and community.",
};

export const mainNav = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/contact", label: "Contact" },
];

/** The kinds of help a person can ask for on the Get help form. */
export const helpNeeds = [
  "Housing and accommodation",
  "Finding a job",
  "Legal or immigration questions",
  "French classes",
  "Computer and internet skills",
  "Clothing, furniture or household items",
  "Government forms and documents",
  "Driving licence (SAAQ)",
  "Support for a person with a disability",
  "Support for a senior",
  "Someone to talk to",
  "Something else",
];

export const languages = ["English", "Français", "Kinyarwanda", "Kiswahili", "Español", "العربية", "Other"];
