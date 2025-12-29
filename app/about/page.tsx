import { PageLayout } from "@/components/page-layout"
import { AboutSection } from "@/components/about-section"
import { TargetPeopleSection } from "@/components/target-people-section"

export default function AboutPage() {
  return (
    <PageLayout title="About Us">
      <AboutSection />
      <TargetPeopleSection />
    </PageLayout>
  )
}

