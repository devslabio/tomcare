"use client"

import type React from "react"

import { useState } from "react"
import { Users, Clock, Heart, MapPin, Zap } from "lucide-react"

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    availability: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
    setShowForm(false)
  }

  return (
    <section id="volunteer" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Become a Volunteer</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Make a direct impact in your community. We offer flexible volunteer opportunities for people of all skills
            and backgrounds.
          </p>
        </div>

        {/* Volunteer Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border-2 border-primary/20 shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <Heart className="w-8 h-8 text-primary mb-4 group-hover:text-white transition-colors duration-300" />
            <h3 className="font-serif font-bold text-lg mb-2 text-foreground group-hover:text-white transition-colors duration-300">
              Make a Difference
            </h3>
            <p className="text-muted-foreground text-sm group-hover:text-white/90 transition-colors duration-300">
              Directly help newcomers and people in need achieve their goals and improve their lives.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border-2 border-primary/20 shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <Users className="w-8 h-8 text-primary mb-4 group-hover:text-white transition-colors duration-300" />
            <h3 className="font-serif font-bold text-lg mb-2 text-foreground group-hover:text-white transition-colors duration-300">
              Build Community
            </h3>
            <p className="text-muted-foreground text-sm group-hover:text-white/90 transition-colors duration-300">
              Connect with like-minded individuals and expand your network.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border-2 border-primary/20 shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <Zap className="w-8 h-8 text-primary mb-4 group-hover:text-white transition-colors duration-300" />
            <h3 className="font-serif font-bold text-lg mb-2 text-foreground group-hover:text-white transition-colors duration-300">
              Gain Experience
            </h3>
            <p className="text-muted-foreground text-sm group-hover:text-white/90 transition-colors duration-300">
              Develop new skills and gain valuable experience that benefits your career.
            </p>
          </div>
        </div>

        {/* Available Positions */}
        <h3 className="font-serif font-bold text-2xl mb-6 text-foreground">Available Volunteer Positions</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {volunteerPositions.map((position) => (
            <div
              key={position.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border-2 border-primary/20 shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <h4 className="font-serif font-bold text-lg mb-3 text-foreground group-hover:text-white transition-colors duration-300">
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
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold text-sm shadow-lg group-hover:bg-white group-hover:text-primary group-hover:shadow-xl"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* Volunteer Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif font-bold text-2xl mb-6 text-foreground">Volunteer Application Form</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about your relevant experience and skills..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Availability</label>
                  <textarea
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe your weekly availability..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition font-semibold"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-border text-foreground rounded-lg hover:bg-muted transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
