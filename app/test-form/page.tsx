"use client"

import { useState } from "react"
import { getGoogleFormConfig, submitToGoogleForm } from "@/lib/google-forms"

export default function TestFormPage() {
  const [formType, setFormType] = useState<"contact" | "volunteer">("contact")
  const [contactFormData, setContactFormData] = useState({
    name: "Test User",
    email: "test@example.com",
    phone: "+1234567890",
    subject: "program-inquiry",
    message: "This is a test message",
  })
  const [volunteerFormData, setVolunteerFormData] = useState({
    name: "Test User",
    email: "test@example.com",
    phone: "+1234567890",
    position: "Language Volunteer",
    experience: "Test experience",
    availability: "summer",
  })
  const [result, setResult] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTest = async () => {
    setIsSubmitting(true)
    setResult("Testing submission...\n\n")
    
    const config = getGoogleFormConfig(formType)
    
    if (!config) {
      const envVar = formType === "contact" ? "NEXT_PUBLIC_GOOGLE_FORM_CONTACT_URL" : "NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_URL"
      setResult(`❌ Google Form not configured. Please set ${envVar} in .env.local`)
      setIsSubmitting(false)
      return
    }

    setResult((prev) => prev + `✅ Config found!\n`)
    setResult((prev) => prev + `📋 Form URL: ${config.formUrl}\n`)
    setResult((prev) => prev + `📋 Entry IDs:\n`)
    Object.entries(config.entryIds).forEach(([key, value]) => {
      setResult((prev) => prev + `  ${key} → ${value}\n`)
    })
    setResult((prev) => prev + `\n📤 Submitting...\n\n`)

    const formData = formType === "contact" ? contactFormData : volunteerFormData
    const submitResult = await submitToGoogleForm(config, formData)
    
    if (submitResult.success) {
      setResult((prev) => prev + `✅ ${submitResult.message}\n\n`)
      setResult((prev) => prev + `💡 Check your Google Form responses to verify the submission was received.\n`)
      setResult((prev) => prev + `💡 If you don't see the entry, the entry IDs might be incorrect.\n`)
      setResult((prev) => prev + `💡 Open browser console (F12) to see detailed submission logs.`)
    } else {
      setResult((prev) => prev + `❌ ${submitResult.message}`)
    }
    
    setIsSubmitting(false)
  }

  const currentFormData = formType === "contact" ? contactFormData : volunteerFormData
  const setCurrentFormData = formType === "contact" ? setContactFormData : setVolunteerFormData

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-md border border-border p-8">
        <h1 className="text-2xl font-bold mb-6">Google Form Submission Test</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Form Type</label>
          <select
            value={formType}
            onChange={(e) => setFormType(e.target.value as "contact" | "volunteer")}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="contact">Contact Form</option>
            <option value="volunteer">Volunteer Form</option>
          </select>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={currentFormData.name}
              onChange={(e) => setCurrentFormData({ ...currentFormData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={currentFormData.email}
              onChange={(e) => setCurrentFormData({ ...currentFormData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Phone</label>
            <input
              type="tel"
              value={currentFormData.phone}
              onChange={(e) => setCurrentFormData({ ...currentFormData, phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          {formType === "contact" ? (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  value={contactFormData.subject}
                  onChange={(e) => setContactFormData({ ...contactFormData, subject: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea
                  value={contactFormData.message}
                  onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">Position</label>
                <input
                  type="text"
                  value={volunteerFormData.position}
                  onChange={(e) => setVolunteerFormData({ ...volunteerFormData, position: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Experience</label>
                <textarea
                  value={volunteerFormData.experience}
                  onChange={(e) => setVolunteerFormData({ ...volunteerFormData, experience: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Availability</label>
                <input
                  type="text"
                  value={volunteerFormData.availability}
                  onChange={(e) => setVolunteerFormData({ ...volunteerFormData, availability: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleTest}
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Testing..." : "Test Submission"}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <pre className="whitespace-pre-wrap text-sm font-mono">{result}</pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="font-semibold mb-2">🔍 Troubleshooting:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Open browser console (F12) to see detailed submission logs</li>
            <li>Verify the formResponse URL matches the form you're checking responses for</li>
            <li>Make sure entry IDs match the form fields in order</li>
            <li>Check that all required fields are filled</li>
            <li>If submissions aren't appearing, the entry IDs might be incorrect - re-extract them using the script</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

