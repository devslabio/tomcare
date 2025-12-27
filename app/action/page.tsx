import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BreadcrumbSection } from "@/components/breadcrumb-section"
import { ObjectivesSection } from "@/components/objectives-section"
import { MissionGoalsSection } from "@/components/mission-goals-section"
import { DonationRecipientsSection } from "@/components/donation-recipients-section"
import { FactCounterSection } from "@/components/fact-counter-section"

export default function ActionPage() {
  return (
    <>
      <Navigation />
      <BreadcrumbSection title="Our Action" />
      <main className="min-h-screen">
        <ObjectivesSection />
        <MissionGoalsSection />
        <DonationRecipientsSection />
        <FactCounterSection />
      </main>
      <Footer />
    </>
  )
}

