import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export interface HeroSectionProps {
  className?: string
}

/**
 * Hero section component for marketing pages
 * Headline, subheadline, and CTAs
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  return (
    <section className={`py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white ${className || ''}`}>
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text-primary)] mb-6">
          Resize Labels in Seconds,
          <br />
          <span className="text-[var(--color-primary-600)]">Not Hours</span>
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
          Professional label resizing for e-commerce sellers. Support for 255+ label formats
          across Amazon, Walmart, eBay, and more. No design skills required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/signup">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              See How It Works
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-8 text-sm text-[var(--color-text-secondary)] flex-wrap">
          <div className="flex items-center gap-2">
            <Check size={20} className="text-[var(--color-success-500)]" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={20} className="text-[var(--color-success-500)]" />
            <span>200 free labels/month</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={20} className="text-[var(--color-success-500)]" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
