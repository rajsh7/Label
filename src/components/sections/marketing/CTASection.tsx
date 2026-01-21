import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export interface CTASectionProps {
  title?: string
  description?: string
  primaryCTA?: string
  primaryLink?: string
  secondaryCTA?: string
  secondaryLink?: string
  className?: string
}

/**
 * Call-to-action section component
 * Reusable across marketing pages
 */
export const CTASection: React.FC<CTASectionProps> = ({
  title = 'Ready to Get Started?',
  description = 'Join thousands of e-commerce sellers using LabelPro to streamline their operations.',
  primaryCTA = 'Start Free Trial',
  primaryLink = '/signup',
  secondaryCTA,
  secondaryLink,
  className,
}) => {
  return (
    <section className={`py-20 px-4 bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] ${className || ''}`}>
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={primaryLink}>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              {primaryCTA}
            </Button>
          </Link>
          {secondaryCTA && secondaryLink && (
            <Link href={secondaryLink}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                {secondaryCTA}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default CTASection
