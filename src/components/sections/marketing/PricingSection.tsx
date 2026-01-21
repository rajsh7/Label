import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  ctaLink: string
  highlighted?: boolean
}

export interface PricingSectionProps {
  tiers?: PricingTier[]
  className?: string
}

/**
 * Pricing section component
 * Three-tier pricing display
 */
export const PricingSection: React.FC<PricingSectionProps> = ({
  tiers: customTiers,
  className,
}) => {
  const defaultTiers: PricingTier[] = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        '200 labels per month',
        '4 batch jobs per month',
        'All 255+ label formats',
        'Basic templates',
        'Email support',
      ],
      cta: 'Get Started',
      ctaLink: '/signup',
    },
    {
      name: 'Pro',
      price: '$9.99',
      description: 'For growing businesses',
      highlighted: true,
      features: [
        'Unlimited labels',
        '50 batch jobs per month',
        'Priority support',
        'Advanced templates',
        'Team collaboration (up to 5 members)',
        'Custom branding',
      ],
      cta: 'Start Free Trial',
      ctaLink: '/signup',
    },
    {
      name: 'Enterprise',
      price: '$49.99',
      description: 'For scaling operations',
      features: [
        'Unlimited everything',
        'API access',
        'White-label option',
        'Dedicated support',
        'Custom integrations',
        'Advanced analytics',
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
    },
  ]

  const tiers = customTiers || defaultTiers

  return (
    <section id="pricing" className={`py-20 px-4 bg-[var(--color-bg-secondary)] ${className || ''}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Choose the plan that works for you. All plans include our full feature set.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={tier.highlighted ? 'ring-2 ring-[var(--color-primary-500)]' : ''}
            >
              <CardContent>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                      {tier.price}
                    </span>
                    {tier.price !== '$0' && (
                      <span className="text-[var(--color-text-secondary)]">/month</span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[var(--color-text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={tier.ctaLink} className="block">
                  <Button
                    variant={tier.highlighted ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
