import { Users, Briefcase, BookOpen, Home, Heart, Accessibility, Globe, Computer } from "lucide-react"
import type React from "react"

import { Button } from "@/components/ui/button"

interface Program {
  icon: React.ReactNode
  title: string
  description: string
  category: string
}

const programs: Program[] = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Asylum Seeker Social Activities",
    description:
      "The Tomcare Foundation organizes social activities for asylum seekers. These activities help people connect and network, allowing them to share information and address issues related to loneliness and depression.",
    category: "Social",
  },
  {
    icon: <Computer className="w-8 h-8" />,
    title: "Digital Literacy",
    description:
      "Support for newcomers who lack computer skills and need help navigating online systems. Key areas include searching for and applying to jobs, registering a business, and understanding traffic laws online.",
    category: "Education",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Training Center",
    description:
      "A training center that offers IT, language, and other courses designed to help individuals integrate into Canadian society and compete effectively in the labor market.",
    category: "Training",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Second-hand Material Donations",
    description:
      "Second-hand material donations for needy people, especially new asylum seekers to help them get started in their new lives.",
    category: "Support",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Volunteer Opportunities",
    description:
      "Asylum seekers and other individuals will be given opportunities to volunteer, which will contribute to the betterment of Canadian society and enhance their experience.",
    category: "Community",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Legal Advisory",
    description:
      "Immigrants often lack awareness of the legal framework and official languages of their host country. We provide legal advisory services to help them navigate these challenges.",
    category: "Legal",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Education and Research Services",
    description:
      "Collaborates with universities, institutions, and students to conduct targeted research and studies addressing the needs of newcomers to Canada.",
    category: "Research",
  },
  {
    icon: <Home className="w-8 h-8" />,
    title: "Accommodation Assistance",
    description:
      "Assist refugee newcomers in finding accommodation in Canada. Single mothers with children often face challenges balancing work and securing housing. We provide shared accommodation support.",
    category: "Housing",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Homelessness Support",
    description:
      "Through the Tomcare Foundation, homeless individuals will receive assistance with their basic needs, including clothing, food, social integration, and other support to improve their quality of life.",
    category: "Support",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Employability",
    description:
      "Newcomers face specific obstacles, such as a lack of knowledge about the labor market, limited work experience in Quebec, unfamiliarity with official languages, insufficient awareness of job prospects, and misunderstandings of the hiring process.",
    category: "Employment",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Seniors Services",
    description:
      "The Seniors Services program aims to improve the quality of life for older adults, support their needs, promote self-care, combat isolation, and inform them about available services and their rights to help prevent social exclusion.",
    category: "Support",
  },
  {
    icon: <Computer className="w-8 h-8" />,
    title: "Access to ICT",
    description:
      "Tomcare foundation will establish public IT infrastructure. Some platforms need to be accessed online, it is hard to get laptops or desktops and even if you get used to it, they still need technical assistance.",
    category: "Technology",
  },
]

export function ProgramsSection() {
  return (
    <section id="programs" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4">Our Programs & Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TOMCARE Foundation offers comprehensive programs designed to support newcomers, people with disabilities,
            and those in need.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-md p-6 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 group"
            >
              <div className="mb-4 text-primary group-hover:text-white transition-colors duration-300">
                {program.icon}
              </div>
              <h3 className="mb-2 group-hover:text-white transition-colors duration-300">
                {program.title}
              </h3>
              <p className="text-sm mb-4 text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                {program.description}
              </p>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/30 text-xs font-semibold rounded-full group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30 transition-all duration-300">
                {program.category}
              </span>
            </div>
          ))}
        </div>

        {/* Schedule Section */}
        <div className="mt-16 bg-gradient-to-br from-primary to-primary/90 rounded-md p-8 border-2 border-white/20">
          <h3 className="mb-6 text-white">Donation Days Schedule</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-md p-6 border-2 border-white/20">
              <h4 className="font-semibold text-lg mb-2 text-white">Monday - Wednesday</h4>
              <p className="text-white/90 mb-2">9:00 AM - 5:00 PM</p>
              <p className="text-sm text-white/80">General donations and support services</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-md p-6 border-2 border-white/20">
              <h4 className="font-semibold text-lg mb-2 text-white">Thursday</h4>
              <p className="text-white/90 mb-2">10:00 AM - 6:00 PM</p>
              <p className="text-sm text-white/80">Special extended hours for working individuals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-md p-6 border-2 border-white/20">
              <h4 className="font-semibold text-lg mb-2 text-white">Saturday</h4>
              <p className="text-white/90 mb-2">10:00 AM - 3:00 PM</p>
              <p className="text-sm text-white/80">Weekend community events and activities</p>
            </div>
          </div>
        </div>

        {/* Recognition Section */}
        <div className="mt-12 bg-gradient-to-br from-primary to-primary/80 rounded-md p-8 border-2 border-white/20">
          <h3 className="mb-4 text-white">Certificate of Recognition</h3>
          <p className="text-white/90 mb-6">
            All donors receive an official Certificate of Recognition acknowledging their generous contribution to
            TOMCARE Foundation. Your name will be featured on our website and in our annual report (unless you prefer
            anonymity).
          </p>
          <Button variant="outline" className="bg-white text-primary hover:bg-primary hover:text-white">
            Learn More About Recognition
          </Button>
        </div>
      </div>
    </section>
  )
}
