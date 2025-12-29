import { Target, Heart, Users } from "lucide-react"

export function MissionGoalsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <h3 className="text-lg font-semibold text-primary mb-2">We Change Your Life & World</h3>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Our Mission & Goals</h2>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 border border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">
                  Small Donations Make Bigger Impact<br />On Someone's Life, Act Today!
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every contribution, no matter how small, creates a ripple effect of positive change. Together, we can
                transform lives and build stronger communities for newcomers and those in need.
              </p>
            </div>
            <div className="bg-white rounded-md p-8 border border-border">
              <h4 className="font-serif font-bold text-xl mb-6 text-foreground">Our Objectives & Goals</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-muted-foreground">
                    Well-being of asylum by providing access to a support network, services and programmes tailored to
                    the needs of new arrivals.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-muted-foreground">
                    Intercultural activities to enable socio-economic actors, other cultural communities as well as
                    collaboration among newcomers community.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-muted-foreground">
                    This Tomcare Foundation aims to integrate the newcomers in Canada.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-muted-foreground">
                    Provide an underaction period to newcomers, provide transport of the first two months, assist them in
                    finding accommodation, guide and advise them on how to get integrated into Canada, give them basic
                    trainings.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-muted-foreground">
                    Easy access to information. On-site and online sessions to assist people. Provides capacity buildings
                    in different domains.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

