import { Users, Accessibility, Globe, Heart } from "lucide-react"

export function TargetPeopleSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Target People</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The nonprofit organization targets newcomers to Canada, as well as people with disabilities and other special
            needs from around the world, including non-immigrant Canadians who are already integrated but have disabilities
            or special needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border-2 border-primary/20 shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group text-center">
            <div className="flex justify-center mb-6">
              <div className="text-primary group-hover:text-white transition-colors duration-300">
                <Globe className="w-12 h-12" />
              </div>
            </div>
            <h3 className="font-serif font-bold text-xl mb-4 text-foreground group-hover:text-white transition-colors duration-300">
              Newcomers to Canada
            </h3>
            <p className="text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
              Supporting new arrivals at all stages of their settlement process
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border-2 border-primary/20 shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group text-center">
            <div className="flex justify-center mb-6">
              <div className="text-primary group-hover:text-white transition-colors duration-300">
                <Accessibility className="w-12 h-12" />
              </div>
            </div>
            <h3 className="font-serif font-bold text-xl mb-4 text-foreground group-hover:text-white transition-colors duration-300">
              People with Disabilities
            </h3>
            <p className="text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
              Supporting individuals with disabilities and special needs from around the world
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border-2 border-primary/20 shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group text-center">
            <div className="flex justify-center mb-6">
              <div className="text-primary group-hover:text-white transition-colors duration-300">
                <Users className="w-12 h-12" />
              </div>
            </div>
            <h3 className="font-serif font-bold text-xl mb-4 text-foreground group-hover:text-white transition-colors duration-300">
              Non-Immigrant Canadians
            </h3>
            <p className="text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
              Supporting Canadians with disabilities or special needs who are already integrated
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border-2 border-primary/20 shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group text-center">
            <div className="flex justify-center mb-6">
              <div className="text-primary group-hover:text-white transition-colors duration-300">
                <Heart className="w-12 h-12" />
              </div>
            </div>
            <h3 className="font-serif font-bold text-xl mb-4 text-foreground group-hover:text-white transition-colors duration-300">
              People in Need
            </h3>
            <p className="text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
              Supporting minority groups, people with impairments, orphans, single mothers, and those in need around the
              world
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

