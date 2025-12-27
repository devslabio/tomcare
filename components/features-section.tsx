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
      link: "/team#volunteer",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <h3 className="text-lg font-semibold text-primary mb-2">We Change Your Life & World</h3>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Charity With Difference</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 border-2 border-primary/20 shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-primary/10 text-primary border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30 transition-all duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-serif font-bold text-xl mb-4 text-foreground group-hover:text-white transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="mb-6 leading-relaxed text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                {feature.description}
              </p>
              <Link
                href={feature.link}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold shadow-lg group-hover:bg-white group-hover:text-primary group-hover:shadow-xl"
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

