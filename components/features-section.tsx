import Link from "next/link"
import { Heart, DollarSign, Users } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Get Inspire And Help",
      description: "Join our mission to support newcomers and those in need with compassion and dignity.",
      link: "/about",
    },
    {
      icon: <DollarSign className="w-12 h-12" />,
      title: "Send Us Donations",
      description: "Your generous donations directly support our programs and services for the community.",
      link: "/programs#donate",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Become A Volunteer",
      description: "Make a direct impact by volunteering your time and skills to help those in need.",
      link: "/volunteer",
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2>Charity With Difference</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center bg-white/80 backdrop-blur-md rounded-md p-8 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 group"
            >
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-primary/10 text-primary border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30 transition-all duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="mb-4 group-hover:text-white transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="mb-6 text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                {feature.description}
              </p>
              <Link
                href={feature.link}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 hover:text-white transition-colors duration-200 font-semibold group-hover:bg-primary group-hover:text-white"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

