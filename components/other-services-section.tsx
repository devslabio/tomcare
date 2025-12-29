import { FileText, Printer, Type, Camera, GraduationCap, Car, CreditCard, Map, BookOpen, Briefcase } from "lucide-react"

export function OtherServicesSection() {
  const services = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Preparing CV/Resume",
      description: "One of the essential things for newcomers or Immigrants is to look for a job.",
    },
    {
      icon: <Printer className="w-6 h-6" />,
      title: "Printing Documents",
      description: "Printing services for important documents.",
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: "Typing Documents",
      description: "Document typing and formatting services.",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Passport Pictures",
      description: "Professional passport photo services.",
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "French Classes Registration",
      description: "Help with registering for French language classes.",
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Driving License SAAQ",
      description: "Assistance with registering for Driving license at SAAQ.",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Metro Cards",
      description: "Help obtaining and managing metro cards for transportation.",
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Map Interpretation",
      description: "Assistance with reading and understanding maps.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Road Writing Test Preparation",
      description: "Help preparing for road writing tests.",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Applying for Online Jobs",
      description: "Support with applying for jobs online.",
    },
  ]

  return (
    <section className="section-padding bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Other Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Essential services to help newcomers navigate daily life in Canada
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 items-stretch">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-md p-6 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 group text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="text-primary group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
              </div>
              <h3 className="font-serif font-bold text-base mb-2 text-foreground group-hover:text-white transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

