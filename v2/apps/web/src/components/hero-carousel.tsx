"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";

import { Highlight, stripStars } from "@/components/highlight";
import { useI18n } from "@/components/i18n-provider";
import { Photo } from "@/components/photo";
import { ButtonLink, Eyebrow } from "@/components/ui";
import type { HeroSlide } from "@/lib/cms-types";
import { fill } from "@/lib/i18n";

export type Slide = Pick<HeroSlide, "id" | "eyebrow" | "title" | "subtitle" | "image" | "imageAlt" | "ctaLabel" | "ctaHref">;

const INTERVAL_MS = 7000;
const SWIPE_PX = 50;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const prefersReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Home page hero: photos crossfade behind the headline while the pathway cards (children) stay put.
 * Rotation pauses on hover, keyboard focus and hidden tabs, and never starts for reduced-motion users.
 */
export function HeroCarousel({ slides, children }: { slides: Slide[]; children: React.ReactNode }) {
  const { t } = useI18n();
  const copy = t.home.carousel;
  const [active, setActive] = useState(0);
  const [chosen, setChosen] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const touchX = useRef<number | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
  const playing = chosen ?? !reducedMotion;
  const count = slides.length;
  const rotating = count > 1;

  const go = (index: number) => setActive((index + count) % count);
  const paused = !playing || hovered || focused;

  return (
    <section
      className="grain relative isolate flex flex-col overflow-hidden bg-ink text-white lg:min-h-[100svh]"
      aria-roledescription={rotating ? "carousel" : undefined}
      aria-label={rotating ? copy.label : undefined}
      onTouchStart={(event) => {
        touchX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchX.current === null || !rotating) return;
        const distance = event.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(distance) > SWIPE_PX) go(active + (distance < 0 ? 1 : -1));
      }}
    >
      <div className="absolute inset-0 -z-20" aria-hidden>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${index === active ? "opacity-100" : "opacity-0"}`}
          >
            <Photo
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              quality={90}
              className={`object-cover object-[46%_center] lg:object-[60%_center] ${index === active ? "animate-kenburns" : ""}`}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/55 to-transparent" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-transparent to-ink/40" aria-hidden />

      <div className="container-x flex flex-1 flex-col justify-center pb-10 pt-28 sm:pb-14 sm:pt-40 lg:pb-16 lg:pt-48">
        <div
          className="max-w-3xl"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={(event) => setFocused(event.target.matches(":focus-visible"))}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
          }}
          onKeyDown={(event) => {
            if (!rotating || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
            event.preventDefault();
            go(active + (event.key === "ArrowRight" ? 1 : -1));
          }}
        >
          <div className="grid" aria-live={rotating && !paused ? "off" : "polite"}>
            {slides.map((slide, index) => {
              const current = index === active;
              const Heading = index === 0 ? "h1" : "h2";
              return (
                <div
                  key={slide.id}
                  role={rotating ? "group" : undefined}
                  aria-roledescription={rotating ? "slide" : undefined}
                  aria-label={rotating ? fill(copy.slide, { index: index + 1, count }) : undefined}
                  aria-hidden={!current}
                  inert={!current}
                  className={`[grid-area:1/1] transition duration-700 ease-out ${
                    current ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  {slide.imageAlt ? <span className="sr-only">{slide.imageAlt}</span> : null}
                  {slide.eyebrow ? (
                    <div className="animate-rise">
                      <Eyebrow light>{slide.eyebrow}</Eyebrow>
                    </div>
                  ) : null}
                  <Heading className="animate-rise font-display text-display mt-5 text-balance font-normal [animation-delay:80ms]">
                    <Highlight text={slide.title} />
                  </Heading>
                  {slide.subtitle ? (
                    <p className="animate-rise text-lead mt-6 hidden max-w-2xl text-white/85 [animation-delay:160ms] sm:block sm:text-xl sm:leading-9">
                      {slide.subtitle}
                    </p>
                  ) : null}
                  {slide.ctaLabel && slide.ctaHref ? (
                    <div className="animate-rise mt-8 [animation-delay:200ms]">
                      <ButtonLink href={slide.ctaHref} variant="outline-light">
                        {slide.ctaLabel}
                      </ButtonLink>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {rotating ? (
            <div className="animate-rise mt-10 flex items-center gap-5 [animation-delay:240ms] sm:mt-12">
              <div className="flex items-center gap-1.5">
                {slides.map((slide, index) => {
                  const current = index === active;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => go(index)}
                      aria-label={fill(copy.goTo, { index: index + 1, title: stripStars(slide.title) })}
                      aria-current={current ? "true" : undefined}
                      className="group flex h-8 w-9 items-center sm:w-12"
                    >
                      <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/45">
                        {current ? (
                          <span
                            key={`${active}-${playing}`}
                            className="absolute inset-0 origin-left rounded-full bg-gold"
                            style={
                              playing
                                ? {
                                    animation: `hero-progress ${INTERVAL_MS}ms linear forwards`,
                                    animationPlayState: paused ? "paused" : "running",
                                  }
                                : undefined
                            }
                            onAnimationEnd={() => go(active + 1)}
                          />
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="hidden whitespace-nowrap text-sm font-semibold tabular-nums text-white/70 sm:block" aria-hidden>
                {String(active + 1).padStart(2, "0")}
                <span className="text-white/40"> / {String(count).padStart(2, "0")}</span>
              </p>
              <div className="ml-auto flex items-center gap-2 sm:ml-2">
                <ControlButton label={copy.previous} onClick={() => go(active - 1)}>
                  <ChevronLeft className="size-[18px]" aria-hidden />
                </ControlButton>
                <ControlButton label={playing ? copy.pause : copy.play} onClick={() => setChosen(!playing)}>
                  {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
                </ControlButton>
                <ControlButton label={copy.next} onClick={() => go(active + 1)}>
                  <ChevronRight className="size-[18px]" aria-hidden />
                </ControlButton>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white hover:text-ink"
    >
      {children}
    </button>
  );
}
