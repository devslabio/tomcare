"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"

export function DonateFormSection() {
  const [formData, setFormData] = useState({
    donation: "",
    amount: "",
    fundsType: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle donation form submission
    console.log("Donate:", formData)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-md p-8 md:p-12 border border-border">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Quick Donate</h2>
            <p className="text-lg text-muted-foreground">Be a community of diverse people</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Donation Type */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Donation Type</label>
                <select
                  value={formData.donation}
                  onChange={(e) => setFormData({ ...formData, donation: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">On Time Donation</option>
                  <option value="general">General Donation</option>
                  <option value="newcomer">Newcomer Support</option>
                  <option value="disability">Disability Support</option>
                  <option value="education">Education Program</option>
                  <option value="housing">Housing Assistance</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Amount</label>
                <select
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">Select Amount</option>
                  <option value="25">$25</option>
                  <option value="50">$50</option>
                  <option value="100">$100</option>
                  <option value="200">$200</option>
                  <option value="500">$500</option>
                  <option value="1000">$1,000</option>
                  <option value="5000">$5,000</option>
                </select>
              </div>

              {/* Funds Type */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Funds Type</label>
                <select
                  value={formData.fundsType}
                  onChange={(e) => setFormData({ ...formData, fundsType: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">Select Funds Type</option>
                  <option value="one-time">One Time</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-md hover:opacity-90 transition font-semibold text-lg"
              >
                <CheckCircle className="w-5 h-5" />
                Donate Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

