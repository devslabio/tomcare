"use client"

import { DollarSign, Briefcase, Users, Award } from "lucide-react"
import { useEffect, useState } from "react"

interface Counter {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
}

const counters: Counter[] = [
  {
    icon: <Users className="w-8 h-8" />,
    value: 173,
    suffix: "",
    label: "New Immigrants Welcomed\nIn 2024",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    value: 2.64,
    suffix: "K",
    label: "Different Projects Done With\nThe Help Of Donators",
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: 13.7,
    suffix: "K",
    label: "With Our Volunteers We've\nSolved Many Causes",
  },
  {
    icon: <Award className="w-8 h-8" />,
    value: 1.5,
    suffix: "K",
    label: "A Team consisting Of The\nBest Volunteers",
  },
]

export function FactCounterSection() {
  const [counts, setCounts] = useState(counters.map(() => 0))
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            counters.forEach((counter, index) => {
              const duration = 2000
              const steps = 60
              const increment = counter.value / steps
              let current = 0

              const timer = setInterval(() => {
                current += increment
                if (current >= counter.value) {
                  current = counter.value
                  clearInterval(timer)
                }
                setCounts((prev) => {
                  const newCounts = [...prev]
                  newCounts[index] = Math.min(current, counter.value)
                  return newCounts
                })
              }, duration / steps)
            })
          }
        })
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById("fact-counter")
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [hasAnimated])

  return (
    <section
      id="fact-counter"
      className="section-padding bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Counters Grid - Left Side (7 columns equivalent) */}
          <div className="grid grid-cols-2 gap-8 items-stretch">
            {counters.map((counter, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-md p-6 text-center border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 group"
              >
                <div className="flex justify-center mb-4 text-primary group-hover:text-white transition-colors duration-300">
                  {counter.icon}
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary group-hover:text-white transition-colors duration-300">
                    {counts[index].toFixed(counter.value < 1 ? 1 : 0)}
                  </span>
                  <span className="text-2xl font-bold text-primary group-hover:text-white transition-colors duration-300">
                    {counter.suffix}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {counter.label}
                </p>
              </div>
            ))}
          </div>

          {/* Video Box - Right Side (5 columns equivalent) */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-md flex items-center justify-center border-4 border-primary/30">
                <button className="group">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-10 h-10 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="mt-4 text-center">
                    <h5 className="font-serif font-bold text-lg text-foreground">Watch The Intro Video</h5>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

