import { Check } from "lucide-react"

export function AboutSection() {
  const features = [
    "Support for newcomers and immigrants",
    "Assistance for people with disabilities",
    "Programs for orphans and vulnerable children",
    "Support for single mothers",
    "Mental health and depression support",
    "Support for people with colonial diseases",
    "Skills training and employment assistance",
  ]

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">About TOMCARE Foundation</h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              The Tomcare Foundation is a non-profit organization founded in 2024. The idea for the foundation came after
              realizing the many challenges faced by immigrants in Canada, including lack of information, poor living
              conditions, depression, and language barriers.
            </p>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              The foundation primarily supports new arrivals at all stages of their settlement, including employment
              procedures in Quebec. It raises awareness among both the host society and immigrants about the principles
              and benefits of living together and strengthening social bonds. Tomcare has worked to mobilize immigrants
              to integrate and contribute to their development in this territory. In 2024, we welcomed 173 new immigrants.
            </p>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-xl p-8 space-y-6">
            <div className="border-l-4 border-accent pl-6">
              <h3 className="font-serif font-bold text-xl mb-2 text-foreground">Our Vision</h3>
              <p className="text-muted-foreground">
                Our vision is to support newcomers in achieving easy and rapid integration into Canadian society while
                also addressing the needs of individuals with impairments and those living in poverty.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6">
              <h3 className="font-serif font-bold text-xl mb-2 text-foreground">Our Mission</h3>
              <p className="text-muted-foreground">
                To provide clear and timely guidance to new arrivals and to assist individuals experiencing poverty or
                physical impairments in accessing their basic needs. For newcomers in order to allow their adaptation and
                their influence in Quebec society.
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
              <p className="text-primary font-semibold">
                "Service to others is the rent you pay for your room here on earth."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
