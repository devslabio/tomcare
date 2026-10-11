"use client"

import { useState } from "react"
import { sendEmail, formatFormDataForEmail } from "@/lib/emailjs"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function TestEmailJSPage() {
  const [testResult, setTestResult] = useState<{
    status: "idle" | "testing" | "success" | "error"
    message: string
    details?: any
  }>({ status: "idle", message: "" })

  const testEmail = async (templateType: "contact" | "volunteer" | "register" | "donate") => {
    setTestResult({ status: "testing", message: `Testing ${templateType} template...` })

    try {
      const testData = {
        form_type: `Test ${templateType} Form`,
        timestamp: new Date().toLocaleString(),
        name: "Test User",
        email: "test@example.com",
        message: "This is a test email from TOMCARE Foundation",
      }

      const emailParams = formatFormDataForEmail(testData)
      const result = await sendEmail(templateType, emailParams)

      if (result.success) {
        setTestResult({
          status: "success",
          message: `✅ ${templateType} template test successful!`,
          details: result,
        })
      } else {
        setTestResult({
          status: "error",
          message: `❌ ${templateType} template test failed`,
          details: result,
        })
      }
    } catch (error: any) {
      setTestResult({
        status: "error",
        message: `❌ Error testing ${templateType} template`,
        details: error.message || error,
      })
    }
  }

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-md p-8 border border-border">
        <h1 className="text-3xl font-serif font-bold mb-6 text-foreground">EmailJS Configuration Test</h1>

        <div className="space-y-6">
          {/* Configuration Display */}
          <div className="bg-muted p-4 rounded-md">
            <h2 className="font-semibold mb-2">Current Configuration</h2>
            <div className="space-y-1 text-sm font-mono">
              <div>
                <span className="text-muted-foreground">Service ID:</span>{" "}
                <span className="text-foreground">
                  {process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "Not set"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Public Key:</span>{" "}
                <span className="text-foreground">
                  {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
                    ? `${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY.substring(0, 10)}...`
                    : "Not set"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Contact Template:</span>{" "}
                <span className="text-foreground">
                  {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || "Not set"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Volunteer Template:</span>{" "}
                <span className="text-foreground">
                  {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VOLUNTEER || "Not set"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Register Template:</span>{" "}
                <span className="text-foreground">
                  {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTER || "Not set"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Donate Template:</span>{" "}
                <span className="text-foreground">
                  {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_DONATE || "Not set"}
                </span>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => testEmail("contact")}
              disabled={testResult.status === "testing"}
              className="px-4 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {testResult.status === "testing" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Contact Template"
              )}
            </button>
            <button
              onClick={() => testEmail("volunteer")}
              disabled={testResult.status === "testing"}
              className="px-4 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Test Volunteer Template
            </button>
            <button
              onClick={() => testEmail("register")}
              disabled={testResult.status === "testing"}
              className="px-4 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Test Register Template
            </button>
            <button
              onClick={() => testEmail("donate")}
              disabled={testResult.status === "testing"}
              className="px-4 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Test Donate Template
            </button>
          </div>

          {/* Result Display */}
          {testResult.status !== "idle" && (
            <div
              className={`p-4 rounded-md flex gap-3 ${
                testResult.status === "success"
                  ? "bg-accent/10 border border-accent"
                  : testResult.status === "error"
                    ? "bg-destructive/10 border border-destructive"
                    : "bg-muted"
              }`}
            >
              {testResult.status === "success" ? (
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              ) : testResult.status === "error" ? (
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={
                    testResult.status === "success"
                      ? "text-accent font-semibold"
                      : testResult.status === "error"
                        ? "text-destructive font-semibold"
                        : "text-foreground"
                  }
                >
                  {testResult.message}
                </p>
                {testResult.details && (
                  <pre className="mt-2 text-xs bg-black/5 p-2 rounded overflow-auto">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Go to EmailJS Dashboard: https://dashboard.emailjs.com/</li>
              <li>Create email templates for each form type</li>
              <li>Copy the Template IDs (they start with "template_")</li>
              <li>Update .env.local with your actual Template IDs</li>
              <li>Restart your dev server: npm run dev</li>
              <li>Test each template using the buttons above</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

