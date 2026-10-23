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
  /** French versions of the translatable settings above; an empty field falls back to English. */
  fr: Record<(typeof FR_SETTING_FIELDS)[number], string>;
};

export const FR_SETTING_FIELDS = [
  "heroEyebrow",
  "heroTitle",
  "heroSubtitle",
  "aboutHeadline",
  "aboutIntro",
  "aboutStory",
  "aboutVision",
  "aboutMission",
  "aboutQuote",
  "aboutRepresentative",
  "stat1Label",
  "stat2Label",
  "stat3Label",
  "stat4Label",
  "donateHeadline",
  "donateIntro",
  "donateDropOffDays",
  "donateRecognition",
  "contactAddress",
  "contactHours",
] as const;

export const SETTING_KEYS = [
  "contact",
  "links",
  "hero",
  "about",
  "stats",
  "donate",
  "fr",
] as const satisfies readonly (keyof SiteSettings)[];

export const DEFAULT_SETTINGS: SiteSettings = {
  contact: {
    phoneDisplay: "(438) 773-3653",
    phone: "+14387733653",
    email: "info@tomcarefoundation.org",
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
    quoteAuthor: "Muhammad Ali",
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
    headline: "Give money, or give *things*.",
    intro:
      "Every donation goes directly toward supporting the people we serve, including newcomers settling in Canada, single mothers and their children, and individuals living with chronic illnesses — by providing clothing, furniture, school supplies and other necessities, including vehicles when available.",
    etransferEmail: "",
    donationUrl: "",
    dropOffDays:
      "Monday – Wednesday · 9:00 – 17:00 · General donations\nThursday · 10:00 – 18:00 · Extended hours for working donors\nSaturday · 10:00 – 15:00 · Weekend community drop-off",
    recognition:
      "Every donor receives an official Certificate of Recognition. With your permission, we also thank you by name on our website and in our annual report.",
    charityNumber: "",
  },
  fr: {
    heroEyebrow: "Montréal · Depuis 2024",
    heroTitle: "Personne ne devrait recommencer sa vie *seul*.",
    heroSubtitle:
      "La Fondation TOMCARE accompagne les nouveaux arrivants, les personnes vivant avec un handicap et les familles en difficulté au Québec — avec une aide concrète, des conseils honnêtes et une communauté présente.",
    aboutHeadline: "Une fondation née d’une *expérience vécue*",
    aboutIntro:
      "La Fondation TOMCARE est un organisme sans but lucratif fondé en 2024. L’idée est née d’avoir vu de près les défis que vivent les immigrants au Canada : le manque d’information, des conditions de logement difficiles, l’isolement et la dépression, ainsi que la barrière de la langue.",
    aboutStory:
      "Nous accompagnons les nouveaux arrivants à chaque étape de leur installation, y compris dans leurs démarches d’emploi au Québec. Nous sensibilisons la société d’accueil comme les nouveaux arrivants aux principes et aux bienfaits du vivre-ensemble et du renforcement des liens sociaux — et nous mobilisons les personnes immigrantes pour qu’elles participent et contribuent à la vie de ce territoire. En 2024 seulement, nous avons accueilli 173 nouveaux arrivants.",
    aboutVision:
      "Aider les nouveaux arrivants à s’intégrer rapidement et facilement à la société canadienne, tout en répondant aux besoins des personnes vivant avec une incapacité et de celles qui vivent dans la pauvreté.",
    aboutMission:
      "Offrir aux nouveaux arrivants une orientation claire et rapide, et aider les personnes en situation de pauvreté ou de handicap physique à combler leurs besoins essentiels — pour que les nouveaux arrivants puissent s’adapter à la société québécoise et y laisser leur marque.",
    aboutQuote: "Servir les autres, c’est le loyer que l’on paie pour sa place ici sur terre.",
    aboutRepresentative: "Tom Ntambara, fondateur et représentant légal",
    stat1Label: "Nouveaux arrivants accueillis en 2024",
    stat2Label: "Programmes de soutien",
    stat3Label: "Services du quotidien, gratuits",
    stat4Label: "Fondée à Montréal",
    donateHeadline: "Donnez de l’argent, ou donnez des *biens*.",
    donateIntro:
      "Chaque don sert directement à soutenir les personnes que nous accompagnons, notamment les nouveaux arrivants qui s’installent au Canada, les mères seules et leurs enfants, et les personnes vivant avec une maladie chronique — en leur fournissant des vêtements, des meubles, des fournitures scolaires et d’autres biens essentiels, y compris des véhicules lorsque c’est possible.",
    donateDropOffDays:
      "Lundi – mercredi · 9 h – 17 h · Dons généraux\nJeudi · 10 h – 18 h · Heures prolongées pour les donateurs qui travaillent\nSamedi · 10 h – 15 h · Dépôt communautaire de fin de semaine",
    donateRecognition:
      "Chaque donateur reçoit un certificat de reconnaissance officiel. Avec votre permission, nous vous remercions aussi par votre nom sur notre site Web et dans notre rapport annuel.",
    contactAddress: "Montréal (Québec), Canada",
    contactHours: "Lun–mer 9 h–17 h\nJeu 10 h–18 h\nSam 10 h–15 h\nDim fermé",
  },
};
