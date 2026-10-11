"use client"

import Link from "next/link"
import { ArrowRight, Heart } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-white section-padding">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6 text-accent">
              <Heart className="w-5 h-5 fill-accent" />
              <span className="font-medium">TOMCARE Foundation</span>
            </div>

            <h1 className="mb-6 text-balance">
              Change Lives, Build Community
            </h1>

            <p className="text-lg text-white/90 mb-8">
              Supporting newcomers to Canada and those in need with essential services, dignity, and hope. Together, we
              create stronger communities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/programs#donate"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-md hover:opacity-90 transition-colors duration-200 font-semibold text-lg"
              >
                Donate Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-md hover:bg-white/10 transition-colors duration-200 font-semibold text-lg"
              >
                Become a Volunteer
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-accent">173+</div>
                <p className="text-white/80 text-sm">Newcomers Helped</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">20+</div>
                <p className="text-white/80 text-sm">Services Provided</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">100%</div>
                <p className="text-white/80 text-sm">Community Driven</p>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="bg-white/10 backdrop-blur rounded-md p-8 space-y-4">
              <div className="bg-accent/20 h-64 rounded-md flex items-center justify-center text-accent">
                <div className="text-center">
                  <Heart className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-serif font-bold text-lg">Building Hope Together</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
