import { PageLayout } from "@/components/page-layout"
import { ProgramsSection } from "@/components/programs-section"
import { OtherServicesSection } from "@/components/other-services-section"
import { CausesSection } from "@/components/causes-section"
import { DonationsSection } from "@/components/donations-section"

export default function ProgramsPage() {
  return (
    <PageLayout title="Our Programs & Services" breadcrumbItems={[{ label: "Programs" }]}>
      <ProgramsSection />
      <OtherServicesSection />
      <CausesSection />
      <DonationsSection />
    </PageLayout>
  )
}

