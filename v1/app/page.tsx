import { Navigation } from "@/components/navigation"
import { HeroSlider } from "@/components/hero-slider"
import { FeaturesSection } from "@/components/features-section"
import { CausesSection } from "@/components/causes-section"
import { FactCounterSection } from "@/components/fact-counter-section"
import { DonateFormSection } from "@/components/donate-form-section"
import { PartnerSection } from "@/components/partner-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSlider />
      <FeaturesSection />
      <CausesSection />
      <FactCounterSection />
      <DonateFormSection />
      <PartnerSection />
      <Footer />
    </main>
  )
}
