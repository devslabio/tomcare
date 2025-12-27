"use client"

import type React from "react"

import { useState } from "react"
import { Heart, Zap, Award } from "lucide-react"

interface DonationOption {
  id: string
  amount: number
  label: string
  description: string
  icon: React.ReactNode
}

const donationOptions: DonationOption[] = [
  {
    id: "small",
    amount: 25,
    label: "Friend",
    description: "Provide essential food items for 1 family",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: "medium",
    amount: 50,
    label: "Helper",
    description: "Support language training for 1 person",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: "large",
    amount: 100,
    label: "Champion",
    description: "Fund IT literacy training for 5 people",
    icon: <Award className="w-6 h-6" />,
  },
]

export function DonationsSection() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [donationType, setDonationType] = useState<"general" | "vehicle">("general")

  const handleDonate = (amount: number) => {
    // This would integrate with Stripe or PayPal
    console.log(`Donate: $${amount}`)
  }

  return (
    <section id="donate" className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Make a Difference Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your donation directly supports newcomers, people with disabilities, and those in need. Every contribution
            matters.
          </p>
        </div>

        {/* Donation Type Tabs */}
        <div className="flex gap-4 justify-center mb-12">
          <button
            onClick={() => setDonationType("general")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              donationType === "general"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-foreground border border-border hover:bg-white/80"
            }`}
          >
            General Donation
          </button>
          <button
            onClick={() => setDonationType("vehicle")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              donationType === "vehicle"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-foreground border border-border hover:bg-white/80"
            }`}
          >
            Donate a Car
          </button>
        </div>

        {donationType === "general" ? (
          <>
            {/* Quick Donation Options */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {donationOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`p-6 rounded-xl transition-all ${
                    selectedOption === option.id
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-white border-2 border-border text-foreground hover:border-primary"
                  }`}
                >
                  <div className="text-4xl mb-3 flex justify-center">{option.icon}</div>
                  <h3 className="font-serif font-bold text-xl mb-2">${option.amount}</h3>
                  <p className="font-semibold mb-1">{option.label}</p>
                  <p
                    className={`text-sm ${selectedOption === option.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                  >
                    {option.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="bg-white rounded-xl p-8 mb-8">
              <h3 className="font-serif font-bold text-2xl mb-6 text-foreground">Custom Amount</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-3 text-2xl text-muted-foreground">$</span>
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <button
                  onClick={() => {
                    if (customAmount) {
                      handleDonate(Number.parseFloat(customAmount))
                    }
                  }}
                  className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition font-semibold whitespace-nowrap"
                >
                  Donate Now
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-8">
              <h3 className="font-serif font-bold text-2xl mb-6 text-foreground">Secure Donation</h3>
              <p className="text-muted-foreground mb-6">
                Your donation is secure and processed through trusted payment gateways. All donations are
                tax-deductible.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <button className="border-2 border-border rounded-lg p-4 hover:border-primary transition font-semibold text-foreground">
                  Credit Card
                </button>
                <button className="border-2 border-border rounded-lg p-4 hover:border-primary transition font-semibold text-foreground">
                  PayPal
                </button>
                <button className="border-2 border-border rounded-lg p-4 hover:border-primary transition font-semibold text-foreground">
                  Bank Transfer
                </button>
              </div>
            </div>
          </>
        ) : (
          // Vehicle Donation
          <div className="bg-white rounded-xl p-8">
            <h3 className="font-serif font-bold text-2xl mb-6 text-foreground">Donate Your Car</h3>
            <p className="text-muted-foreground mb-8">
              Donating a car is a wonderful way to support our mission. We accept cars, trucks, motorcycles, and other
              vehicles in any condition. Car donations are tax-deductible and help us provide essential services to those
              in need.
            </p>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="tel"
                placeholder="Your Phone"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="text"
                placeholder="Vehicle Make & Model"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <textarea
                placeholder="Additional Information"
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition font-semibold"
              >
                Submit Vehicle Donation
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
