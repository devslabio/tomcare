import { ArrowRight, CalendarDays, HandHeart, Heart, Quote, ReceiptText, Sparkles } from "lucide-react";

import { EventCard, ProgramCard } from "@/components/cards";
import { Highlight } from "@/components/highlight";
import { Link } from "@/components/link";
import { Photo } from "@/components/photo";
import { Avatar, ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import { getEvents, getPosts, getPrograms, getServices, getSettings, getTeam, getTestimonials, lines, stats } from "@/lib/cms";
import { formatDate } from "@/lib/format";
import { fill } from "@/lib/i18n";
import { quoteMarks } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { Icon } from "@/lib/icons";
import { photos } from "@/lib/photos";
import { revealDelay } from "@/lib/reveal";

const audienceImages = [photos.arrival, photos.wheelchair, photos.seniors, photos.mother];
const pathLinks = [
  { href: "/get-help", icon: Sparkles },
  { href: "/volunteer", icon: HandHeart },
  { href: "/donate", icon: Heart },
];

/** Horizontal swipe row on phones, grid from tablets up — keeps long lists from filling several screens. */
const swipeRow =
  "-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 no-scrollbar sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0";
const swipeItem = "w-[82%] shrink-0 snap-start sm:w-auto";

export default async function HomePage() {
  const [{ locale, t }, settings, programs, services, events, posts, testimonials, team] = await Promise.all([
    getI18n(),
    getSettings(),
    getPrograms(),
    getServices(),
    getEvents(),
    getPosts(),
    getTestimonials(),
    getTeam(),
  ]);
  const copy = t.home;
  const { hero, about, donate } = settings;
  const [open, close] = quoteMarks(locale);
  const featured = (programs.some((program) => program.featured) ? programs.filter((program) => program.featured) : programs).slice(0, 6);
  const [impact] = stats(settings);
  const founder = team.find((member) => member.group === "BOARD") ?? team[0];
  const founderName = founder?.name ?? about.representative.split(",")[0];
  const founderRole = founder?.role ?? about.representative.split(",").slice(1).join(",").trim();
  const [leadTestimonial, ...otherTestimonials] = testimonials;
  const upcoming = events.upcoming.slice(0, 3);
  const latest = posts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="grain relative isolate flex flex-col overflow-hidden bg-ink text-white lg:min-h-[100svh]">
        <Photo
          src={photos.hero}
          alt={copy.heroAlt}
          fill
          priority
          sizes="100vw"
          quality={90}
          className="animate-kenburns -z-20 object-cover object-[46%_center] lg:object-[60%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/55 to-transparent" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-transparent to-ink/40" aria-hidden />

        <div className="container-x flex flex-1 flex-col justify-center pb-10 pt-28 sm:pb-14 sm:pt-40 lg:pb-16 lg:pt-48">
          <div className="max-w-3xl">
            <div className="animate-rise">
              <Eyebrow light>{hero.eyebrow}</Eyebrow>
            </div>
            <h1 className="animate-rise font-display text-display mt-5 text-balance font-normal [animation-delay:80ms]">
              <Highlight text={hero.title} />
            </h1>
            <p className="animate-rise text-lead mt-6 hidden max-w-2xl text-white/85 [animation-delay:160ms] sm:block sm:text-xl sm:leading-9">
              {hero.subtitle}
            </p>
          </div>
        </div>

        <div className="container-x relative pb-6 sm:pb-10 lg:pb-14">
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {copy.paths.map((path, index) => {
              const { href, icon: PathIcon } = pathLinks[index];
              return (
                <Link
                  key={href}
                  href={href}
                  className="group animate-rise flex items-center gap-4 rounded-[20px] bg-white p-4 text-ink shadow-[0_20px_50px_-25px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5 sm:items-start sm:p-6"
                  style={{ animationDelay: `${240 + index * 80}ms` }}
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gold text-ink sm:size-12">
                    <PathIcon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-muted">{path.kicker}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-lg font-bold">
                      {path.title}
                      <ArrowRight className="size-4 text-indigo transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                    <span className="mt-1 hidden text-[15px] leading-6 text-muted sm:block">{path.text}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About and founder */}
      <section className="paper section-y relative overflow-hidden">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6" data-reveal>
            <Eyebrow>{copy.aboutEyebrow}</Eyebrow>
            <h2 className="font-display text-h2 mt-5 text-balance text-ink">
              <Highlight text={about.headline} className="text-indigo underline-brush" />
            </h2>
            <p className="text-lead mt-6 text-ink/80">{about.intro}</p>
            <figure className="mt-8 rounded-[24px] border-l-4 border-gold bg-white p-7 shadow-[0_20px_50px_-30px_rgba(11,21,55,0.3)]">
              <Quote className="size-6 text-gold" aria-hidden />
              <blockquote className="font-display mt-3 text-xl leading-relaxed text-ink">{open}{about.quote}{close}</blockquote>
              {about.quoteAuthor ? <figcaption className="mt-3 text-[15px] font-semibold text-muted">— {about.quoteAuthor}</figcaption> : null}
            </figure>
            {founderName ? (
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <Avatar name={founderName} photo={founder?.photo} className="size-16 text-xl" />
                  <div>
                    <p className="text-sm font-semibold text-indigo">{copy.founderEyebrow}</p>
                    <p className="text-lg font-bold text-ink">{founderName}</p>
                    {founderRole ? <p className="text-sm text-muted">{founderRole}</p> : null}
                  </div>
                </div>
                <ButtonLink href="/about" variant="ghost">
                  {t.actions.readStory}
                </ButtonLink>
              </div>
            ) : null}
          </div>
          <div className="relative lg:col-span-6" data-reveal style={revealDelay(120)}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-sand sm:aspect-[5/4] lg:aspect-[4/5]">
              <Photo src={photos.family} alt={copy.familyAlt} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
            </div>
            {impact ? (
              <div className="absolute -bottom-6 left-4 max-w-[60%] rounded-[20px] bg-white px-5 py-4 shadow-[0_30px_60px_-25px_rgba(11,21,55,0.45)] sm:left-8 sm:max-w-none sm:px-7 sm:py-5">
                <p className="font-display text-5xl text-indigo">{impact.value}</p>
                <p className="mt-1 max-w-[13rem] text-sm leading-5 text-muted">{impact.label}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="section-y bg-ink text-white">
        <div className="container-x">
          <SectionHeading light eyebrow={copy.serveEyebrow} title={copy.serveTitle} description={copy.serveText} />
          <div className={`mt-12 ${swipeRow} sm:grid-cols-2 lg:grid-cols-4`}>
            {copy.audiences.map((audience, index) => (
              <article
                key={audience.title}
                className={`${swipeItem} flex flex-col overflow-hidden rounded-[24px] bg-white/[0.06] ring-1 ring-white/10`}
                data-reveal
                style={revealDelay(index * 90)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-soft">
                  <Photo
                    src={audienceImages[index]}
                    alt={audience.alt}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 82vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <h3 className="font-display text-h3">{audience.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-7 text-white/80">{audience.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="paper section-y">
        <div className="container-x">
          <SectionHeading
            eyebrow={copy.programsEyebrow}
            title={<Highlight text={copy.programsTitle} className="text-indigo not-italic" />}
            action={
              <ButtonLink href="/programs" variant="outline">
                {fill(copy.allPrograms, { count: programs.length })}
              </ButtonLink>
            }
          />
          <div className={`mt-12 ${swipeRow} sm:grid-cols-2 lg:grid-cols-3`}>
            {featured.map((program, index) => (
              <div key={program.id} className={swipeItem} data-reveal style={revealDelay((index % 3) * 90)}>
                <ProgramCard program={program} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everyday services */}
      {services.length ? (
        <section className="section-y bg-sand">
          <div className="container-x">
            <SectionHeading
              eyebrow={copy.servicesEyebrow}
              title={<Highlight text={copy.servicesTitle} className="text-indigo not-italic" />}
              description={copy.servicesText}
              action={
                <ButtonLink href="/get-help" variant="gold">
                  {copy.servicesCta}
                </ButtonLink>
              }
            />
            <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {services.map((service, index) => (
                <li
                  key={service.id}
                  className="flex items-center gap-3 rounded-[18px] border border-line/80 bg-white p-3.5 sm:items-start sm:gap-4 sm:rounded-[22px] sm:p-6"
                  data-reveal
                  style={revealDelay((index % 3) * 60)}
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo/[0.07] text-indigo sm:size-12 sm:rounded-2xl">
                    <Icon name={service.icon} className="size-[18px] sm:size-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold leading-5 text-ink sm:text-base">{service.title}</span>
                    <span className="mt-1 hidden text-[15px] leading-6 text-muted sm:block">{service.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Give */}
      <section className="paper section-y">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1" data-reveal>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-sand lg:aspect-[4/5]">
              <Photo src={photos.familyUnpacking} alt={copy.donatePhotoAlt} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="order-1 lg:order-2" data-reveal style={revealDelay(120)}>
            <Eyebrow>{copy.giveEyebrow}</Eyebrow>
            <h2 className="font-display text-h2 mt-5 text-balance text-ink">
              <Highlight text={donate.headline} className="text-indigo not-italic" />
            </h2>
            <p className="text-lead mt-6 text-ink/80">{donate.intro}</p>
            {donate.dropOffDays ? (
              <div className="mt-8 rounded-[24px] border border-line bg-white p-6">
                <p className="flex items-center gap-2 font-bold text-ink">
                  <CalendarDays className="size-5 text-indigo" aria-hidden />
                  {copy.donationDays}
                </p>
                <dl className="mt-3 divide-y divide-line">
                  {lines(donate.dropOffDays).map((line) => {
                    const [day, time, note] = line.split("·").map((part) => part.trim());
                    return (
                      <div key={line} className="grid gap-x-6 gap-y-0.5 py-3 sm:grid-cols-[11rem_1fr]">
                        <dt className="font-semibold text-ink">{day}</dt>
                        <dd className="text-[15px] text-ink/80">
                          <span className="font-semibold tabular-nums">{time}</span>
                          {note ? <span className="block text-muted">{note}</span> : null}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ) : null}
            {donate.recognition || donate.charityNumber ? (
              <p className="mt-5 flex gap-3 text-[15px] leading-7 text-ink/80">
                <ReceiptText className="mt-1 size-5 shrink-0 text-gold-deep" aria-hidden />
                <span>
                  <span className="font-bold text-ink">{copy.receiptTitle}. </span>
                  {donate.charityNumber ? `${fill(copy.receiptCharity, { number: donate.charityNumber })} ` : null}
                  {donate.recognition}
                </span>
              </p>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/donate#donation-form" variant="gold" className="w-full sm:w-auto">
                {t.actions.donateNow}
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline" arrow={false} className="w-full sm:w-auto">
                {copy.arrangeDropOff}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Events and news */}
      {upcoming.length || latest.length ? (
        <section className="section-y bg-sand">
          <div className="container-x">
            <SectionHeading
              eyebrow={copy.communityEyebrow}
              title={<Highlight text={copy.communityTitle} className="text-indigo not-italic" />}
              description={copy.communityText}
            />
            <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
              {upcoming.length ? (
                <div className={latest.length ? "lg:col-span-7" : "lg:col-span-12"}>
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-ink">{copy.upcoming}</h3>
                    <Link href="/events" className="text-sm font-bold text-indigo hover:text-indigo-deep">
                      {copy.allEvents} →
                    </Link>
                  </div>
                  <div className="grid gap-4">
                    {upcoming.map((event, index) => (
                      <div key={event.id} data-reveal style={revealDelay(index * 80)}>
                        <EventCard event={event} compact />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {latest.length ? (
                <div className={upcoming.length ? "lg:col-span-5" : "lg:col-span-12"}>
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-ink">{copy.latestNews}</h3>
                    <Link href="/news" className="text-sm font-bold text-indigo hover:text-indigo-deep">
                      {copy.allNews} →
                    </Link>
                  </div>
                  <ul className="divide-y divide-line rounded-[24px] border border-line bg-white">
                    {latest.map((post) => (
                      <li key={post.id}>
                        <Link href={`/news/${post.slug}`} className="group flex gap-4 p-5 transition hover:bg-cream">
                          {post.coverImage ? (
                            <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-sand sm:size-24">
                              <Photo src={post.coverImage} alt={post.title} fill sizes="96px" className="object-cover" />
                            </span>
                          ) : null}
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-indigo">
                              {post.category}
                              {post.publishedAt ? (
                                <span className="font-normal text-muted"> · {formatDate(post.publishedAt, { dateStyle: "medium" }, locale)}</span>
                              ) : null}
                            </span>
                            <span className="font-display mt-1 block text-lg leading-snug text-ink group-hover:text-indigo">{post.title}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Testimonials */}
      {leadTestimonial ? (
        <section className="paper section-y">
          <div className="container-x">
            <Eyebrow>{copy.testimonialsEyebrow}</Eyebrow>
            <div className="mt-8 grid gap-5 lg:grid-cols-12">
              <figure className="flex flex-col justify-between rounded-[28px] bg-white p-8 shadow-[0_30px_60px_-40px_rgba(11,21,55,0.35)] lg:col-span-7 lg:p-10" data-reveal>
                <blockquote className="font-display text-balance text-title leading-[1.35] text-ink">
                  <span className="text-gold">{open}</span>
                  {leadTestimonial.quote}
                  <span className="text-gold">{close}</span>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <Avatar name={leadTestimonial.name} photo={leadTestimonial.photo} className="size-14 text-lg" />
                  <span>
                    <span className="block font-bold text-ink">{leadTestimonial.name}</span>
                    <span className="block text-sm text-muted">{leadTestimonial.role}</span>
                  </span>
                </figcaption>
              </figure>
              {otherTestimonials.length ? (
                <div className="grid gap-5 lg:col-span-5">
                  {otherTestimonials.slice(0, 2).map((testimonial, index) => (
                    <figure
                      key={testimonial.id}
                      className="flex flex-col justify-between rounded-[28px] border border-line bg-white p-7"
                      data-reveal
                      style={revealDelay(120 + index * 90)}
                    >
                      <blockquote className="text-[17px] leading-8 text-ink/85">{open}{testimonial.quote}{close}</blockquote>
                      <figcaption className="mt-5 flex items-center gap-3">
                        <Avatar name={testimonial.name} photo={testimonial.photo} className="size-11 text-sm" />
                        <span>
                          <span className="block font-bold text-ink">{testimonial.name}</span>
                          <span className="block text-sm text-muted">{testimonial.role}</span>
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Volunteer */}
      <section className="bg-cream pb-16 lg:pb-24">
        <div className="container-x">
          <div className="grid overflow-hidden rounded-[32px] bg-gold-soft lg:grid-cols-2" data-reveal>
            <div className="p-8 sm:p-12 lg:p-16">
              <Eyebrow>{copy.volunteerEyebrow}</Eyebrow>
              <h2 className="font-display text-h2 mt-5 text-balance text-ink">
                <Highlight text={copy.volunteerTitle} className="text-indigo not-italic" />
              </h2>
              <p className="text-lead mt-6 text-ink/80">{copy.volunteerText}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/volunteer" className="w-full sm:w-auto">
                  {copy.volunteerCta}
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline" arrow={false} className="w-full sm:w-auto">
                  {copy.askQuestion}
                </ButtonLink>
              </div>
            </div>
            <div className="relative min-h-72 lg:min-h-full">
              <Photo src={photos.volunteer} alt={copy.volunteerAlt} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
