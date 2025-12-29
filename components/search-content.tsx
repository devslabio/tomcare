"use client"

import { useState } from "react"
import { Search, MapPin, Users } from "lucide-react"

import { Input } from "@/components/ui/input"

interface Program {
  id: number
  name: string
  category: string
  description: string
  location: string
  participants: number
}

const programs: Program[] = [
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

export function SearchContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const filtered = programs.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || program.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      {/* Search Box */}
      <div className="bg-white rounded-md p-6 mb-8 border border-border">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Search programs by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
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
      <div className="space-y-4">
        {filtered.length > 0 ? (
          <>
            <p className="text-muted-foreground font-medium mb-4">
              Found {filtered.length} program{filtered.length !== 1 ? "s" : ""}
            </p>
            {filtered.map((program) => (
              <div key={program.id} className="bg-white rounded-md p-6 border border-border hover:border-primary transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3>{program.name}</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {program.category}
                  </span>
                </div>

                <p className="text-muted-foreground mb-4">{program.description}</p>

                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{program.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{program.participants} participants</span>
                  </div>
                </div>

                <button className="mt-4 px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary/5 transition font-semibold text-sm">
                  Learn More
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="bg-white rounded-md p-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="mb-2">No programs found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
