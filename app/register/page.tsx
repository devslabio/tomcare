"use client"
import { useState } from "react"
import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ChevronRight, CheckCircle } from "lucide-react"
import { sendEmail, formatFormDataForEmail, createFormattedMessage } from "@/lib/emailjs"
import { ErrorMessage } from "@/components/ui/error-message"
import { LoadingButton } from "@/components/ui/loading-button"
import type { RegistrationType, RegistrationFormData, FormStatus } from "@/types/forms"

export default function RegisterPage() {
  const [formType, setFormType] = useState<RegistrationType | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState<RegistrationFormData>({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    numberOfDependents: "",

    // Contact Info
    address: "",
    city: "",
    province: "",
    postalCode: "",

    // Situation Details
    situation: "", // For recipients
    needsAssistance: [] as string[],
    arrivalDate: "", // For newcomers
    skills: "", // For volunteers
    experience: "",

    // Language
    language: "",
    needsInterpreter: false,

    // Consent
    agreedToTerms: false,
  })

  const needsOptions = [
    "Employment Support",
    "Housing Assistance",
    "Language Training",
    "Digital Skills",
    "Mental Health Support",
    "Disability Services",
    "Food & Essentials",
    "Legal Guidance",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      // Handle agreedToTerms checkbox separately
      if (name === "agreedToTerms") {
        setFormData((prev) => ({
          ...prev,
          agreedToTerms: checked,
        }))
      } else {
        // Handle needsAssistance checkboxes
        setFormData((prev) => ({
          ...prev,
          needsAssistance: checked
            ? [...prev.needsAssistance, value]
            : prev.needsAssistance.filter((item) => item !== value),
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const formTypeLabel = formType === "recipient" ? "Recipient Registration" : "Applicant Registration"
      // Format form data for email template
      const emailParams = formatFormDataForEmail({
        ...formData,
        form_type: formTypeLabel,
        registration_type: formType || "",
        timestamp: new Date().toLocaleString(),
        formatted_message: createFormattedMessage({ ...formData, form_type: formTypeLabel, registration_type: formType || "" }, formTypeLabel),
      })

      // Send email via EmailJS (auto-reply handled by EmailJS template Linked Template feature)
      const result = await sendEmail("register", emailParams)

      if (result.success) {
        setSubmitStatus("success")
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            gender: "",
            maritalStatus: "",
            numberOfDependents: "",
            address: "",
            city: "",
            province: "",
            postalCode: "",
            situation: "",
            needsAssistance: [],
            arrivalDate: "",
            skills: "",
            experience: "",
            language: "",
            needsInterpreter: false,
            agreedToTerms: false,
          })
          setFormType(null)
          setCurrentStep(1)
          setSubmitStatus("idle")
        }, 3000)
      } else {
        setSubmitStatus("error")
        setErrorMessage(result.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("An error occurred. Please try again later.")
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formType) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-muted py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-serif font-bold mb-4 text-foreground">Register With TOMCARE</h1>
              <p className="text-lg text-muted-foreground">
                Choose how you'd like to join our community and get support
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Recipient Registration */}
              <button
                onClick={() => {
                  setFormType("recipient")
                  setCurrentStep(1)
                }}
                className="bg-white rounded-xl p-8 border-2 border-border hover:border-primary transition text-left group"
              >
                <div className="mb-4 text-4xl">🤝</div>
                <h2 className="text-2xl font-serif font-bold mb-3 text-foreground group-hover:text-primary transition">
                  Apply for Assistance
                </h2>
                <p className="text-muted-foreground mb-6">
                  If you're a newcomer, have a disability, or are facing challenges, register to access TOMCARE's
                  services.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  Get Started
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>

              {/* Volunteer Registration */}
              <button
                onClick={() => {
                  setFormType("applicant")
                  setCurrentStep(1)
                }}
                className="bg-white rounded-xl p-8 border-2 border-border hover:border-accent transition text-left group"
              >
                <div className="mb-4 text-4xl">❤️</div>
                <h2 className="text-2xl font-serif font-bold mb-3 text-foreground group-hover:text-accent transition">
                  Become a Volunteer
                </h2>
                <p className="text-muted-foreground mb-6">
                  Have a few hours to spare? Join our volunteer team and make a direct impact in your community.
                </p>
                <div className="flex items-center gap-2 text-accent font-semibold">
                  Join Us
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const isRecipient = formType === "recipient"
  const totalSteps = 3

  if (submitStatus === "success") {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-muted flex items-center justify-center py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold mb-2 text-foreground">
                {isRecipient ? "Registration Successful!" : "Application Submitted!"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isRecipient
                  ? "Thank you for registering. We will contact you soon to discuss how we can support you."
                  : "Thank you for applying. We will review your application and get back to you within a few days."}
              </p>
              <p className="text-sm text-muted-foreground">Redirecting...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-muted py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-serif font-bold text-foreground">
                {isRecipient ? "Recipient Registration" : "Volunteer Application"}
              </h1>
              <button
                onClick={() => setFormType(null)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                ← Back
              </button>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full transition ${step <= currentStep ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          {submitStatus === "error" && (
            <div className="mb-6">
              <ErrorMessage message={errorMessage} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-foreground">Personal Information</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Preferred Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select</option>
                    <option value="english">English</option>
                    <option value="french">French</option>
                    <option value="spanish">Spanish</option>
                    <option value="arabic">Arabic</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Address & Details */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {isRecipient ? "Address & Situation" : "Contact Information"}
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Province</label>
                    <input
                      type="text"
                      name="province"
                      required
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {isRecipient && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        How can we help you? (Select all that apply)
                      </label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {needsOptions.map((need) => (
                          <label
                            key={need}
                            className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              name="needsAssistance"
                              value={need}
                              checked={formData.needsAssistance.includes(need)}
                              onChange={handleInputChange}
                              className="w-4 h-4"
                            />
                            <span className="text-foreground">{need}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Tell us your story</label>
                      <textarea
                        name="situation"
                        rows={4}
                        value={formData.situation}
                        onChange={handleInputChange}
                        placeholder="Please describe your situation and what you're looking for help with..."
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </>
                )}

                {!isRecipient && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Relevant Skills & Experience
                    </label>
                    <textarea
                      name="experience"
                      rows={4}
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Tell us about your skills, experience, and why you want to volunteer..."
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="bg-white rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-foreground">Review & Confirm</h2>

                <div className="bg-muted rounded-lg p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Name</p>
                      <p className="text-foreground font-semibold">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Email</p>
                      <p className="text-foreground font-semibold">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Phone</p>
                      <p className="text-foreground font-semibold">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Location</p>
                      <p className="text-foreground font-semibold">
                        {formData.city}, {formData.province}
                      </p>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-1 flex-shrink-0"
                  />
                  <span className="text-sm text-foreground">
                    I agree to TOMCARE Foundation's terms of service and privacy policy. I understand my information
                    will be used to provide services and support.
                  </span>
                </label>

                {!formData.agreedToTerms && (
                  <p className="text-sm text-destructive">You must agree to the terms to proceed</p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className={`px-6 py-3 border-2 border-border text-foreground rounded-lg hover:bg-muted transition font-semibold ${
                  currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentStep === 1 || isSubmitting}
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Submitting..."
                  disabled={!formData.agreedToTerms || isSubmitting}
                  variant="default"
                >
                  Complete Registration
                </LoadingButton>
              )}
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
