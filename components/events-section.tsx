"use client"

import Link from "next/link"
import { useState } from "react"
import { Clock, Calendar } from "lucide-react"

interface Event {
  id: string
  title: string
  date: { day: number; month: string }
  time: string
  location: string
  organizer: string
}

const events: Event[] = [
  {
    id: "1",
    title: "Community Integration Workshop: Supporting Newcomers",
    date: { day: 25, month: "MAR" },
    time: "16:00 EST",
    location: "Montreal, Canada",
    organizer: "TOMCARE Foundation",
  },
  {
    id: "2",
    title: "Digital Literacy Training Session",
    date: { day: 17, month: "APR" },
    time: "15:00 EST",
    location: "Montreal, Canada",
    organizer: "TOMCARE Foundation",
  },
  {
    id: "3",
    title: "Employment Support & Job Fair",
    date: { day: 10, month: "MAY" },
    time: "14:00 EST",
    location: "Montreal, Canada",
    organizer: "TOMCARE Foundation",
  },
  {
    id: "4",
    title: "Mental Health Awareness & Support Group",
    date: { day: 5, month: "JUN" },
    time: "18:00 EST",
    location: "Montreal, Canada",
    organizer: "TOMCARE Foundation",
  },
]

export function EventsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length)
  }

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length)
  }

  return (
    <section className="section-padding bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Box */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center border-2 border-white/20">
              <Calendar className="w-32 h-32 text-white/30" />
            </div>
          </div>

          {/* Content Box */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary mb-2">Help With Featured Cause</h3>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                Join Upcoming Events<br />Replays & Webinars
              </h2>
            </div>

            {/* Event Carousel */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-md p-6 border-2 border-white/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-white text-primary rounded-md p-4 text-center min-w-[80px]">
                    <div className="text-3xl font-bold">{events[currentIndex].date.day}</div>
                    <div className="text-sm font-semibold">{events[currentIndex].date.month}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/80 mb-2">
                      Organized By: <span className="font-semibold text-white">{events[currentIndex].organizer}</span>
                    </p>
                    <h3 className="font-serif font-bold text-xl mb-3 text-white">{events[currentIndex].title}</h3>
                    <div className="flex items-center gap-2 text-white/90">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{events[currentIndex].time} - {events[currentIndex].location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={prevEvent}
                  className="px-4 py-2 bg-white text-primary rounded-md hover:bg-white/90 transition-colors duration-200 font-semibold"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {events.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentIndex ? "bg-white w-8" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextEvent}
                  className="px-4 py-2 bg-white text-primary rounded-md hover:bg-white/90 transition-colors duration-200 font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

