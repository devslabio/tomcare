import type { Block } from "@/lib/blocks";
import { Icon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import { Faq } from "./faq";
import { HandMark } from "./logo";
import { Markdown } from "./markdown";
import { Photo } from "./photo";
import { ButtonLink } from "./ui";

/** Renders the blocks of a page built in the admin. Each block is a full-width section. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "richText":
      return (
        <section className="container-x py-14 lg:py-20">
          <div className="mx-auto max-w-3xl" data-reveal>
            {block.heading ? (
              <h2 className="font-display mb-6 text-balance text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.1] text-ink">{block.heading}</h2>
            ) : null}
            <Markdown source={block.body} />
          </div>
        </section>
      );

    case "imageText": {
      const imageLeft = block.imageSide === "left";
      return (
        <section className="container-x py-14 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div className={`relative ${imageLeft ? "" : "lg:order-2"}`} data-reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-sand sm:aspect-[4/3] lg:aspect-[4/5]">
                <Photo src={block.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <span className="absolute -bottom-5 -right-3 hidden size-24 items-center justify-center rounded-full bg-gold sm:flex" aria-hidden>
                <HandMark className="h-12 w-auto" color="#0b1537" />
              </span>
            </div>
            <div data-reveal style={revealDelay(100)}>
              {block.eyebrow ? (
                <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-indigo">{block.eyebrow}</p>
              ) : null}
              <h2 className="font-display mt-3 text-balance text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.1] text-ink">{block.heading}</h2>
              <Markdown source={block.body} className="mt-6" />
              {block.buttonLabel && block.buttonHref ? (
                <ButtonLink href={block.buttonHref} className="mt-8">
                  {block.buttonLabel}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    case "cards":
      return (
        <section className="container-x py-14 lg:py-20">
          {block.heading || block.intro ? (
            <div className="mx-auto max-w-2xl text-center" data-reveal>
              {block.heading ? (
                <h2 className="font-display text-balance text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.1] text-ink">{block.heading}</h2>
              ) : null}
              {block.intro ? <p className="mt-4 text-[17px] leading-8 text-muted">{block.intro}</p> : null}
            </div>
          ) : null}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {block.items.map((item, index) => (
              <div key={index} className="rounded-[24px] border border-line bg-white p-7" data-reveal style={revealDelay((index % 3) * 80)}>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-indigo/[0.07] text-indigo">
                  <Icon name={item.icon ?? "heart-handshake"} className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{item.title}</h3>
                {item.text ? <p className="mt-2 text-[15px] leading-7 text-muted">{item.text}</p> : null}
              </div>
            ))}
          </div>
        </section>
      );

    case "stats":
      return (
        <section className="py-6">
          <div className="container-x">
            <div className="rounded-[32px] bg-indigo px-6 py-12 text-white sm:px-12 lg:py-16">
              {block.heading ? (
                <h2 className="font-display mb-10 text-center text-[clamp(1.6rem,3vw,2.25rem)]">{block.heading}</h2>
              ) : null}
              <dl className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                {block.items.map((item, index) => (
                  <div key={index} data-reveal style={revealDelay(index * 80)}>
                    <dt className="sr-only">{item.label}</dt>
                    <dd className="font-display text-5xl text-gold lg:text-6xl">{item.value}</dd>
                    <dd className="mt-3 text-[15px] text-white/75">{item.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      );

    case "quote":
      return (
        <section className="container-x py-14 lg:py-20">
          <figure className="mx-auto max-w-4xl text-center" data-reveal>
            <span className="font-display block text-7xl leading-none text-gold" aria-hidden>
              “
            </span>
            <blockquote className="font-display -mt-4 text-balance text-[clamp(1.6rem,3.4vw,2.6rem)] italic leading-[1.3] text-ink">
              {block.quote}
            </blockquote>
            {block.author ? (
              <figcaption className="mt-8 text-[15px] text-muted">
                <span className="font-bold text-ink">{block.author}</span>
                {block.role ? ` · ${block.role}` : null}
              </figcaption>
            ) : null}
          </figure>
        </section>
      );

    case "faq":
      return (
        <section className="container-x py-10 lg:py-14">
          <div className="mx-auto max-w-3xl" data-reveal>
            {block.heading ? <h2 className="font-display mb-8 text-[clamp(1.7rem,3vw,2.25rem)] text-ink">{block.heading}</h2> : null}
            <Faq items={block.items} />
          </div>
        </section>
      );

    case "gallery":
      return (
        <section className="container-x py-14 lg:py-20">
          {block.heading ? (
            <h2 className="font-display mb-10 text-center text-[clamp(1.9rem,3.6vw,2.75rem)] text-ink" data-reveal>
              {block.heading}
            </h2>
          ) : null}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {block.images.map((src, index) => (
              <div key={src + index} className="mb-4 break-inside-avoid overflow-hidden rounded-[20px] bg-sand" data-reveal style={revealDelay((index % 3) * 60)}>
                <Photo src={src} alt="" width={800} height={index % 3 === 1 ? 1000 : 600} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      );

    case "cta":
      return (
        <section className="container-x py-14 lg:py-20">
          <div className="grain relative isolate overflow-hidden rounded-[32px] bg-ink px-8 py-14 text-center text-white sm:px-14 lg:py-20" data-reveal>
            <div className="pointer-events-none absolute -right-20 -top-20 -z-10 size-96 glow-sky opacity-40" aria-hidden />
            <div className="pointer-events-none absolute -bottom-24 -left-10 -z-10 size-80 glow-gold opacity-30" aria-hidden />
            <h2 className="font-display mx-auto max-w-3xl text-balance text-[clamp(2rem,4vw,3rem)] leading-[1.1]">{block.heading}</h2>
            {block.text ? <p className="mx-auto mt-5 max-w-xl text-[17px] leading-8 text-white/70">{block.text}</p> : null}
            <ButtonLink href={block.buttonHref} variant="gold" className="mt-9">
              {block.buttonLabel}
            </ButtonLink>
          </div>
        </section>
      );
  }
}
