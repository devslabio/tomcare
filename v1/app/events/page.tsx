import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BreadcrumbSection } from "@/components/breadcrumb-section"
import { EventsSection } from "@/components/events-section"

export default function EventsPage() {
  return (
    <>
      <Navigation />
      <BreadcrumbSection title="Upcoming Events" items={[{ label: "Events" }]} />
      <main className="min-h-screen">
        <EventsSection />
      </main>
      <Footer />
    </>
  )
}

