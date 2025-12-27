"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, ChevronDown, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Sponsor an orphan and feed the poor people with us</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link href="#" className="hover:text-accent transition">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="hover:text-accent transition">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="hover:text-accent transition">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="hover:text-accent transition">
                <Instagram className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="TOMCARE Foundation" 
              width={200}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-foreground hover:text-primary transition">
              About Us
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 text-foreground hover:text-primary transition">
                Programs
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <Link href="/programs" className="block px-4 py-2 hover:bg-muted text-foreground">
                  Our Programs
                </Link>
                <Link href="/search" className="block px-4 py-2 hover:bg-muted text-foreground">
                  Search Programs
                </Link>
                <Link href="/programs#donate" className="block px-4 py-2 hover:bg-muted text-foreground">
                  General Donation
                </Link>
                <Link href="/programs#donate" className="block px-4 py-2 hover:bg-muted text-foreground">
                  Donate a Car
                </Link>
              </div>
            </div>
            <Link href="/team" className="text-foreground hover:text-primary transition">
              Team
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition">
              Contact
            </Link>
            <Link
              href="/register"
              className="bg-accent text-accent-foreground px-6 py-2 rounded-lg hover:opacity-90 transition font-medium"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/about" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition">
              About Us
            </Link>
            <button
              onClick={() => setOpenDropdown(openDropdown === "programs" ? null : "programs")}
              className="w-full text-left px-4 py-2 flex items-center justify-between text-foreground hover:bg-muted rounded transition"
            >
              Programs
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openDropdown === "programs" ? "rotate-180" : ""}`}
              />
            </button>
            {openDropdown === "programs" && (
              <div className="pl-4 space-y-1">
                <Link href="/programs" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                  Our Programs
                </Link>
                <Link href="/search" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                  Search Programs
                </Link>
                <Link href="/programs#donate" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                  General Donation
                </Link>
                <Link href="/programs#donate" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                  Donate a Car
                </Link>
              </div>
            )}
            <Link href="/team" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition">
              Team
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition">
              Contact
            </Link>
            <Link
              href="/register"
              className="block px-4 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition font-medium"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
    </header>
  )
}
