import Link from "next/link"
import { User, MessageCircle, Plus } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  comments: number
  date: { day: number; month: string }
  image?: string
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Supporting Newcomers: A Community Success Story",
    excerpt: "Learn how TOMCARE Foundation has helped over 173 newcomers integrate successfully into Canadian society.",
    author: "TOMCARE Team",
    comments: 24,
    date: { day: 3, month: "MAR" },
  },
  {
    id: "2",
    title: "How to Become a Volunteer and Make a Difference",
    excerpt: "Discover the rewarding experience of volunteering with TOMCARE and the impact you can make in your community.",
    author: "Volunteer Coordinator",
    comments: 18,
    date: { day: 25, month: "MAY" },
  },
  {
    id: "3",
    title: "Empowering People with Disabilities Through Support Programs",
    excerpt: "Our comprehensive disability support programs help individuals achieve independence and access essential services.",
    author: "Program Director",
    comments: 32,
    date: { day: 19, month: "APR" },
  },
]

export function BlogSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <h3 className="text-lg font-semibold text-primary mb-2">We Change Your Life & World</h3>
          </div>
          <h2>News & Happenings</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {blogPosts.map((post) => (
            <article key={post.id} className="group">
              <div className="relative overflow-hidden bg-white/80 backdrop-blur-md rounded-md mb-4 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1">
                <div className="aspect-[4/3] bg-primary/10 flex items-center justify-center group-hover:bg-primary/80 transition-all duration-300">
                  <Plus className="w-16 h-16 text-primary/30 group-hover:text-white/30 transition-colors duration-300" />
                </div>
                <div className="absolute top-4 left-4 bg-primary text-white rounded-md p-3 text-center min-w-[60px] group-hover:bg-white group-hover:text-primary transition-all duration-200">
                  <div className="text-2xl font-bold">{post.date.day}</div>
                  <div className="text-xs font-semibold">{post.date.month}</div>
                </div>
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Link href={`/blog/${post.id}`} className="text-white">
                    <Plus className="w-12 h-12" />
                  </Link>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-md p-6 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 group">
                <h3 className="mb-3 group-hover:text-white transition-colors duration-300">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="mb-4 leading-relaxed text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments} Comments</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

