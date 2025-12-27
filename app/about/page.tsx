import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BreadcrumbSection } from "@/components/breadcrumb-section"
import { AboutSection } from "@/components/about-section"
import { DonationRecipientsSection } from "@/components/donation-recipients-section"
import { ObjectivesSection } from "@/components/objectives-section"
import { TargetPeopleSection } from "@/components/target-people-section"
import { MissionGoalsSection } from "@/components/mission-goals-section"
import { FactCounterSection } from "@/components/fact-counter-section"
import { TestimonialsSection } from "@/components/testimonials-section"

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <BreadcrumbSection title="About Us" />
      <main className="min-h-screen">
        <AboutSection />
        <DonationRecipientsSection />
        <ObjectivesSection />
        <TargetPeopleSection />
        <MissionGoalsSection />
        <FactCounterSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}

