"use client"

import { useState } from "react"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Search } from "lucide-react"
import { SearchContent } from "@/components/search-content"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  // Mock data for search results
  const programs = [
    {
      id: 1,
      name: "Language Training",
      category: "Education",
      description: "French and English language classes for newcomers",
      location: "Montreal",
      participants: 45,
    },
    {
      id: 2,
      name: "Job Search Support",
      category: "Employment",
      description: "Resume writing, interview prep, and job placement assistance",
      location: "Montreal & Laval",
      participants: 67,
    },
    {
      id: 3,
      name: "Housing Assistance",
      category: "Housing",
      description: "Help finding and securing affordable accommodation",
      location: "Montreal Metro Area",
      participants: 32,
    },
    {
      id: 4,
      name: "Digital Literacy",
      category: "Skills",
      description: "Computer basics and online platform navigation training",
      location: "Montreal",
      participants: 89,
    },
    {
      id: 5,
      name: "Mental Health Counseling",
      category: "Wellbeing",
      description: "Professional counseling and support groups for mental health",
      location: "Montreal",
      participants: 28,
    },
    {
      id: 6,
      name: "Disability Support Network",
      category: "Disabilities",
      description: "Comprehensive support services for people with disabilities",
      location: "Multiple Locations",
      participants: 54,
    },
  ]

  const categories = ["all", "Education", "Employment", "Housing", "Skills", "Wellbeing", "Disabilities"]

  const filtered = programs.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || program.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-muted py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4 text-foreground">Search Our Programs</h1>
            <p className="text-lg text-muted-foreground">
              Find the services and support programs that best fit your needs
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-md p-6 mb-8 border border-border">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search programs by name or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition font-semibold">
                Search
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    filterCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-white border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <Suspense fallback={null}>
            <SearchContent filtered={filtered} searchQuery={searchQuery} filterCategory={filterCategory} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
