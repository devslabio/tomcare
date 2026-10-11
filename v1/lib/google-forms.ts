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
    
    // Log what we're sending for debugging
    console.log("📤 Submitting to Google Forms:", config.formUrl)
    console.log("📋 Form data mapping:")
    
    // Always include all entry IDs, even if empty (Google Forms may require this)
    Object.entries(data).forEach(([key, value]) => {
      const entryId = config.entryIds[key]
      if (entryId) {
        // Always append, even if empty - Google Forms handles empty values
        const stringValue = value ? String(value).trim() : ""
        formData.append(entryId, stringValue)
        if (stringValue) {
          console.log(`  ${key} → ${entryId} = "${stringValue}"`)
        } else {
          console.log(`  ${key} → ${entryId} = "" (empty)`)
        }
      } else {
        console.warn(`  ⚠️ ${key} has no entry ID mapping`)
      }
    })
    
    // Log all configured entry IDs to verify mapping
    console.log("📝 All configured entry IDs:", config.entryIds)

    const formDataString = formData.toString()
    console.log("📦 Final form data:", formDataString)

    // Submit to Google Forms using fetch with no-cors (iframe blocked by CSP)
    console.log("🚀 Submitting to Google Forms using fetch...")
    
    try {
      const response = await fetch(config.formUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formDataString,
      })

      // With no-cors mode, we can't read the response, but if no error was thrown, assume success
      console.log("✅ Form submission sent via fetch (no-cors mode)")
      console.log("💡 Note: If the entry doesn't appear in Google Forms, check:")
      console.log("   1. Form settings - ensure 'Accepting responses' is ON")
      console.log("   2. Form settings - ensure 'Require sign-in' is OFF")
      console.log("   3. Field values match form expectations (especially dropdowns)")
      console.log("   4. All required fields are filled correctly")
      console.log("   5. Check Network tab in browser DevTools to see POST request status")
      
      return { success: true, message: "Form submitted successfully" }
    } catch (fetchError) {
      console.error("❌ Fetch error:", fetchError)
      return { success: false, message: "Failed to submit form. Please try again." }
    }
  } catch (error) {
    console.error("❌ Google Forms submission error:", error)
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

    console.log("🔍 getGoogleFormConfig('contact'):")
    console.log("  - Form URL:", formUrl || "NOT SET")
    console.log("  - Entry IDs:", entryIds)

    if (!formUrl) {
      console.warn("❌ Google Form contact URL not configured. Set NEXT_PUBLIC_GOOGLE_FORM_CONTACT_URL")
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

