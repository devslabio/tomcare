"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { DonateButton } from "@/components/donate-button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

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
            <Link href="/action" className="text-foreground hover:text-primary transition">
              Our Action
            </Link>
            <Link href="/volunteer" className="text-foreground hover:text-primary transition">
              Be Volunteer
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
            <DonateButton />
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
            <Link href="/action" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition">
              Our Action
            </Link>
            <Link href="/volunteer" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition">
              Be Volunteer
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
            <div className="px-4 py-2">
              <DonateButton />
            </div>
          </div>
        )}
      </div>
    </nav>
    </header>
  )
}
