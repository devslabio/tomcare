/**
 * Submit form data to Google Forms
 * 
 * To get your Google Form URL and entry IDs:
 * 1. Create a Google Form
 * 2. View the form source (right-click > Inspect)
 * 3. Find the form action URL (look for <form action="...">)
 * 4. Find entry IDs for each field (look for name="entry.XXXXXXX")
 * 
 * Example:
 * - Form URL: https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
 * - Entry IDs: entry.123456789, entry.987654321, etc.
 */

interface GoogleFormConfig {
  formUrl: string
  entryIds: Record<string, string>
}

/**
 * Submit data to Google Forms
 */
export async function submitToGoogleForm(
  config: GoogleFormConfig,
  data: Record<string, string | number>
): Promise<{ success: boolean; message?: string }> {
  try {
    // Build form data with entry IDs
    const formData = new URLSearchParams()
    
    Object.entries(data).forEach(([key, value]) => {
      const entryId = config.entryIds[key]
      if (entryId && value) {
        formData.append(entryId, String(value))
      }
    })

    // Submit to Google Forms
    const response = await fetch(config.formUrl, {
      method: "POST",
      mode: "no-cors", // Google Forms doesn't allow CORS, so we use no-cors
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    // With no-cors mode, we can't read the response, but if no error was thrown, assume success
    return { success: true, message: "Form submitted successfully" }
  } catch (error) {
    console.error("Google Forms submission error:", error)
    return { success: false, message: "Failed to submit form. Please try again." }
  }
}

/**
 * Get Google Form configuration from environment variables
 */
export function getGoogleFormConfig(formType: "contact" | "volunteer"): GoogleFormConfig | null {
  if (formType === "contact") {
    const formUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_CONTACT_URL
    const entryIds = {
      name: process.env.NEXT_PUBLIC_GOOGLE_FORM_CONTACT_ENTRY_NAME || "entry.0",
      email: process.env.NEXT_PUBLIC_GOOGLE_FORM_CONTACT_ENTRY_EMAIL || "entry.1",
      phone: process.env.NEXT_PUBLIC_GOOGLE_FORM_CONTACT_ENTRY_PHONE || "entry.2",
      subject: process.env.NEXT_PUBLIC_GOOGLE_FORM_CONTACT_ENTRY_SUBJECT || "entry.3",
      message: process.env.NEXT_PUBLIC_GOOGLE_FORM_CONTACT_ENTRY_MESSAGE || "entry.4",
    }

    if (!formUrl) {
      console.warn("Google Form contact URL not configured. Set NEXT_PUBLIC_GOOGLE_FORM_CONTACT_URL")
      return null
    }

    return { formUrl, entryIds }
  } else {
    const formUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_URL
    const entryIds = {
      name: process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_NAME || "entry.0",
      email: process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_EMAIL || "entry.1",
      phone: process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_PHONE || "entry.2",
      position: process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_POSITION || "entry.3",
      experience: process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_EXPERIENCE || "entry.4",
      availability: process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_AVAILABILITY || "entry.5",
    }

    if (!formUrl) {
      console.warn("Google Form volunteer URL not configured. Set NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_URL")
      return null
    }

    return { formUrl, entryIds }
  }
}

