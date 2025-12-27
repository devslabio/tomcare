"use client"

import { useState } from "react"
import { getGoogleFormConfig, submitToGoogleForm } from "@/lib/google-forms"

export default function TestFormPage() {
  const [formData, setFormData] = useState({
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
    
    const config = getGoogleFormConfig("volunteer")
    
    if (!config) {
      setResult("❌ Google Form not configured. Please set NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_URL in .env.local")
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Google Form Submission Test</h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Experience</label>
            <textarea
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Availability</label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={handleTest}
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Testing..." : "Test Submission"}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-mono">{result}</pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-2">🔍 How to Extract Entry IDs:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open your Google Form: <a href="https://docs.google.com/forms/d/e/1FAIpQLScUfpz7Ra8OiWuek6v-UBzNsvex3Q5PtBkOkpwv9mhZboznoA/viewform" target="_blank" className="text-blue-600 underline">View Form</a></li>
            <li>Open browser console (F12)</li>
            <li>Paste and run the script from <code className="bg-gray-200 px-1">scripts/extract-entry-ids.js</code></li>
            <li>Copy the generated configuration to your <code className="bg-gray-200 px-1">.env.local</code> file</li>
            <li>Restart your dev server</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

