import { randomBytes } from "node:crypto";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

for (const file of [".env", path.join("..", "..", "apps", "api", ".env")]) {
  try {
    process.loadEnvFile(path.join(__dirname, "..", file));
  } catch {
    /* optional */
  }
}

const prisma = new PrismaClient();

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=85`;

const img = {
  dinner: photo("1731475761027-0b6b33b74547"),
  computerClass: photo("1531482615713-2afd69097998"),
  workshopTable: photo("1757085242652-f8cd4d3de889"),
  donationsSorting: photo("1599059813005-11265ba4b4ce"),
  volunteers: photo("1560220604-1985ebfe28b1"),
  consultation: photo("1573496267526-08a69e46a409"),
  study: photo("1739301674006-75fe9653368f"),
  movingIn: photo("1590464211192-52e4cff6bf7a"),
  embrace: photo("1591885365863-f224a7da72ed"),
  interview: photo("1653669486900-fd06730dcc78"),
  seniorCare: photo("1666887360726-f55472d96c34"),
  laptop: photo("1765650114537-423a387b4520"),
  presentation: photo("1715960350190-2ed0a812962d"),
  smallGroup: photo("1778824717987-7a135889e928"),
  winter: photo("1545885785-910f3bbf07a8"),
  meeting: photo("1653566031535-bcf33e1c2893"),
  laughter: photo("1630726410985-a1021e8a232a"),
  celebration: photo("1529832588601-c01e066263a8"),
  unpacking: photo("1580709789185-1eb892605ac7"),
  volunteerTeam: photo("1650066705556-5106858ee7a7"),
  wheelchair: photo("1662320153729-1a5a4069c82c"),
  group: photo("1622730877504-ea613376a2df"),
};

const programs = [
  {
    slug: "social-activities",
    title: "Asylum Seeker Social Activities",
    category: "Community",
    icon: "users",
    image: img.dinner,
    featured: true,
    summary:
      "Regular gatherings where asylum seekers meet, share information and build friendships — a practical answer to loneliness and isolation.",
    body: `Arriving in a new country often means arriving alone. Many asylum seekers spend their first months without family nearby, without a network and without anyone to ask the simple questions that make daily life work.

Our social activities bring people together in a relaxed, welcoming setting: shared meals, walks, cultural celebrations and conversation circles. Newcomers meet people who have walked the same road, exchange tips about housing, schools and paperwork, and leave with phone numbers instead of questions.

## Why it matters
Isolation and depression are among the hardest parts of settlement. Feeling part of a community is often the first step towards finding work, learning the language and building a new life.`,
    highlights: ["Monthly community meals", "Conversation circles in French and English", "Cultural celebrations", "Peer support from earlier arrivals"],
  },
  {
    slug: "digital-literacy",
    title: "Digital Literacy",
    category: "Education",
    icon: "laptop",
    image: img.computerClass,
    featured: true,
    summary:
      "Hands-on computer help for newcomers who need to search for jobs, register a business or understand government services online.",
    body: `In Québec, almost everything happens online: job applications, government services, school registration, health appointments. For newcomers without computer experience, these systems can feel like a locked door.

Our digital literacy sessions are patient and practical. We start with the basics — using a mouse, creating an email address, staying safe online — and move on to the tasks people actually need: applying for jobs, filling in government forms, registering a business and understanding traffic rules online.

## Who it's for
Anyone who wants to feel confident with a computer, at any level. Sessions run in small groups with one-to-one help available.`,
    highlights: ["Email, documents and online safety", "Job search and online applications", "Government portals and forms", "Small groups, one-to-one help"],
  },
  {
    slug: "training-center",
    title: "Training Center",
    category: "Training",
    icon: "graduation-cap",
    image: img.workshopTable,
    featured: true,
    summary:
      "IT, language and practical courses designed to help people integrate into Québec society and compete in the job market.",
    body: `Skills open doors. Our training center offers courses that help newcomers and people in transition become competitive in the Canadian labour market.

Courses cover information technology, French and English language practice, and the practical knowledge people need to settle: how the job market works, workplace culture, and the services available to them.

## Learning that leads somewhere
Every course is built around real outcomes — a first job, a better job, or the confidence to take the next step.`,
    highlights: ["IT and computer skills", "French and English practice", "Workplace culture in Québec", "Certificates of participation"],
  },
  {
    slug: "material-donations",
    title: "Second-hand Material Donations",
    category: "Support",
    icon: "package",
    image: img.donationsSorting,
    featured: false,
    summary:
      "Clothing, furniture and household goods collected from the community and given to people starting over, especially new asylum seekers.",
    body: `Starting over often means starting with nothing. A warm coat for the first winter, a bed, kitchen basics — these make the difference between surviving and settling.

We collect good-quality second-hand items from the community and distribute them to people who need them most, especially new asylum seekers and families in their first months.

## How to donate items
Bring clothing, household goods and small furniture during our donation days. Contact us first for larger items so we can arrange pickup or storage.`,
    highlights: ["Winter clothing and boots", "Household goods and kitchenware", "Furniture for new homes", "Children's clothes and toys"],
  },
  {
    slug: "volunteer-opportunities",
    title: "Volunteer Opportunities",
    category: "Community",
    icon: "hand-heart",
    image: img.volunteers,
    featured: false,
    summary:
      "Asylum seekers and community members volunteer with us — gaining Canadian experience while giving back to the society that welcomed them.",
    body: `Volunteering is one of the fastest ways to build a network, practise a language and gain Canadian experience. It is also a way to give back.

We offer volunteer roles to asylum seekers, newcomers and long-time residents alike: mentoring, translation, event organisation, training and outreach. Every volunteer contributes to a stronger, more welcoming Québec.`,
    highlights: ["Canadian work experience", "References for job applications", "Flexible hours", "Training and support provided"],
  },
  {
    slug: "legal-advisory",
    title: "Legal Advisory",
    category: "Legal",
    icon: "scale",
    image: img.consultation,
    featured: true,
    summary:
      "Guidance through the legal framework of the host country — immigration steps, rights and obligations — in plain language.",
    body: `Newcomers often don't know the legal framework of their new country, and the official languages can make it even harder to understand. Misunderstandings can be costly.

We provide legal advisory support to help people understand their situation, their rights and their obligations. We explain processes in plain language, help prepare documents and refer people to qualified legal professionals when needed.

## Please note
Our advisors provide guidance and orientation. For legal representation, we connect you with licensed lawyers and recognised legal clinics.`,
    highlights: ["Plain-language explanations", "Help preparing documents", "Rights and obligations in Québec", "Referrals to legal clinics"],
  },
  {
    slug: "education-and-research",
    title: "Education and Research",
    category: "Research",
    icon: "book-open",
    image: img.study,
    featured: false,
    summary:
      "Working with universities, institutions and students on research that addresses the real needs of newcomers to Canada.",
    body: `Good support starts with understanding. We collaborate with universities, institutions and students to carry out targeted research and studies on the needs of newcomers to Canada.

The findings shape our own programmes and help policymakers, employers and community organisations design better services.`,
    highlights: ["University partnerships", "Community needs assessments", "Student placements", "Shared findings"],
  },
  {
    slug: "accommodation-assistance",
    title: "Accommodation Assistance",
    category: "Housing",
    icon: "house",
    image: img.movingIn,
    featured: true,
    summary:
      "Help finding safe, affordable housing — including shared accommodation support for single mothers balancing work and children.",
    body: `Finding a home is one of the first and hardest challenges for refugee newcomers in Canada. Without a rental history, references or credit, many doors stay closed.

We help people understand the housing market, prepare applications, know their rights as tenants and connect with landlords. Single mothers with children often struggle to balance work and housing, so we also support shared accommodation arrangements that make both possible.`,
    highlights: ["Housing search support", "Tenant rights and leases", "Shared accommodation for single mothers", "Help with first-month essentials"],
  },
  {
    slug: "homelessness-support",
    title: "Homelessness Support",
    category: "Support",
    icon: "heart-handshake",
    image: img.embrace,
    featured: false,
    summary:
      "Basic needs — clothing, food and social connection — for people experiencing homelessness, with a path towards stability.",
    body: `Everyone deserves dignity. Through TOMCARE Foundation, people experiencing homelessness receive help with their basic needs: clothing, food, social integration and other support that improves their quality of life.

We listen first, then work with each person on the next practical step — whether that is a warm coat, a meal, a referral or a conversation.`,
    highlights: ["Clothing and food", "Referrals to shelters and services", "Social integration activities", "Respectful, judgement-free support"],
  },
  {
    slug: "employability",
    title: "Employability",
    category: "Employment",
    icon: "briefcase",
    image: img.interview,
    featured: true,
    summary:
      "Breaking down the barriers newcomers face in the Québec job market — from CVs and interviews to understanding how hiring works.",
    body: `Newcomers face specific obstacles: little knowledge of the labour market, limited work experience in Québec, unfamiliarity with the official languages, unclear job prospects and misunderstandings of the hiring process.

Our employability support tackles each one. We help people write a Canadian-style CV, prepare for interviews, understand which sectors are hiring and navigate employment procedures in Québec.`,
    highlights: ["Canadian-style CVs", "Interview preparation", "Labour market orientation", "Employment procedures in Québec"],
  },
  {
    slug: "seniors-services",
    title: "Seniors Services",
    category: "Seniors",
    icon: "smile",
    image: img.seniorCare,
    featured: false,
    summary:
      "Improving quality of life for older adults — combating isolation, promoting self-care and informing seniors of their rights.",
    body: `Older adults, especially those who arrived later in life, can easily become isolated. Our Seniors Services programme aims to improve their quality of life, support their needs and keep them connected.

We promote self-care, organise social activities, and inform seniors about the services available to them and their rights — helping to prevent social exclusion.`,
    highlights: ["Social activities and visits", "Information on rights and services", "Self-care and wellbeing", "Help with appointments and forms"],
  },
  {
    slug: "access-to-ict",
    title: "Access to ICT",
    category: "Technology",
    icon: "monitor",
    image: img.laptop,
    featured: false,
    summary:
      "Public computers and technical assistance for people who must use online platforms but don't have a device of their own.",
    body: `Many essential services are only available online, yet a laptop or desktop is out of reach for many people starting over. Even with a device, technical help is often needed.

TOMCARE Foundation is establishing public IT infrastructure: computers people can use, with staff and volunteers on hand to help.`,
    highlights: ["Free computer access", "Printing and scanning", "Technical assistance", "Help with online platforms"],
  },
];

const services = [
  ["Preparing CV / Résumé", "Write a CV that works in Canada — one of the first steps towards a job.", "file-text"],
  ["Printing documents", "Print forms, applications and important documents.", "printer"],
  ["Typing documents", "Typing and formatting letters, forms and applications.", "keyboard"],
  ["Passport pictures", "Passport and ID photos that meet official requirements.", "camera"],
  ["French class registration", "Find and register for French language classes.", "languages"],
  ["SAAQ driving licence", "Help registering for a driving licence with the SAAQ.", "car"],
  ["Road test preparation", "Prepare for the SAAQ written knowledge test.", "book-open"],
  ["Metro cards", "Get and manage your OPUS card for public transport.", "credit-card"],
  ["Map reading", "Find your way around the city and its services.", "map"],
  ["Applying for jobs online", "Search and apply for jobs on online platforms.", "briefcase"],
] as const;

const volunteerRoles = [
  {
    title: "Settlement Mentor",
    description: "Guide newcomers through settlement, share local knowledge and offer cultural orientation.",
    commitment: "4–6 hours a week",
    location: "Montréal",
    skills: ["Communication", "Patience", "Local knowledge"],
  },
  {
    title: "Language Volunteer",
    description: "Help with translation, language practice and communication for people still learning French or English.",
    commitment: "3–5 hours a week",
    location: "In person or online",
    skills: ["Bilingual", "Teaching", "Communication"],
  },
  {
    title: "Job Search Coach",
    description: "Help newcomers prepare CVs, practise interviews and navigate the job market.",
    commitment: "5–8 hours a week",
    location: "Montréal",
    skills: ["HR knowledge", "Interview skills", "Career guidance"],
  },
  {
    title: "IT Skills Trainer",
    description: "Teach digital literacy, computer basics and how to use online platforms.",
    commitment: "4–6 hours a week",
    location: "In person or online",
    skills: ["IT knowledge", "Teaching", "Patience"],
  },
  {
    title: "Community Event Organiser",
    description: "Plan and run community events, social activities and cultural celebrations.",
    commitment: "3–4 hours a week",
    location: "Montréal",
    skills: ["Organisation", "Leadership", "Creativity"],
  },
  {
    title: "Advocacy Volunteer",
    description: "Raise awareness of our mission, share stories and help with outreach.",
    commitment: "2–4 hours a week",
    location: "Remote",
    skills: ["Social media", "Writing", "Networking"],
  },
];

const day = (iso: string) => new Date(iso);

const events = [
  {
    slug: "community-integration-workshop",
    title: "Community Integration Workshop",
    summary: "An afternoon for newcomers to meet, ask questions and learn how to get settled in Montréal.",
    body: `Join us for a practical, friendly workshop for people who have recently arrived in Québec.

## What we'll cover
- Getting your first documents: SIN, RAMQ, OPUS card
- Finding housing and understanding your lease
- French classes and where to register
- Questions and answers with our team

Snacks and coffee provided. Bring a friend.`,
    image: img.presentation,
    startsAt: day("2026-11-14T14:00:00-05:00"),
    endsAt: day("2026-11-14T17:00:00-05:00"),
    location: "Montréal, QC",
  },
  {
    slug: "digital-literacy-session",
    title: "Digital Literacy Training Session",
    summary: "Hands-on help with email, online job applications and government portals. All levels welcome.",
    body: `A practical session for anyone who wants to feel more confident with a computer.

Bring your questions — and your own device if you have one. Computers are available for those who don't.`,
    image: img.smallGroup,
    startsAt: day("2026-11-28T10:00:00-05:00"),
    endsAt: day("2026-11-28T13:00:00-05:00"),
    location: "Montréal, QC",
  },
  {
    slug: "winter-clothing-drive",
    title: "Winter Clothing Drive",
    summary: "Help newcomers face their first Canadian winter. Donate coats, boots, hats and gloves.",
    body: `For many newcomers, the first Québec winter is a shock. Warm clothing makes all the difference.

We're collecting clean, good-quality winter coats, boots, hats, scarves and gloves for adults and children. Drop them off during the drive or contact us to arrange a pickup.`,
    image: img.winter,
    startsAt: day("2026-12-05T10:00:00-05:00"),
    endsAt: day("2026-12-05T15:00:00-05:00"),
    location: "Montréal, QC",
  },
  {
    slug: "employment-support-job-fair",
    title: "Employment Support & Job Fair",
    summary: "Meet employers, get your CV reviewed and practise interviews with our volunteer coaches.",
    body: `A day dedicated to finding work. Meet local employers who are hiring, get one-to-one CV reviews and practise interviews with our volunteer job coaches.

Bring several printed copies of your CV — or come early and we'll help you prepare one.`,
    image: img.meeting,
    startsAt: day("2027-02-06T13:00:00-05:00"),
    endsAt: day("2027-02-06T17:00:00-05:00"),
    location: "Montréal, QC",
  },
  {
    slug: "mental-health-support-group",
    title: "Mental Health Awareness & Support Group",
    summary: "A safe space to talk about stress, loneliness and the emotional side of starting over.",
    body: `Settling in a new country is emotionally demanding. This support group offers a safe, confidential space to share experiences and learn practical ways to look after your mental health.

Facilitated by trained volunteers. Information about professional services will be available.`,
    image: img.laughter,
    startsAt: day("2027-03-06T18:00:00-05:00"),
    endsAt: day("2027-03-06T20:00:00-05:00"),
    location: "Montréal, QC",
  },
  {
    slug: "welcome-celebration-2026",
    title: "Newcomers Welcome Celebration",
    summary: "An evening of food, music and friendship celebrating the families who joined our community this year.",
    body: `We celebrated the newcomers, volunteers and partners who made this year possible — with food from around the world, music and many new friendships.`,
    image: img.celebration,
    startsAt: day("2026-06-20T17:00:00-04:00"),
    endsAt: day("2026-06-20T21:00:00-04:00"),
    location: "Montréal, QC",
  },
];

const posts = [
  {
    slug: "supporting-newcomers-a-community-success-story",
    title: "Supporting newcomers: a community success story",
    excerpt: "How TOMCARE Foundation welcomed 173 newcomers in its first year — and what we learned along the way.",
    coverImage: img.unpacking,
    category: "Stories",
    author: "TOMCARE Team",
    publishedAt: day("2026-09-03T09:00:00-04:00"),
    body: `When TOMCARE Foundation opened its doors in 2024, we knew newcomers to Québec faced real challenges: a lack of information, difficult living conditions, depression and language barriers. What we didn't know was how quickly our community would grow.

In our first year, we welcomed 173 new immigrants. Each one arrived with a different story and different needs — a job, a home, a school for their children, or simply someone to talk to.

## What we learned
- **Information is everything.** Most problems start with not knowing where to go. Clear, timely guidance prevents months of difficulty.
- **Community heals.** Our social activities did as much for wellbeing as any formal service.
- **Small help adds up.** A printed CV, a passport photo, a registration for French class — each removes one more barrier.

## What's next
We're expanding our training center, growing our volunteer team and building partnerships with employers and institutions across Québec. Thank you to everyone who made this first year possible.`,
  },
  {
    slug: "how-to-become-a-volunteer",
    title: "How to become a volunteer and make a difference",
    excerpt: "Discover what volunteering with TOMCARE looks like, who it's for, and how to get started this month.",
    coverImage: img.volunteerTeam,
    category: "Get involved",
    author: "Volunteer Coordinator",
    publishedAt: day("2026-08-12T09:00:00-04:00"),
    body: `Volunteers are the heart of TOMCARE Foundation. They mentor families, teach computer skills, coach job seekers and organise the events that bring our community together.

## Who can volunteer?
Anyone with a few hours to give. Many of our volunteers are newcomers themselves — volunteering is a great way to practise French or English, gain Canadian experience and build a network.

## How to get started
1. Browse the open roles on our volunteer page.
2. Send a short application — it takes five minutes.
3. Meet our coordinator for a friendly conversation and orientation.

No special qualifications are needed for most roles. What matters is patience, reliability and a welcoming attitude.`,
  },
  {
    slug: "empowering-people-with-disabilities",
    title: "Empowering people with disabilities through support programs",
    excerpt: "Our approach to helping people with disabilities and special needs live independently and access essential services.",
    coverImage: img.wheelchair,
    category: "Programs",
    author: "Program Director",
    publishedAt: day("2026-07-19T09:00:00-04:00"),
    body: `TOMCARE Foundation serves newcomers — but also people with disabilities and special needs from around the world, including Canadians who are long settled but still face barriers every day.

## Practical support
We help people access essential services, understand their rights, find accessible housing and connect with specialised care. For many, the biggest barrier is information: knowing what exists and how to apply for it.

## Independence and dignity
Our goal is always independence. We work alongside each person, at their pace, towards the life they want to build.`,
  },
];

const faqPage = {
  slug: "faq",
  title: "Frequently asked questions",
  description: "Answers to the questions newcomers, volunteers and donors ask us most often.",
  heroImage: img.group,
  blocks: [
    {
      id: "intro",
      type: "richText",
      heading: "How can we help?",
      body: "Here are answers to the questions we hear most often. If you can't find what you're looking for, contact us — we're happy to help.",
    },
    {
      id: "faq",
      type: "faq",
      heading: "Getting help",
      items: [
        { question: "Who can receive help from TOMCARE?", answer: "Newcomers to Canada at any stage of settlement, people with disabilities or special needs, single mothers, seniors, people experiencing homelessness and anyone facing hardship." },
        { question: "Do your services cost anything?", answer: "No. Our programs and everyday services are free for the people we support." },
        { question: "Which languages do you speak?", answer: "Our team and volunteers speak French and English, and several other languages. Tell us your preferred language when you register." },
        { question: "How do I register?", answer: "Fill in the short form on our Get help page, call us, or visit us during opening hours. We'll contact you to talk about what you need." },
      ],
    },
    {
      id: "faq-give",
      type: "faq",
      heading: "Volunteering and donating",
      items: [
        { question: "Do I need experience to volunteer?", answer: "No. We provide orientation and support. What matters most is patience, reliability and a welcoming attitude." },
        { question: "What items can I donate?", answer: "Clean, good-quality clothing (especially winter clothing), household goods, kitchenware and small furniture. Contact us first for larger items." },
        { question: "Will I receive a receipt for my donation?", answer: "All donors receive a certificate of recognition. Contact us for details about receipts." },
      ],
    },
    {
      id: "cta",
      type: "cta",
      heading: "Still have a question?",
      text: "Our team will get back to you as soon as possible.",
      buttonLabel: "Contact us",
      buttonHref: "/contact",
    },
  ],
};

const testimonials = [
  {
    quote:
      "TOMCARE helped me find a job within two months of arriving in Canada. As a single mother, I thought it would be impossible. Today I have stable work and my family is thriving.",
    name: "Amina M.",
    role: "Newcomer and mother of two",
  },
  {
    quote:
      "I struggled to access services because of my disability. TOMCARE helped me with housing, job training and — most importantly — hope. I'm now independent and giving back to my community.",
    name: "John D.",
    role: "Program participant",
  },
  {
    quote:
      "The social activities changed everything for me. I came to Montréal knowing no one; now I have friends, a French class and a volunteer role of my own.",
    name: "Carlos R.",
    role: "Asylum seeker, now volunteer",
  },
];

async function fillIfEmpty(label: string, count: () => Promise<number>, create: () => Promise<unknown>) {
  if ((await count()) > 0) return;
  await create();
  console.info(`Seeded ${label}`);
}

async function main() {
  if ((await prisma.user.count()) === 0) {
    const email = (process.env.SEED_ADMIN_EMAIL || "admin@tomcarefoundation.org").toLowerCase();
    const password = process.env.SEED_ADMIN_PASSWORD || randomBytes(9).toString("base64url");
    await prisma.user.create({
      data: {
        name: process.env.SEED_ADMIN_NAME || "TOMCARE Admin",
        email,
        role: "ADMIN",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
    console.info(`Created admin ${email}${process.env.SEED_ADMIN_PASSWORD ? "" : ` with temporary password: ${password}`}`);
  }

  await fillIfEmpty("programs", () => prisma.program.count(), () =>
    prisma.program.createMany({ data: programs.map((program, sortOrder) => ({ ...program, sortOrder })) }),
  );
  await fillIfEmpty("services", () => prisma.service.count(), () =>
    prisma.service.createMany({
      data: services.map(([title, description, icon], sortOrder) => ({ title, description, icon, sortOrder })),
    }),
  );
  await fillIfEmpty("volunteer roles", () => prisma.volunteerRole.count(), () =>
    prisma.volunteerRole.createMany({ data: volunteerRoles.map((role, sortOrder) => ({ ...role, sortOrder })) }),
  );
  await fillIfEmpty("events", () => prisma.event.count(), () => prisma.event.createMany({ data: events }));
  await fillIfEmpty("posts", () => prisma.post.count(), () =>
    prisma.post.createMany({ data: posts.map((post) => ({ ...post, status: "PUBLISHED" as const })) }),
  );
  await fillIfEmpty("pages", () => prisma.page.count(), () =>
    prisma.page.create({ data: { ...faqPage, status: "PUBLISHED" } }),
  );
  await fillIfEmpty("testimonials", () => prisma.testimonial.count(), () =>
    prisma.testimonial.createMany({ data: testimonials.map((item, sortOrder) => ({ ...item, sortOrder })) }),
  );
  await fillIfEmpty("team", () => prisma.teamMember.count(), () =>
    prisma.teamMember.create({
      data: {
        name: "Tom Ntambara",
        role: "Founder & Legal Representative",
        bio: "Tom founded TOMCARE Foundation in 2024 after seeing first-hand the challenges immigrants face in Canada: a lack of information, difficult living conditions, depression and language barriers.",
        group: "BOARD",
      },
    }),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
