import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BreadcrumbSection } from "@/components/breadcrumb-section"
import { TeamSection } from "@/components/team-section"
import { VolunteerSection } from "@/components/volunteer-section"

export default function TeamPage() {
  return (
    <>
      <Navigation />
      <BreadcrumbSection title="Our Team" items={[{ label: "Team" }]} />
      <main className="min-h-screen">
        <TeamSection />
        <VolunteerSection />
      </main>
      <Footer />
    </>
  )
}

