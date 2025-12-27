"use client"

import { useState } from "react"
import { Heart, X } from "lucide-react"

interface DonateModalProps {
  isOpen: boolean
  onClose: () => void
}

const causes = [
  "General Donation",
  "Support Newcomers Integration",
  "Education For People",
  "Housing Assistance",
  "Employment Support",
  "Mental Health Support",
  "Disability Support",
  "Orphan Children Support",
  "Single Mothers Support",
]

const frequencies = [
  { value: "once", label: "One-time" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
]

function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [formData, setFormData] = useState({
    amount: "",
    customAmount: "",
    cause: "",
    frequency: "once",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle donation submission
    console.log("Donation:", formData)
    // Here you would integrate with payment processor
    alert(`Thank you for your donation! Amount: $${formData.amount || formData.customAmount}, Cause: ${formData.cause}, Frequency: ${frequencies.find(f => f.value === formData.frequency)?.label}`)
    onClose()
    // Reset form
    setFormData({ amount: "", customAmount: "", cause: "", frequency: "once" })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif font-bold text-foreground">Make a Donation</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">How much would you like to donate?</label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[25, 50, 100, 200, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, amount: amount.toString(), customAmount: "" })
                  }}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    formData.amount === amount.toString()
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground hover:bg-primary/10"
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm font-semibold text-foreground mb-2">Or enter custom amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.customAmount}
                  onChange={(e) => {
                    setFormData({ ...formData, customAmount: e.target.value, amount: "" })
                  }}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Cause Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">For which cause?</label>
            <select
              value={formData.cause}
              onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">Select a cause</option>
              {causes.map((cause) => (
                <option key={cause} value={cause}>
                  {cause}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">How often?</label>
            <div className="grid grid-cols-2 gap-3">
              {frequencies.map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: freq.value })}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    formData.frequency === freq.value
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground hover:bg-primary/10"
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={!formData.cause || (!formData.amount && !formData.customAmount)}
              className="flex-1 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Donate Now
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 border-2 border-border text-foreground rounded-lg hover:bg-muted transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function DonateButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition-all font-semibold shadow-lg overflow-hidden group hover:shadow-xl hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Heart className="w-4 h-4 animate-pulse" />
          Donate Now
        </span>
        {/* Animated shimmer background */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></span>
        {/* Glow effect */}
        <span className="absolute inset-0 bg-accent/50 blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10"></span>
      </button>
      <DonateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

