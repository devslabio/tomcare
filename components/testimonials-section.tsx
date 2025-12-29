"use client"

import { useState, useEffect } from "react"
import { Quote, Stethoscope, Heart } from "lucide-react"

interface Testimonial {
  title: string
  content: string
  name: string
  role: string
  location: string
  type: "doctor" | "helped"
}

const doctorTestimonials: Testimonial[] = [
  {
    title: "Comprehensive Healthcare Support",
    content:
      "I've partnered with TOMCARE Foundation to provide healthcare services to newcomers and people with disabilities. Their dedication to ensuring everyone has access to quality medical care is truly commendable. They make a real difference in our community.",
    name: "Dr. Sarah Chen",
    role: "Healthcare Provider",
    location: "Montreal, Canada",
    type: "doctor",
  },
  {
    title: "Mental Health Services Excellence",
    content:
      "TOMCARE's mental health support programs are essential for our community. They provide counseling and support for people with depression and other mental health challenges, filling a critical gap in services.",
    name: "Dr. Michael Thompson",
    role: "Psychiatrist",
    location: "Quebec, Canada",
    type: "doctor",
  },
]

const helpedTestimonials: Testimonial[] = [
  {
    title: "Power to create opportunities",
    content:
      "TOMCARE Foundation helped me find a job within two months of arriving in Canada. As a single mother with a disability, I thought it would be impossible, but their support made everything possible. I now have stable employment and my family is thriving.",
    name: "Ahmed M.",
    role: "Newcomer & Single Mother",
    location: "Montreal, Canada",
    type: "helped",
  },
  {
    title: "Transforming lives through support",
    content:
      "The support I received from TOMCARE transformed my life. As someone with a disability, I struggled to access services. TOMCARE provided housing assistance, job training, and most importantly, hope. I'm now independent and contributing to my community.",
    name: "John D.",
    role: "Person with Disability",
    location: "Montreal, Canada",
    type: "helped",
  },
  {
    title: "Support for my children",
    content:
      "As a single mother with depression, I didn't know where to turn. TOMCARE provided counseling, childcare support, and helped me find employment. My children now have a stable home and I'm managing my mental health with their ongoing support.",
    name: "Maria G.",
    role: "Single Mother",
    location: "Quebec, Canada",
    type: "helped",
  },
]

export function TestimonialsSection() {
  const [doctorIndex, setDoctorIndex] = useState(0)
  const [helpedIndex, setHelpedIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setDoctorIndex((prev) => (prev + 1) % doctorTestimonials.length)
      setHelpedIndex((prev) => (prev + 1) % helpedTestimonials.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const TestimonialCard = ({ testimonial, index, currentIndex, setIndex }: any) => (
    <div className="bg-white rounded-xl p-8 md:p-12 border border-border">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              {testimonial.type === "doctor" ? (
                <Stethoscope className="w-12 h-12 text-primary" />
              ) : (
                <Heart className="w-12 h-12 text-primary" />
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="mb-6">
            <Quote className="w-8 h-8 text-primary/30 mb-4" />
            <h3 className="text-2xl font-serif font-bold mb-4 text-foreground">{testimonial.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{testimonial.content}</p>
          </div>
          <div className="border-t border-border pt-4">
            <h4 className="font-serif font-bold text-lg text-foreground">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            <span className="text-sm text-muted-foreground">{testimonial.location}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {testimonial.type === "doctor"
          ? doctorTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === currentIndex ? "bg-primary w-8" : "bg-border hover:bg-primary/50"
                }`}
              />
            ))
          : helpedTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === currentIndex ? "bg-primary w-8" : "bg-border hover:bg-primary/50"
                }`}
              />
            ))}
      </div>
    </div>
  )

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-muted relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Doctor Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Doctor Testimony</h2>
            <p className="text-lg text-muted-foreground">Hear from healthcare providers who partner with us</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <TestimonialCard
              testimonial={doctorTestimonials[doctorIndex]}
              index={0}
              currentIndex={doctorIndex}
              setIndex={setDoctorIndex}
            />
          </div>
        </div>

        {/* Helped People Testimonials */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Helped People Testimony</h2>
            <p className="text-lg text-muted-foreground">Stories from people we've supported</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <TestimonialCard
              testimonial={helpedTestimonials[helpedIndex]}
              index={0}
              currentIndex={helpedIndex}
              setIndex={setHelpedIndex}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
