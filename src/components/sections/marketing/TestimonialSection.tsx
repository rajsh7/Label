import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

export interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  avatar?: string
}

export interface TestimonialSectionProps {
  testimonials?: Testimonial[]
  className?: string
}

/**
 * Testimonial section component
 * Testimonial cards/carousel
 */
export const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  testimonials: customTestimonials,
  className,
}) => {
  const defaultTestimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'E-commerce Manager',
      company: 'TechStore Co.',
      content:
        'LabelPro saved us 10+ hours per week. The batch processing feature is a game-changer for our fulfillment operations.',
    },
    {
      name: 'Michael Chen',
      role: 'Founder',
      company: 'QuickShip Logistics',
      content:
        'We switched from manual label design to LabelPro and our error rate dropped by 90%. The quality is outstanding.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Operations Director',
      company: 'Fulfillment Plus',
      content:
        'The 255+ label formats support means we never have to worry about compatibility. It just works with everything.',
    },
  ]

  const testimonials = customTestimonials || defaultTestimonials

  return (
    <section id="testimonials" className={`py-20 px-4 bg-white ${className || ''}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Trusted by E-commerce Sellers
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            See what our customers are saying about LabelPro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent>
                <p className="text-[var(--color-text-secondary)] mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center">
                      <span className="text-[var(--color-primary-600)] font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection
