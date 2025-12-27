import Link from "next/link"
import { Home, ChevronRight } from "lucide-react"

interface BreadcrumbProps {
  title: string
  items?: { label: string; href?: string }[]
}

export function BreadcrumbSection({ title, items = [] }: BreadcrumbProps) {
  return (
    <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{title}</h1>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="hover:text-accent transition flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              {item.href ? (
                <Link href={item.href} className="hover:text-accent transition">
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </section>
  )
}

