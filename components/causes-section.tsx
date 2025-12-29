"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Play, Heart } from "lucide-react"

interface Cause {
  id: string
  title: string
  description: string
  image: string
  target: number
  achieved: number
  percentage: number
}

const featuredCause: Cause = {
  id: "featured",
  title: "Support Newcomers Integration",
  description:
    "Help newcomers to Canada integrate successfully by providing essential services, language training, and community support. Your donation directly impacts families starting their new lives.",
  image: "/placeholder.jpg",
  target: 10000,
  achieved: 6500,
  percentage: 65,
}

const causes: Cause[] = [
  {
    id: "1",
    title: "Education For People",
    description: "Support educational programs for newcomers and underserved communities to build better futures.",
    image: "/placeholder.jpg",
    target: 5000,
    achieved: 2500,
    percentage: 50,
  },
  {
    id: "2",
    title: "Housing Assistance",
    description: "Help provide safe and affordable housing for newcomers and families in need.",
    image: "/placeholder.jpg",
    target: 8000,
    achieved: 5760,
    percentage: 72,
  },
  {
    id: "3",
    title: "Employment Support",
    description: "Fund job training programs and employment assistance for newcomers.",
    image: "/placeholder.jpg",
    target: 6000,
    achieved: 3600,
    percentage: 60,
  },
  {
    id: "4",
    title: "Mental Health Support",
    description: "Provide counseling and mental health services for those facing challenges.",
    image: "/placeholder.jpg",
    target: 7000,
    achieved: 4200,
    percentage: 60,
  },
]

export function CausesSection() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(featuredCause.percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Featured Cause Section */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Box */}
            <div className="relative">
              <div className="bg-white rounded-md p-4 border border-border">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 rounded-md flex items-center justify-center">
                  <Heart className="w-24 h-24 text-primary/30" />
                </div>
              </div>
            </div>

            {/* Content Box */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white/90 mb-2">Help With Featured Cause</h3>
                <h2 className="text-white mb-4">
                  Support Newcomers<br />Integration Program
                </h2>
              </div>

              <p className="text-white/90 mb-8 leading-relaxed">{featuredCause.description}</p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-white">Target: ${featuredCause.target.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-white">{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-white/80 mt-2">Pledged So Far</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#donate"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-md hover:bg-white/90 transition-colors duration-200 font-semibold"
                >
                  <Heart className="w-5 h-5" />
                  Donate Now
                </Link>
                <button className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-md hover:bg-white/10 transition font-semibold">
                  <Play className="w-5 h-5" />
                  Watch Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

