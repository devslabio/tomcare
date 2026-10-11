import { ArrowRight, CalendarDays, HandHeart, Heart, Quote, Sparkles } from "lucide-react";
import Link from "next/link";

import { EventCard, PostCard, ProgramCard } from "@/components/cards";
import { Highlight } from "@/components/highlight";
import { HandMark } from "@/components/logo";
import { Photo } from "@/components/photo";
import { Avatar, ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import { getEvents, getPosts, getPrograms, getServices, getSettings, getTestimonials, lines, stats } from "@/lib/cms";
import { Icon } from "@/lib/icons";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

const audiences = [
  {
    title: "Newcomers & asylum seekers",
    text: "Guidance through every step of settling in Quebec — paperwork, housing, French, work and community.",
    image: photos.arrival,
  },
  {
    title: "People living with disabilities",
    text: "Practical support to access services, housing and training, and to live with independence and dignity.",
    image: photos.wheelchair,
  },
  {
    title: "Seniors",
    text: "Company, help with daily tasks and a connection to services, so no older person is left isolated.",
    image: photos.seniors,
  },
  {
    title: "Families facing hardship",
    text: "Single mothers, people living with depression, families stretched thin — help with essentials and a way forward.",
    image: photos.mother,
  },
];

const paths = [
  {
    href: "/get-help",
    icon: Sparkles,
    kicker: "I’m new here",
    title: "Ask for help",
    text: "Free, confidential support for newcomers and families.",
  },
  {
    href: "/volunteer",
    icon: HandHeart,
    kicker: "I have time to give",
    title: "Become a volunteer",
    text: "Teach, translate, drive, mentor or simply welcome.",
  },
  {
    href: "/donate",
    icon: Heart,
    kicker: "I want to give",
    title: "Make a donation",
    text: "Money, clothing, furniture — every gift goes directly to people.",
  },
];

export default async function HomePage() {
  const [settings, programs, services, events, posts, testimonials] = await Promise.all([
    getSettings(),
    getPrograms(),
    getServices(),
    getEvents(),
    getPosts(),
    getTestimonials(),
  ]);
  const { hero, about, donate } = settings;
  const featured = (programs.some((program) => program.featured) ? programs.filter((program) => program.featured) : programs).slice(0, 6);
  const figures = stats(settings);
  const [leadTestimonial, ...otherTestimonials] = testimonials;

  return (
    <>
      {/* Hero */}
      <section className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white">
        <Photo src={photos.hero} alt="" fill priority sizes="100vw" quality={90} className="animate-kenburns -z-20 object-cover object-[46%_center] lg:object-[60%_center]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/10" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/10 to-ink/40" aria-hidden />

        <div className="container-x flex flex-1 flex-col justify-center pb-16 pt-40 lg:pb-24 lg:pt-48">
          <div className="max-w-3xl">
            <div className="animate-rise">
              <Eyebrow light>{hero.eyebrow}</Eyebrow>
            </div>
            <h1 className="animate-rise font-display mt-6 text-balance text-[clamp(2.75rem,7vw,5.75rem)] font-normal leading-[1.02] tracking-[-0.03em] [animation-delay:80ms]">
              <Highlight text={hero.title} />
            </h1>
            <p className="animate-rise mt-7 max-w-2xl text-lg leading-8 text-white/80 [animation-delay:160ms] sm:text-xl sm:leading-9">
              {hero.subtitle}
            </p>
            <div className="animate-rise mt-10 flex flex-wrap gap-3 [animation-delay:240ms]">
              <ButtonLink href="/get-help" variant="gold">
                Ask for help
              </ButtonLink>
              <ButtonLink href="/about" variant="outline-light" arrow={false}>
                Who we are
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="container-x relative pb-10 lg:pb-14">
          <div className="grid overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.07] backdrop-blur-md md:grid-cols-3">
            {paths.map((path, index) => (
              <Link
                key={path.href}
                href={path.href}
                className={`group animate-rise flex items-start gap-4 p-6 transition hover:bg-white/[0.08] lg:p-8 ${
                  index ? "border-t border-white/10 md:border-l md:border-t-0" : ""
                }`}
                style={{ animationDelay: `${320 + index * 80}ms` }}
              >
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gold text-ink">
                  <path.icon className="size-5" aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block text-xs font-bold uppercase tracking-wider text-white/55">{path.kicker}</span>
                  <span className="mt-1 flex items-center gap-2 text-lg font-bold">
                    {path.title}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-white/65">{path.text}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="paper relative overflow-hidden py-24 lg:py-32">
        <div className="container-x grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6" data-reveal>
            <Eyebrow>About TOMCARE</Eyebrow>
            <h2 className="font-display mt-5 text-balance text-[clamp(2.1rem,4.4vw,3.5rem)] leading-[1.08] tracking-[-0.02em] text-ink">
              <Highlight text={about.headline} className="italic text-indigo underline-brush" />
            </h2>
            <p className="mt-7 text-lg leading-8 text-ink/75">{about.intro}</p>
            <figure className="mt-10 rounded-[24px] border-l-4 border-gold bg-white p-7 shadow-[0_20px_50px_-30px_rgba(11,21,55,0.3)]">
              <Quote className="size-7 text-gold" aria-hidden />
              <blockquote className="font-display mt-3 text-xl italic leading-relaxed text-ink">“{about.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted">The value that guides our work</figcaption>
            </figure>
            <ButtonLink href="/about" variant="ghost" className="mt-8">
              Read our story
            </ButtonLink>
          </div>
          <div className="relative lg:col-span-6" data-reveal style={revealDelay(120)}>
            <div className="grid grid-cols-5 gap-4">
              <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-[28px] bg-sand">
                <Photo src={photos.family} alt="A family sharing a moment together" fill sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
              </div>
              <div className="col-span-2 flex flex-col gap-4 pt-16">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-sand">
                  <Photo src={photos.handsTogether} alt="Hands joined together" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
                </div>
                <div className="rounded-[24px] bg-indigo p-5 text-white">
                  <HandMark className="h-8 w-auto" color="#e5ac1b" />
                  <p className="mt-3 text-sm leading-6 text-white/80">Founded in Montréal in {about.founded}</p>
                </div>
              </div>
            </div>
            {figures[0] ? (
              <div className="absolute -bottom-8 left-4 max-w-[52%] rounded-[24px] bg-white px-5 py-4 shadow-[0_30px_60px_-25px_rgba(11,21,55,0.45)] sm:left-10 sm:max-w-none sm:px-7 sm:py-5">
                <p className="font-display text-5xl text-indigo">{figures[0].value}</p>
                <p className="mt-1 max-w-[12rem] text-sm leading-5 text-muted">{figures[0].label}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-ink py-24 text-white lg:py-32">
        <div className="container-x">
          <SectionHeading
            light
            eyebrow="Who we serve"
            title={
              <>
                Help for anyone who is <em className="text-gold">starting over</em> — or struggling to keep going.
              </>
            }
            description="Our door is open to newcomers at every stage of settlement, and to people in Quebec who need a hand with the basics."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience, index) => (
              <article
                key={audience.title}
                className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[28px] p-7"
                data-reveal
                style={revealDelay(index * 90)}
              >
                <Photo
                  src={audience.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="-z-20 object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-transparent" aria-hidden />
                <h3 className="font-display text-2xl leading-tight">{audience.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/75">{audience.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="paper py-24 lg:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our programs"
            title={
              <>
                {programs.length} ways we walk beside people, <em className="text-indigo">month after month.</em>
              </>
            }
            action={<ButtonLink href="/programs" variant="outline">All programs</ButtonLink>}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((program, index) => (
              <div key={program.id} data-reveal style={revealDelay((index % 3) * 90)}>
                <ProgramCard program={program} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everyday services */}
      {services.length ? (
        <section className="bg-sand py-24 lg:py-32">
          <div className="container-x grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4" data-reveal>
              <div className="lg:sticky lg:top-32">
                <Eyebrow>Everyday services · Free</Eyebrow>
                <h2 className="font-display mt-5 text-balance text-[clamp(2rem,4vw,3rem)] leading-[1.08] text-ink">
                  Help with the small things that <em className="text-indigo">take hours</em> when you’re new.
                </h2>
                <p className="mt-5 text-[17px] leading-8 text-muted">
                  Drop in during opening hours. No appointment, no cost — just someone who knows how it works here.
                </p>
                <ButtonLink href="/contact" className="mt-8">
                  Visit or call us
                </ButtonLink>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {services.map((service, index) => (
                <li
                  key={service.id}
                  className="flex gap-4 rounded-[22px] border border-line/80 bg-white p-6 transition hover:border-indigo/30"
                  data-reveal
                  style={revealDelay((index % 2) * 80)}
                >
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo/[0.07] text-indigo">
                    <Icon name={service.icon} className="size-6" />
                  </span>
                  <span>
                    <span className="block font-bold text-ink">{service.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{service.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Figures */}
      {figures.length ? (
        <section className="bg-indigo py-20 text-white">
          <div className="container-x">
            <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {figures.map((figure, index) => (
                <div key={figure.label} className="border-l border-white/20 pl-6" data-reveal style={revealDelay(index * 80)}>
                  <dt className="sr-only">{figure.label}</dt>
                  <dd className="font-display text-[clamp(3rem,5vw,4.25rem)] leading-none text-gold">{figure.value}</dd>
                  <dd className="mt-3 text-[15px] leading-6 text-white/75">{figure.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* Donate */}
      <section className="paper py-24 lg:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-sand sm:aspect-[5/4] lg:aspect-[4/5]">
              <Photo src={photos.familyUnpacking} alt="A family unpacking toys in their new home" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-2 max-w-[17rem] rounded-[24px] bg-ink p-6 text-white shadow-xl sm:-right-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gold">Certificate of recognition</p>
              <p className="mt-2 text-sm leading-6 text-white/75">Every donor is thanked with an official certificate.</p>
            </div>
          </div>
          <div data-reveal style={revealDelay(120)}>
            <Eyebrow>Give</Eyebrow>
            <h2 className="font-display mt-5 text-balance text-[clamp(2.1rem,4.2vw,3.4rem)] leading-[1.08] text-ink">
              <Highlight text={donate.headline} className="italic text-indigo" />
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink/75">{donate.intro}</p>
            {donate.dropOffDays ? (
              <div className="mt-8 rounded-[24px] border border-line bg-white p-6">
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <CalendarDays className="size-4 text-indigo" aria-hidden />
                  Donation days
                </p>
                <ul className="mt-4 divide-y divide-line text-[15px]">
                  {lines(donate.dropOffDays).map((line) => {
                    const [day, time, note] = line.split("·").map((part) => part.trim());
                    return (
                      <li key={line} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                        <span className="font-semibold text-ink">{day}</span>
                        <span className="text-muted">
                          {time}
                          {note ? <span className="hidden sm:inline"> · {note}</span> : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/donate" variant="gold">
                Ways to give
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline" arrow={false}>
                Arrange a drop-off
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      {events.upcoming.length ? (
        <section className="bg-sand py-24 lg:py-32">
          <div className="container-x">
            <SectionHeading
              eyebrow="Coming up"
              title={
                <>
                  Come as you are. <em className="text-indigo">Bring a friend.</em>
                </>
              }
              description="Community meals, workshops and donation drives — open to everyone."
              action={<ButtonLink href="/events" variant="outline">All events</ButtonLink>}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.upcoming.slice(0, 3).map((event, index) => (
                <div key={event.id} data-reveal style={revealDelay(index * 90)}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Testimonials */}
      {leadTestimonial ? (
        <section className="paper py-24 lg:py-32">
          <div className="container-x">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7" data-reveal>
                <Eyebrow>In their words</Eyebrow>
                <blockquote className="font-display mt-8 text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.25] text-ink">
                  <span className="text-gold">“</span>
                  {leadTestimonial.quote}
                  <span className="text-gold">”</span>
                </blockquote>
                <div className="mt-10 flex items-center gap-4">
                  <Avatar name={leadTestimonial.name} photo={leadTestimonial.photo} className="size-14 text-lg" />
                  <div>
                    <p className="font-bold text-ink">{leadTestimonial.name}</p>
                    <p className="text-sm text-muted">{leadTestimonial.role}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 lg:col-span-5">
                {otherTestimonials.slice(0, 2).map((testimonial, index) => (
                  <figure key={testimonial.id} className="rounded-[24px] border border-line bg-white p-7" data-reveal style={revealDelay(120 + index * 90)}>
                    <blockquote className="text-[15px] leading-7 text-ink/80">“{testimonial.quote}”</blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <Avatar name={testimonial.name} photo={testimonial.photo} className="size-10 text-sm" />
                      <span>
                        <span className="block text-sm font-bold text-ink">{testimonial.name}</span>
                        <span className="block text-xs text-muted">{testimonial.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* News */}
      {posts.length ? (
        <section className="border-t border-line bg-cream py-24 lg:py-32">
          <div className="container-x">
            <SectionHeading
              eyebrow="News & stories"
              title="From the community"
              action={<ButtonLink href="/news" variant="outline">All news</ButtonLink>}
            />
            <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post, index) => (
                <div key={post.id} data-reveal style={revealDelay(index * 90)}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Volunteer */}
      <section className="px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="grain relative isolate overflow-hidden rounded-[36px] bg-ink text-white">
          <Photo src={photos.volunteer} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-90" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/20" aria-hidden />
          <div className="container-x py-24 lg:py-36">
            <div className="max-w-2xl" data-reveal>
              <Eyebrow light>Volunteer with us</Eyebrow>
              <h2 className="font-display mt-5 text-balance text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
                Give a few hours. <em className="text-gold">Change someone’s first year.</em>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
                Many of our volunteers were newcomers themselves. Teach French, help with a CV, drive a family to an appointment —
                we’ll find the role that fits you.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/volunteer" variant="gold">
                  See volunteer roles
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline-light" arrow={false}>
                  Ask a question
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
