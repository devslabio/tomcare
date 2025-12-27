import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BreadcrumbSection } from "@/components/breadcrumb-section"
import { VolunteerSection } from "@/components/volunteer-section"
import { FactCounterSection } from "@/components/fact-counter-section"
import { TestimonialsSection } from "@/components/testimonials-section"

export default function VolunteerPage() {
  return (
    <>
      <Navigation />
      <BreadcrumbSection title="Be a Volunteer" />
      <main className="min-h-screen">
        <VolunteerSection />
        <FactCounterSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}

