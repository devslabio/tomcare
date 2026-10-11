import emailjs from "@emailjs/browser"

// Initialize EmailJS with public key
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "T0pFpR16bzX1qUc5n"
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_77uejgm"

// Template IDs - these need to be created in EmailJS dashboard
const TEMPLATE_IDS = {
  contact: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || "template_contact",
  volunteer: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VOLUNTEER || "template_volunteer",
  register: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTER || "template_register",
  donate: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_DONATE || "template_donate",
}

// Initialize EmailJS - will be initialized when sendEmail is called

export interface EmailJSResult {
  success: boolean
  message?: string
}

/**
 * Send email via EmailJS with auto-reply
 */
export async function sendEmail(
  templateId: keyof typeof TEMPLATE_IDS,
  templateParams: Record<string, string | number | boolean>
): Promise<EmailJSResult> {
  try {
    if (typeof window === "undefined") {
      return { success: false, message: "EmailJS can only be used in the browser" }
    }

    // Initialize EmailJS with public key
    emailjs.init(PUBLIC_KEY)

    const actualTemplateId = TEMPLATE_IDS[templateId]
    
    // Check if template ID is still a placeholder (check for both formats)
    const isPlaceholder = 
      actualTemplateId === `template_${templateId}` || 
      actualTemplateId === templateId ||
      actualTemplateId === "template_contact" ||
      actualTemplateId === "template_volunteer" ||
      actualTemplateId === "template_register" ||
      actualTemplateId === "template_donate"
    
    if (isPlaceholder) {
      console.error("❌ EmailJS Template ID not configured:", {
        templateType: templateId,
        templateId: actualTemplateId,
        serviceId: SERVICE_ID,
        publicKey: PUBLIC_KEY ? "Set" : "Missing",
      })
      return {
        success: false,
        message: `Email template not configured. Please set NEXT_PUBLIC_EMAILJS_TEMPLATE_${templateId.toUpperCase()} in .env.local with your actual template ID from EmailJS dashboard. See docs/QUICK_EMAILJS_SETUP.md for instructions.`,
      }
    }

    // Remove to_email from admin notification to ensure it goes to admin email (not sender)
    // Admin email is set in EmailJS service settings
    const adminNotificationParams = { ...templateParams }
    delete adminNotificationParams.to_email // Don't override - use admin email from service settings

    console.log("📧 Sending admin notification via EmailJS:", {
      serviceId: SERVICE_ID,
      templateId: actualTemplateId,
      templateType: templateId,
      paramsCount: Object.keys(adminNotificationParams).length,
      note: "Email will be sent to admin email configured in EmailJS service",
    })
    console.log("📧 Email parameters preview:", {
      formatted_message_length: adminNotificationParams.formatted_message?.length || 0,
      formatted_message_preview: adminNotificationParams.formatted_message?.substring(0, 150) || "MISSING",
      name: adminNotificationParams.name || "MISSING",
      email: adminNotificationParams.email || "MISSING",
    })

    const response = await emailjs.send(SERVICE_ID, actualTemplateId, adminNotificationParams)

    console.log("✅ EmailJS response:", {
      status: response.status,
      text: response.text,
    })

    if (response.status === 200) {
      // Auto-reply is now handled by EmailJS template's "Linked Template" feature
      // No need to send auto-reply programmatically
      return { success: true, message: "Email sent successfully" }
    } else {
      return { 
        success: false, 
        message: `Failed to send email. Status: ${response.status}` 
      }
    }
  } catch (error: any) {
    console.error("❌ EmailJS error:", error)
    console.error("❌ Error details:", {
      status: error?.status,
      text: error?.text,
      message: error?.message,
      serviceId: SERVICE_ID,
      templateId: actualTemplateId,
      publicKey: PUBLIC_KEY ? "Set" : "Missing",
    })
    
    // Provide more specific error messages
    let errorMessage = "Failed to send email. Please try again."
    let detailedError = ""
    
    if (error?.text) {
      errorMessage = error.text
      detailedError = error.text
    } else if (error?.message) {
      errorMessage = error.message
      detailedError = error.message
    } else if (typeof error === "string") {
      errorMessage = error
      detailedError = error
    }

    // Log the full error for debugging
    if (error?.status) {
      detailedError = `Status: ${error.status}, ${detailedError}`
    }

    // Common error patterns with more specific messages
    if (errorMessage.includes("Invalid template ID") || errorMessage.includes("template") || errorMessage.includes("Template")) {
      errorMessage = `Email template not found. Template ID: ${actualTemplateId}. Please verify the template ID in your EmailJS dashboard matches this exactly.`
    } else if (errorMessage.includes("Invalid service ID") || errorMessage.includes("service") || errorMessage.includes("Service")) {
      errorMessage = `Email service not found. Service ID: ${SERVICE_ID}. Please check your service ID in .env.local`
    } else if (errorMessage.includes("Invalid public key") || errorMessage.includes("key") || errorMessage.includes("Key")) {
      errorMessage = `Invalid EmailJS public key. Please check your public key in .env.local`
    }

    return {
      success: false,
      message: errorMessage,
    }
  }
}

/**
 * Format form data for email templates
 */
export function formatFormDataForEmail(data: Record<string, any>): Record<string, string> {
  const formatted: Record<string, string> = {}

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      formatted[key] = ""
    } else if (typeof value === "boolean") {
      formatted[key] = value ? "Yes" : "No"
    } else if (Array.isArray(value)) {
      formatted[key] = value.join(", ")
    } else {
      formatted[key] = String(value)
    }
  }

  return formatted
}

/**
 * Create a well-formatted message from all form fields
 * Returns a professional, readable format with all form data
 */
export function createFormattedMessage(data: Record<string, any>, formType: string): string {
  const sections: string[] = []
  
  // Professional Header
  sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  sections.push(`  ${formType.toUpperCase()}`)
  sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  sections.push("")
  sections.push(`📅 Submitted: ${new Date().toLocaleString()}`)
  sections.push("")

  // Always include at least basic info to prevent empty messages
  let hasContent = false

  // Personal Information - Always check for name, email, phone first
  const hasPersonalInfo = data.firstName || data.lastName || data.name || data.email || data.phone
  if (hasPersonalInfo) {
    sections.push("👤 PERSONAL INFORMATION")
    sections.push("────────────────────────────────────────")
    if (data.name) { sections.push(`   Name: ${data.name}`); hasContent = true }
    if (data.firstName) { sections.push(`   First Name: ${data.firstName}`); hasContent = true }
    if (data.lastName) { sections.push(`   Last Name: ${data.lastName}`); hasContent = true }
    if (data.email) { sections.push(`   📧 Email: ${data.email}`); hasContent = true }
    if (data.phone) { sections.push(`   📞 Phone: ${data.phone || "Not provided"}`); hasContent = true }
    if (data.dateOfBirth) { sections.push(`   🎂 Date of Birth: ${data.dateOfBirth}`); hasContent = true }
    if (data.gender) { sections.push(`   Gender: ${data.gender}`); hasContent = true }
    if (data.maritalStatus) { sections.push(`   Marital Status: ${data.maritalStatus}`); hasContent = true }
    if (data.numberOfDependents) { sections.push(`   Number of Dependents: ${data.numberOfDependents}`); hasContent = true }
    sections.push("")
  }

  // Contact Information
  if (data.address || data.city || data.province || data.postalCode) {
    sections.push("📍 CONTACT INFORMATION")
    sections.push("────────────────────────────────────────")
    if (data.address) sections.push(`   Address: ${data.address}`)
    if (data.city) sections.push(`   City: ${data.city}`)
    if (data.province) sections.push(`   Province: ${data.province}`)
    if (data.postalCode) sections.push(`   Postal Code: ${data.postalCode}`)
    sections.push("")
  }

  // Form-Specific Information
  if (formType.includes("Contact")) {
    sections.push("💬 MESSAGE DETAILS")
    sections.push("────────────────────────────────────────")
    if (data.subject) { sections.push(`   Subject: ${data.subject}`); hasContent = true }
    if (data.message) {
      sections.push(`   Message:`)
      sections.push("")
      // Indent message content for better readability
      const messageLines = data.message.split('\n')
      messageLines.forEach(line => {
        sections.push(`   ${line}`)
      })
      sections.push("")
      hasContent = true
    }
  }

  if (formType.includes("Volunteer")) {
    sections.push("🤝 VOLUNTEER APPLICATION DETAILS")
    sections.push("────────────────────────────────────────")
    if (data.name) { sections.push(`   Name: ${data.name}`); hasContent = true }
    if (data.email) { sections.push(`   📧 Email: ${data.email}`); hasContent = true }
    if (data.phone) { sections.push(`   📞 Phone: ${data.phone || "Not provided"}`); hasContent = true }
    if (data.position) { sections.push(`   💼 Position: ${data.position}`); hasContent = true }
    if (data.experience) { 
      sections.push(`   📝 Experience:`)
      const experienceLines = String(data.experience).split('\n')
      experienceLines.forEach(line => {
        sections.push(`      ${line}`)
      })
      hasContent = true 
    }
    if (data.availability) { sections.push(`   📅 Availability: ${data.availability}`); hasContent = true }
    sections.push("")
  }

  if (formType.includes("Registration") || formType.includes("Recipient") || formType.includes("Applicant")) {
    sections.push("📋 REGISTRATION DETAILS")
    sections.push("────────────────────────────────────────")
    if (data.registration_type) sections.push(`   Registration Type: ${data.registration_type}`)
    if (data.situation) {
      sections.push(`   Situation:`)
      const situationLines = String(data.situation).split('\n')
      situationLines.forEach(line => {
        sections.push(`      ${line}`)
      })
    }
    if (data.needsAssistance && data.needsAssistance.length > 0) {
      const needs = Array.isArray(data.needsAssistance) ? data.needsAssistance.join(", ") : data.needsAssistance
      sections.push(`   Needs Assistance: ${needs}`)
    }
    if (data.arrivalDate) sections.push(`   📅 Arrival Date: ${data.arrivalDate}`)
    if (data.skills) {
      sections.push(`   Skills:`)
      const skillsLines = String(data.skills).split('\n')
      skillsLines.forEach(line => {
        sections.push(`      ${line}`)
      })
    }
    if (data.experience) {
      sections.push(`   Experience:`)
      const experienceLines = String(data.experience).split('\n')
      experienceLines.forEach(line => {
        sections.push(`      ${line}`)
      })
    }
    if (data.language) sections.push(`   🌐 Language: ${data.language}`)
    if (data.needsInterpreter !== undefined) sections.push(`   Interpreter Needed: ${data.needsInterpreter ? "Yes" : "No"}`)
    sections.push("")
  }

  if (formType.includes("Donation")) {
    sections.push("💰 DONATION DETAILS")
    sections.push("────────────────────────────────────────")
    if (data.amount) sections.push(`   💵 Amount: ${data.amount}`)
    if (data.custom_amount) sections.push(`   💵 Custom Amount: ${data.custom_amount}`)
    if (data.cause) sections.push(`   🎯 Cause: ${data.cause}`)
    if (data.frequency) sections.push(`   🔄 Frequency: ${data.frequency}`)
    sections.push("")
  }

  // Additional fields that might exist
  const additionalFields = Object.entries(data).filter(([key, value]) => {
    const excludedKeys = [
      "form_type", "timestamp", "name", "firstName", "lastName", "email", "phone",
      "dateOfBirth", "gender", "maritalStatus", "numberOfDependents",
      "address", "city", "province", "postalCode", "subject", "message",
      "position", "experience", "availability", "registration_type",
      "situation", "needsAssistance", "arrivalDate", "skills", "language",
      "needsInterpreter", "amount", "custom_amount", "cause", "frequency",
      "agreedToTerms"
    ]
    return !excludedKeys.includes(key) && value !== null && value !== undefined && value !== ""
  })

  if (additionalFields.length > 0) {
    sections.push("📌 ADDITIONAL INFORMATION")
    sections.push("────────────────────────────────────────")
    additionalFields.forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      const displayValue = Array.isArray(value) ? value.join(", ") : String(value)
      sections.push(`   ${label}: ${displayValue}`)
    })
    sections.push("")
  }

  // If no content was added, include all available fields
  if (!hasContent && sections.length <= 3) {
    sections.push("📋 FORM DATA")
    sections.push("────────────────────────────────────────")
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "" && key !== "form_type" && key !== "timestamp" && key !== "formatted_message") {
        const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
        const displayValue = Array.isArray(value) ? value.join(", ") : String(value)
        sections.push(`   ${label}: ${displayValue}`)
        hasContent = true
      }
    })
    sections.push("")
  }

  // Professional Footer
  sections.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  sections.push("This is an automated message from TOMCARE Foundation website.")
  sections.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  const message = sections.join("\n")
  
  // Ensure message is never empty
  if (!message || message.trim().length === 0 || !hasContent) {
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${formType.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Submitted: ${new Date().toLocaleString()}

No additional details provided.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message from TOMCARE Foundation website.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  }

  return message
}

/**
 * Auto-reply is now handled by EmailJS template's "Linked Template" feature
 * No need for programmatic auto-reply - configure it in EmailJS dashboard:
 * 1. Open your template in EmailJS dashboard
 * 2. Go to "Auto-Reply" tab
 * 3. Link an auto-reply template
 * 4. Save
 * 
 * The linked template will automatically send when the main template is called.
 */

