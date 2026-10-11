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

export const SETTING_KEYS = [
  "contact",
  "links",
  "hero",
  "about",
  "stats",
  "donate",
] as const satisfies readonly (keyof SiteSettings)[];

export const DEFAULT_SETTINGS: SiteSettings = {
  contact: {
    phoneDisplay: "(438) 773-3653",
    phone: "+14387733653",
    email: "tomntambara@gmail.com",
    address: "Montréal, Quebec, Canada",
    hours: "Mon–Wed 9:00–17:00\nThu 10:00–18:00\nSat 10:00–15:00\nSun Closed",
    mapQuery: "Montréal, Quebec, Canada",
  },
  links: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    x: "",
  },
  hero: {
    eyebrow: "Montréal · Since 2024",
    title: "No one should have to start over *alone*.",
    subtitle:
      "TOMCARE Foundation walks beside newcomers, people living with disabilities and families facing hardship in Quebec — with practical help, honest guidance and a community that shows up.",
  },
  about: {
    headline: "A foundation born from *lived experience*",
    intro:
      "The TOMCARE Foundation is a non-profit organization founded in 2024. The idea came from seeing, first-hand, the challenges immigrants face in Canada: missing information, poor living conditions, isolation and depression, and language barriers.",
    story:
      "We support new arrivals at every stage of their settlement, including the employment process in Quebec. We raise awareness, among both the host society and newcomers, of the principles and benefits of living together and strengthening social bonds — and we mobilize immigrants to take part in, and contribute to, the life of this territory. In 2024 alone, we welcomed 173 newcomers.",
    vision:
      "To help newcomers integrate quickly and easily into Canadian society, while also meeting the needs of people living with impairments and those living in poverty.",
    mission:
      "To give new arrivals clear and timely guidance, and to help people experiencing poverty or physical impairments access their basic needs — so newcomers can adapt to, and make their mark on, Quebec society.",
    quote: "Service to others is the rent you pay for your room here on earth.",
    founded: "2024",
    representative: "Tom Ntambara, Founder & Legal Representative",
  },
  stats: {
    stat1Value: "173",
    stat1Label: "Newcomers welcomed in 2024",
    stat2Value: "12",
    stat2Label: "Programs of support",
    stat3Value: "10+",
    stat3Label: "Everyday services, free of charge",
    stat4Value: "2024",
    stat4Label: "Founded in Montréal",
  },
  donate: {
    headline: "Your gift becomes a winter coat, a lease signed, *a first job*.",
    intro:
      "Every donation goes directly to the people we serve — newcomers settling in, seniors living alone, families stretched thin. Give money, or give the things a household needs: clothes, furniture, school supplies, even a car.",
    etransferEmail: "",
    donationUrl: "",
    dropOffDays:
      "Monday – Wednesday · 9:00 – 17:00 · General donations\nThursday · 10:00 – 18:00 · Extended hours for working donors\nSaturday · 10:00 – 15:00 · Weekend community drop-off",
    recognition:
      "Every donor receives an official Certificate of Recognition. With your permission, we also thank you by name on our website and in our annual report.",
    charityNumber: "",
  },
};
