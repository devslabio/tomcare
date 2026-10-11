import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BreadcrumbSection } from "@/components/breadcrumb-section"
import { BlogSection } from "@/components/blog-section"

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <BreadcrumbSection title="News & Happenings" items={[{ label: "Blog" }]} />
      <main className="min-h-screen">
        <BlogSection />
      </main>
      <Footer />
    </>
  )
}

