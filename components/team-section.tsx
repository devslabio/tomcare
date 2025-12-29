import Link from "next/link"
import { Twitter, Facebook, Instagram } from "lucide-react"

interface TeamMember {
  name: string
  role: string
  image?: string
}

const teamMembers: TeamMember[] = [
  { name: "Scott William", role: "Volunteer" },
  { name: "Liam Irvines", role: "Volunteer" },
  { name: "Diana Leslie", role: "Volunteer" },
  { name: "Tania Vandy", role: "Volunteer" },
]

export function TeamSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <h3 className="text-lg font-semibold text-primary mb-2">We Change Your Life & World</h3>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Meet Our Volunteers</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {teamMembers.map((member, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden bg-white/80 backdrop-blur-md rounded-md aspect-[3/4] mb-4 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-primary/10 border-2 border-primary/30 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300">
                    <span className="text-4xl font-bold text-primary group-hover:text-white transition-colors duration-300">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                </div>
                {/* Hover overlay with social links */}
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <Link href="#" className="text-white hover:text-accent transition">
                    <Twitter className="w-6 h-6" />
                  </Link>
                  <Link href="#" className="text-white hover:text-accent transition">
                    <Facebook className="w-6 h-6" />
                  </Link>
                  <Link href="#" className="text-white hover:text-accent transition">
                    <Instagram className="w-6 h-6" />
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-serif font-bold text-xl mb-1 text-foreground">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

