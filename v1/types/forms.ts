/**
 * Shared TypeScript types for forms across the application
 */

// Form submission status
export type FormStatus = "idle" | "success" | "error"

// Registration types
export type RegistrationType = "recipient" | "applicant"

// Contact Form Data
export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

// Volunteer Application Form Data
export interface VolunteerFormData {
  name: string
  email: string
  phone: string
  position: string
  experience: string
  availability: string
}

// Registration Form Data (used for both recipient and applicant)
export interface RegistrationFormData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  maritalStatus: string
  numberOfDependents: string

  // Contact Info
  address: string
  city: string
  province: string
  postalCode: string

  // Situation Details
  situation: string // For recipients
  needsAssistance: string[]
  arrivalDate: string // For newcomers
  skills: string // For volunteers
  experience: string

  // Language
  language: string
  needsInterpreter: boolean

  // Consent
  agreedToTerms: boolean
}

// Form submission result
export interface FormSubmissionResult {
  success: boolean
  message?: string
}

// EmailJS template types
export type EmailJSTemplate = "contact" | "volunteer" | "register" | "donate"

