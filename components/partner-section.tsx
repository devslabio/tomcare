import Link from "next/link"
import { Handshake } from "lucide-react"

export function PartnerSection() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Become Support Partner</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Provide financing support to help individuals build livelihoods
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-lg hover:opacity-90 transition-colors duration-200 font-semibold"
          >
            <Handshake className="w-5 h-5" />
            Get In Touch
          </Link>
        </div>

        {/* Partner Logos - Placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-md rounded-xl p-8 flex items-center justify-center border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 h-32 group"
            >
              <div className="text-center">
                <Handshake className="w-12 h-12 text-primary/50 mx-auto mb-2 group-hover:text-white/50 transition-colors duration-300" />
                <span className="text-xs text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                  Partner {i}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

