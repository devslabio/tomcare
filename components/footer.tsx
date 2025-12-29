"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, Facebook, Instagram, Twitter, Linkedin, Send } from "lucide-react"

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
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand & Contact */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Image 
                  src="/logo.svg" 
                  alt="TOMCARE Foundation" 
                  width={200}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-primary-foreground/80 text-sm mb-4">
                TOMCARE FOUNDATION
              </p>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Legal representative: Tom Ntambara
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold">Tel:</h5>
                    <a href="tel:4387733653" className="hover:text-accent transition">
                      4387733653
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      <a href="mailto:tomntambara@gmail.com" className="hover:text-accent transition">
                        tomntambara@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Appeals */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Recent Appeals</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/search" className="hover:text-accent transition">
                    Newcomer Support
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-accent transition">
                    Housing Assistance
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-accent transition">
                    Employment Programs
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-accent transition">
                    Mental Health Support
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-accent transition">
                    Disability Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h3 className="font-semibold text-lg mb-4">About Us</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#about" className="hover:text-accent transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-accent transition">
                    Our Programs
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-accent transition">
                    Our History
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-accent transition">
                    Latest News
                  </Link>
                </li>
                <li>
                  <Link href="#volunteer" className="hover:text-accent transition">
                    Become Volunteer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Subscribe */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Subscribe</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">Be the first one to receive latest updates.</p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-2 rounded-md bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-primary-foreground/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/80">
              © 2025 <Link href="/" className="hover:text-accent transition">TOMCARE Foundation</Link>. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-primary-foreground/80 hover:text-accent transition">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-primary-foreground/80 hover:text-accent transition">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-primary-foreground/80 hover:text-accent transition">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-primary-foreground/80 hover:text-accent transition">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
