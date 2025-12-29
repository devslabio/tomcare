"use client"
import { useState } from "react"
import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { sendEmail, formatFormDataForEmail, createFormattedMessage } from "@/lib/emailjs"
import { ErrorMessage } from "@/components/ui/error-message"
import { SuccessMessage } from "@/components/ui/success-message"
import { LoadingButton } from "@/components/ui/loading-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ContactFormData, FormStatus } from "@/types/forms"

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const formType = "Contact Form"
      // Format form data for email template
      const emailParams = formatFormDataForEmail({
        ...formData,
        form_type: formType,
        timestamp: new Date().toLocaleString(),
        formatted_message: createFormattedMessage({ ...formData, form_type: formType }, formType),
      })

      // Send email via EmailJS (auto-reply handled by EmailJS template Linked Template feature)
      const result = await sendEmail("contact", emailParams)

      if (result.success) {
        setSubmitStatus("success")
        setTimeout(() => {
          setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
          setSubmitStatus("idle")
        }, 3000)
      } else {
        setSubmitStatus("error")
        setErrorMessage(result.message || "Failed to send message. Please try again.")
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
              <div className="bg-white rounded-lg p-6 border border-border">
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
              <div className="bg-white rounded-lg p-6 border border-border">
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
              <div className="bg-white rounded-lg p-6 border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-foreground">Location</h3>
                </div>
                <p className="text-muted-foreground">Quebec, Canada</p>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-lg p-6 border border-border">
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
            <div className="lg:col-span-2 bg-white rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Send us a Message</h2>

              {submitStatus === "success" ? (
                <div className="text-center">
                  <SuccessMessage
                    title="Thank you!"
                    message="We've received your message and will get back to you as soon as possible."
                  />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitStatus === "error" && <ErrorMessage message={errorMessage} />}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="mt-2"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <LoadingButton
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    className="w-full"
                    variant="default"
                  >
                    Send Message
                  </LoadingButton>
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
