import { Target, Heart, Users, Globe, Briefcase, Home, GraduationCap } from "lucide-react"

export function ObjectivesSection() {
  const objectives = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Well-being of asylum",
      description:
        "Providing access to a support network, services and programmes tailored to the needs of new arrivals.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Intercultural activities",
      description:
        "Enable socio-economic actors, other cultural communities as well as collaboration among newcomers community.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Integration of newcomers",
      description: "This Tomcare Foundation aims to integrate the newcomers in Canada.",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Accommodation support",
      description: "Assist them in finding accommodation.",
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Training and guidance",
      description:
        "Provide basic trainings, guide and advise them on how to get integrated into Canada, provide transport of the first two months, provide an underaction period to newcomers.",
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Easy access to information",
      description:
        "On-site and online sessions to assist people. Provides capacity buildings in different domains.",
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4">Objectives & Goals</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our foundation is committed to supporting newcomers and people in need through comprehensive programs and
            services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-md p-6 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 group"
            >
              <div className="mb-4 text-primary group-hover:text-white transition-colors duration-300">
                {objective.icon}
              </div>
              <h3 className="mb-3 group-hover:text-white transition-colors duration-300">
                {objective.title}
              </h3>
              <p className="text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                {objective.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-md p-8 border border-primary/20">
          <p className="text-center text-muted-foreground">
            This NGO is important because it helps people in need to be helped.
          </p>
        </div>
      </div>
    </section>
  )
}

