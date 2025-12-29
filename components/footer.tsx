"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, Send } from "lucide-react"

import { Input } from "@/components/ui/input"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription
    console.log("Subscribe:", email)
    setEmail("")
  }

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Dots Pattern Background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.8) 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0",
        }}
      />
      {/* Secondary dots pattern for depth */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
          backgroundPosition: "16px 16px",
        }}
      />
      
      {/* Main Footer */}
      <div className="py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand & Contact */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <Image 
                  src="/logo.svg" 
                  alt="TOMCARE Foundation" 
                  width={200}
                  height={40}
                  className="h-10 w-auto mb-4"
                />
                <p className="text-primary-foreground/70 text-xs">
                  Supporting newcomers to Canada and people in need
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Phone</p>
                    <a href="tel:+14387733653" className="text-sm text-primary-foreground/80 hover:text-accent transition block">
                      (438) 773-3653
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Email</p>
                    <a href="mailto:tomntambara@gmail.com" className="text-sm text-primary-foreground/80 hover:text-accent transition block break-all">
                      tomntambara@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-primary-foreground/80 hover:text-accent transition block">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="text-primary-foreground/80 hover:text-accent transition block">
                    Our Programs
                  </Link>
                </li>
                <li>
                  <Link href="/volunteer" className="text-primary-foreground/80 hover:text-accent transition block">
                    Volunteer
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-primary-foreground/80 hover:text-accent transition block">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-primary-foreground/80 hover:text-accent transition block">
                    News & Updates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Our Services */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Our Services</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/programs" className="text-primary-foreground/80 hover:text-accent transition block">
                    Newcomer Support
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="text-primary-foreground/80 hover:text-accent transition block">
                    Housing Assistance
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="text-primary-foreground/80 hover:text-accent transition block">
                    Employment Programs
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="text-primary-foreground/80 hover:text-accent transition block">
                    Mental Health Support
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="text-primary-foreground/80 hover:text-accent transition block">
                    Disability Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Subscribe */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Stay Connected</h3>
              <p className="text-sm text-primary-foreground/80 mb-6">
                Subscribe to receive updates about our programs and events.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-primary-foreground/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-primary-foreground/80 mb-1">
                © 2025 <Link href="/" className="hover:text-accent transition font-medium">TOMCARE Foundation</Link>. All rights reserved.
              </p>
              <p className="text-xs text-primary-foreground/60">
                Legal representative: Tom Ntambara
              </p>
            </div>
            {/* Social media links removed - add actual URLs when available */}
          </div>
        </div>
      </div>
    </footer>
  )
}
