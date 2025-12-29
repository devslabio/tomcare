import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BreadcrumbSection } from "@/components/breadcrumb-section"

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbItems?: Array<{ label: string; href?: string }>
  showBreadcrumb?: boolean
}

export function PageLayout({
  children,
  title,
  breadcrumbItems,
  showBreadcrumb = true,
}: PageLayoutProps) {
  return (
    <>
      <Navigation />
      {showBreadcrumb && title && (
        <BreadcrumbSection title={title} items={breadcrumbItems} />
      )}
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}

