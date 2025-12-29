"use client"
import { useState } from "react"
import type React from "react"
import { Users, Clock, Heart, MapPin, Zap } from "lucide-react"
import { sendEmail, formatFormDataForEmail, createFormattedMessage } from "@/lib/emailjs"
import { ErrorMessage } from "@/components/ui/error-message"
import { SuccessMessage } from "@/components/ui/success-message"
import { LoadingButton } from "@/components/ui/loading-button"
import { Button } from "@/components/ui/button"
import type { VolunteerFormData, FormStatus } from "@/types/forms"

interface VolunteerPosition {
  id: string
  title: string
  description: string
  commitment: string
  skills: string[]
  location: string
  impact: string
}

const volunteerPositions: VolunteerPosition[] = [
  {
    id: "mentor",
    title: "Settlement Mentor",
    description:
      "Guide newcomers through the settlement process, share local knowledge, and provide cultural orientation.",
    commitment: "4-6 hours/week",
    skills: ["Communication", "Patience", "Local Knowledge"],
    location: "Montreal, Quebec",
    impact: "Help 1-3 families settle successfully",
  },
  {
    id: "translator",
    title: "Language Volunteer",
    description:
      "Assist with translation, language practice, and communication support for non-English/French speakers.",
    commitment: "3-5 hours/week",
    skills: ["Bilingual", "Teaching", "Communication"],
    location: "Various Locations",
    impact: "Enable language learning for 5-10 people",
  },
  {
    id: "job-coach",
    title: "Job Search Coach",
    description: "Help newcomers prepare resumes, practice interviews, and navigate the job market.",
    commitment: "5-8 hours/week",
    skills: ["HR Knowledge", "Interview Skills", "Career Guidance"],
    location: "Montreal, Quebec",
    impact: "Support job placement for 3-5 individuals",
  },
  {
    id: "tech-trainer",
    title: "IT Skills Trainer",
    description: "Teach digital literacy, computer basics, and online platform navigation.",
    commitment: "4-6 hours/week",
    skills: ["IT Knowledge", "Teaching", "Patience"],
    location: "In-Person/Online",
    impact: "Train 10-15 people in digital skills",
  },
  {
    id: "event-organizer",
    title: "Community Event Organizer",
    description: "Help plan and organize community events, social activities, and cultural celebrations.",
    commitment: "3-4 hours/week",
    skills: ["Organization", "Leadership", "Creativity"],
    location: "Montreal, Quebec",
    impact: "Build community for 50+ people per event",
  },
  {
    id: "advocate",
    title: "Advocacy Volunteer",
    description: "Raise awareness about our mission, share stories, and help with outreach initiatives.",
    commitment: "2-4 hours/week",
    skills: ["Social Media", "Writing", "Networking"],
    location: "Flexible/Remote",
    impact: "Reach thousands through advocacy work",
  },
]

export function VolunteerSection() {
  const [showForm, setShowForm] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState<VolunteerFormData>({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    availability: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const formType = "Volunteer Application"
      
      // Create formatted message first
      const formattedMsg = createFormattedMessage({ ...formData, form_type: formType }, formType)
      
      console.log("📝 Volunteer form data:", formData)
      console.log("📝 Formatted message:", formattedMsg)
      
      // Format form data for email template - include both formatted_message and individual fields
      const emailParams = formatFormDataForEmail({
        ...formData,
        form_type: formType,
        timestamp: new Date().toLocaleString(),
        formatted_message: formattedMsg,
        // Also include individual fields as fallback for templates that don't use formatted_message
        message: formattedMsg, // Some templates might use {{message}}
        reply_message: formattedMsg, // Some templates might use {{reply_message}}
      })

      console.log("📧 Email params being sent:", emailParams)

      // Send email via EmailJS (auto-reply handled by EmailJS template Linked Template feature)
      const result = await sendEmail("volunteer", emailParams)

      if (result.success) {
        setSubmitStatus("success")
        setTimeout(() => {
          setFormData({ name: "", email: "", phone: "", position: "", experience: "", availability: "" })
          setShowForm(false)
          setSubmitStatus("idle")
        }, 3000)
      } else {
        setSubmitStatus("error")
        setErrorMessage(result.message || "Failed to submit application. Please try again.")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("An error occurred. Please try again later.")
      console.error("Volunteer form error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="volunteer" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4">Become a Volunteer</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Make a direct impact in your community. We offer flexible volunteer opportunities for people of all skills
            and backgrounds.
          </p>
        </div>

        {/* Volunteer Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md rounded-md p-6 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 group">
            <Heart className="w-8 h-8 text-primary mb-4 group-hover:text-white transition-colors duration-200" />
            <h3 className="mb-2 group-hover:text-white transition-colors duration-200">
              Make a Difference
            </h3>
            <p className="text-muted-foreground text-sm group-hover:text-white/90 transition-colors duration-200">
              Directly help newcomers and people in need achieve their goals and improve their lives.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-md p-6 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 group">
            <Users className="w-8 h-8 text-primary mb-4 group-hover:text-white transition-colors duration-200" />
            <h3 className="mb-2 group-hover:text-white transition-colors duration-200">
              Build Community
            </h3>
            <p className="text-muted-foreground text-sm group-hover:text-white/90 transition-colors duration-200">
              Connect with like-minded individuals and expand your network.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-md p-6 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 group">
            <Zap className="w-8 h-8 text-primary mb-4 group-hover:text-white transition-colors duration-200" />
            <h3 className="font-serif font-bold text-lg mb-2 text-foreground group-hover:text-white transition-colors duration-300">
              Gain Experience
            </h3>
            <p className="text-muted-foreground text-sm group-hover:text-white/90 transition-colors duration-200">
              Develop new skills and gain valuable experience that benefits your career.
            </p>
          </div>
        </div>

        {/* Available Positions */}
        <h3 className="mb-6">Available Volunteer Positions</h3>
        <div className="grid md:grid-cols-2 gap-8 mb-8 items-stretch">
          {volunteerPositions.map((position) => (
            <div
              key={position.id}
              className="bg-white/80 backdrop-blur-md rounded-md p-6 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 group"
            >
              <h4 className="mb-3 group-hover:text-white transition-colors duration-300">
                {position.title}
              </h4>
              <p className="text-sm mb-4 leading-relaxed text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                {position.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0 group-hover:text-white transition-colors duration-300" />
                  <span>{position.commitment}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 group-hover:text-white transition-colors duration-300" />
                  <span>{position.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                  <Heart className="w-4 h-4 text-primary flex-shrink-0 group-hover:text-white transition-colors duration-300" />
                  <span>{position.impact}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-foreground mb-2 group-hover:text-white transition-colors duration-300">
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {position.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-primary/10 text-primary border border-primary/30 px-2 py-1 rounded group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPosition(position.id)
                  setShowForm(true)
                  setFormData((prev) => ({ ...prev, position: position.title }))
                }}
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition font-semibold text-sm group-hover:bg-white group-hover:text-primary"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* Volunteer Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-md p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="mb-6">Volunteer Application Form</h3>

              {submitStatus === "success" ? (
                <div className="text-center">
                  <SuccessMessage
                    title="Thank you!"
                    message="Your application has been submitted successfully. We'll get back to you soon."
                  />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitStatus === "error" && <ErrorMessage message={errorMessage} />}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="">Select a position</option>
                      {volunteerPositions.map((pos) => (
                        <option key={pos.id} value={pos.title}>
                          {pos.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Relevant Experience</label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      placeholder="Tell us about your relevant experience and skills..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Availability</label>
                    <textarea
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      rows={2}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      placeholder="Describe your weekly availability..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <LoadingButton
                      type="submit"
                      isLoading={isSubmitting}
                      loadingText="Submitting..."
                      className="flex-1"
                      variant="default"
                    >
                      Submit Application
                    </LoadingButton>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setSubmitStatus("idle")
                        setErrorMessage("")
                      }}
                      disabled={isSubmitting}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
