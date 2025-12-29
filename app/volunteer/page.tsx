import { PageLayout } from "@/components/page-layout"
import { VolunteerSection } from "@/components/volunteer-section"
import { FactCounterSection } from "@/components/fact-counter-section"
import { TestimonialsSection } from "@/components/testimonials-section"

export default function VolunteerPage() {
  return (
    <PageLayout title="Be a Volunteer">
      <VolunteerSection />
      <FactCounterSection />
      <TestimonialsSection />
    </PageLayout>
  )
}

