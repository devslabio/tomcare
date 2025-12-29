"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, CheckCircle, Heart } from "lucide-react"

interface Slide {
  id: number
  subtitle: string
  title: string
  description: string
  button1: { text: string; link: string }
  button2: { text: string; link: string }
}

const slides: Slide[] = [
  {
    id: 1,
    subtitle: "Change the life, Change the world",
    title: "Every Good\nAct Is A Charity",
    description: "Supporting newcomers to Canada and those in need with essential services, dignity, and hope.",
    button1: { text: "how we help", link: "#about" },
    button2: { text: "support us", link: "#donate" },
  },
  {
    id: 2,
    subtitle: "Change the life, Change the world",
    title: "Building Stronger\nCommunities Together",
    description: "Together, we create stronger communities through compassion, support, and meaningful action.",
    button1: { text: "how we help", link: "#about" },
    button2: { text: "support us", link: "#donate" },
  },
  {
    id: 3,
    subtitle: "Change the life, Change the world",
    title: "Empowering Lives\nThrough Service",
    description: "Every contribution makes a difference in helping newcomers integrate and thrive in their new home.",
    button1: { text: "how we help", link: "#about" },
    button2: { text: "support us", link: "#donate" },
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-white">
      {/* Background gradient layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        
        {/* Heart Patterns */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {/* Large hearts */}
          <Heart className="absolute top-20 left-20 w-32 h-32 text-white/20 fill-white/10" />
          <Heart className="absolute top-40 right-32 w-24 h-24 text-white/20 fill-white/10" />
          <Heart className="absolute bottom-32 left-40 w-28 h-28 text-white/20 fill-white/10" />
          <Heart className="absolute bottom-20 right-20 w-36 h-36 text-white/20 fill-white/10" />
          
          {/* Medium hearts */}
          <Heart className="absolute top-1/4 left-1/3 w-16 h-16 text-white/15 fill-white/8" />
          <Heart className="absolute top-1/3 right-1/4 w-20 h-20 text-white/15 fill-white/8" />
          <Heart className="absolute bottom-1/4 left-1/4 w-18 h-18 text-white/15 fill-white/8" />
          <Heart className="absolute bottom-1/3 right-1/3 w-14 h-14 text-white/15 fill-white/8" />
          
          {/* Small hearts scattered */}
          <Heart className="absolute top-16 left-1/2 w-12 h-12 text-white/10 fill-white/5" />
          <Heart className="absolute top-1/2 left-16 w-10 h-10 text-white/10 fill-white/5" />
          <Heart className="absolute top-2/3 right-16 w-12 h-12 text-white/10 fill-white/5" />
          <Heart className="absolute bottom-16 right-1/2 w-10 h-10 text-white/10 fill-white/5" />
          <Heart className="absolute top-1/4 right-1/2 w-8 h-8 text-white/10 fill-white/5" />
          <Heart className="absolute bottom-1/4 left-1/2 w-8 h-8 text-white/10 fill-white/5" />
        </div>
      </div>

      <div className="relative">
        {/* Slider Container */}
        <div className="relative h-[600px] md:h-[700px] flex items-center">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative">
                <div className="grid md:grid-cols-2 gap-12 items-center justify-items-center w-full relative z-10">
                  {/* Text Content */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-4 text-accent">{slide.subtitle}</h3>
                    <div className="mb-6">
                      <h2 className="leading-tight whitespace-pre-line">
                        {slide.title}
                      </h2>
                    </div>
                    <div className="w-20 h-1 bg-accent mb-6"></div>
                    <p className="text-lg text-white/90 mb-8">{slide.description}</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={slide.button1.link}
                        className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-md hover:opacity-90 transition font-semibold text-lg"
                      >
                        <CheckCircle className="w-5 h-5" />
                        {slide.button1.text}
                      </Link>
                      <Link
                        href={slide.button2.link}
                        className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-md hover:bg-white/10 transition font-semibold text-lg"
                      >
                        <CheckCircle className="w-5 h-5" />
                        {slide.button2.text}
                      </Link>
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="relative w-full">
                      <div className="relative w-full h-[420px] md:h-[490px] rounded-3xl overflow-hidden opacity-90">
                        <img
                          src="/hero.png"
                          alt="TOMCARE Foundation - Partnership and Connection"
                          className="w-full h-full object-cover"
                        />
                        {/* Fade gradient overlays to blend with background */}
                        <div className="absolute inset-0 bg-gradient-to-l from-primary via-primary/50 to-transparent pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/30 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? "bg-accent w-8" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

