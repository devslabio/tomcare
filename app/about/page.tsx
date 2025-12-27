import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BreadcrumbSection } from "@/components/breadcrumb-section"
import { AboutSection } from "@/components/about-section"
import { TargetPeopleSection } from "@/components/target-people-section"

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <BreadcrumbSection title="About Us" />
      <main className="min-h-screen">
        <AboutSection />
        <TargetPeopleSection />
      </main>
      <Footer />
    </>
  )
}

