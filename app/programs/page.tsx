import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BreadcrumbSection } from "@/components/breadcrumb-section"
import { ProgramsSection } from "@/components/programs-section"
import { OtherServicesSection } from "@/components/other-services-section"
import { CausesSection } from "@/components/causes-section"
import { DonationsSection } from "@/components/donations-section"

export default function ProgramsPage() {
  return (
    <>
      <Navigation />
      <BreadcrumbSection title="Our Programs & Services" items={[{ label: "Programs" }]} />
      <main className="min-h-screen">
        <ProgramsSection />
        <OtherServicesSection />
        <CausesSection />
        <DonationsSection />
      </main>
      <Footer />
    </>
  )
}

