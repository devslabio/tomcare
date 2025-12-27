"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setTimeout(() => {
          setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
          setSubmitStatus("idle")
        }, 3000)
      } else {
        setSubmitStatus("error")
        setErrorMessage(data.message || "Failed to send message. Please try again.")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("An error occurred. Please try again later.")
      console.error("Contact form error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-muted py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4 text-foreground">Get In Touch</h1>
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you. Reach out to learn more about our programs or get support.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Phone */}
              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-foreground">Phone</h3>
                </div>
                <p className="text-muted-foreground mb-2">Tel</p>
                <a href="tel:4387733653" className="text-primary font-semibold hover:text-primary/80 transition">
                  4387733653
                </a>
              </div>

              {/* Email */}
              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-foreground">Email</h3>
                </div>
                <p className="text-muted-foreground mb-2">General Inquiries</p>
                <a
                  href="mailto:tomntambara@gmail.com"
                  className="text-primary font-semibold hover:text-primary/80 transition break-all"
                >
                  tomntambara@gmail.com
                </a>
              </div>

              {/* Address */}
              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-foreground">Location</h3>
                </div>
                <p className="text-muted-foreground">Quebec, Canada</p>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-foreground">Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Mon - Wed: 9:00 AM - 5:00 PM</p>
                  <p>Thu: 10:00 AM - 6:00 PM</p>
                  <p>Sat: 10:00 AM - 3:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-xl p-8 border border-border">
              <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Send us a Message</h2>

              {submitStatus === "success" ? (
                <div className="bg-accent/10 border border-accent rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-accent mx-auto mb-3" />
                  <h3 className="font-serif font-bold text-lg text-accent mb-2">Thank you!</h3>
                  <p className="text-muted-foreground">
                    We've received your message and will get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitStatus === "error" && (
                    <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-destructive">Error</h3>
                        <p className="text-sm text-destructive/80">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Subject</label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="">Select a subject</option>
                      <option value="program-inquiry">Program Inquiry</option>
                      <option value="volunteer-question">Volunteer Question</option>
                      <option value="donation">Donation Question</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
