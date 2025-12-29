import { Heart, Users, Baby, UserCircle, Brain, Accessibility } from "lucide-react"

interface RecipientGroup {
  icon: React.ReactNode
  title: string
  description: string
}

const recipientGroups: RecipientGroup[] = [
  {
    icon: <Accessibility className="w-10 h-10" />,
    title: "People with Disabilities",
    description:
      "Supporting individuals with physical, mental, and developmental disabilities to access essential services, mobility aids, and specialized care.",
  },
  {
    icon: <Heart className="w-10 h-10" />,
    title: "People with Colonial Diseases",
    description:
      "Providing medical assistance, treatment support, and healthcare access for individuals affected by colonial diseases and health conditions.",
  },
  {
    icon: <Baby className="w-10 h-10" />,
    title: "Orphan Children",
    description:
      "Ensuring orphaned and vulnerable children receive education, healthcare, nutrition, and a safe environment to grow and thrive.",
  },
  {
    icon: <UserCircle className="w-10 h-10" />,
    title: "Single Mothers",
    description:
      "Empowering single mothers with childcare support, employment assistance, housing help, and resources to build stable futures for their families.",
  },
  {
    icon: <Brain className="w-10 h-10" />,
    title: "People with Depression",
    description:
      "Offering mental health counseling, support groups, therapy access, and resources to help individuals overcome depression and mental health challenges.",
  },
]

export function DonationRecipientsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4">
            Where Your Donations Go
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your generous donations directly support people in need, including those facing disabilities, health
            challenges, and difficult circumstances. Every contribution makes a real difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {recipientGroups.map((group, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-md p-8 border-2 border-primary/20 hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1 group"
            >
              <div className="mb-6 text-primary group-hover:text-white transition-colors duration-300">
                {group.icon}
              </div>
              <h3 className="mb-4 group-hover:text-white transition-colors duration-300">
                {group.title}
              </h3>
              <p className="text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                {group.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-primary to-primary/90 rounded-md p-8 border-2 border-white/20 text-center">
          <h3 className="mb-4 text-white">Your Impact</h3>
          <p className="text-white/90 max-w-2xl mx-auto">
            When you donate to TOMCARE Foundation, you're directly helping these vulnerable groups access essential
            services, healthcare, education, and support. Together, we create lasting positive change in our community.
          </p>
        </div>
      </div>
    </section>
  )
}

