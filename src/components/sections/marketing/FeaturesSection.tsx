import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Shield, BarChart3, Users, Printer, Code } from 'lucide-react'

export interface FeaturesSectionProps {
  className?: string
}

/**
 * Features section component for marketing pages
 * Feature cards with icons
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ className }) => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Resize labels in seconds, not hours. Batch process hundreds of labels at once.',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: Shield,
      title: '255+ Label Formats',
      description:
        'Support for Amazon FBA, Walmart FWA, eBay, Shopify, and all major shipping carriers.',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600',
    },
    {
      icon: BarChart3,
      title: 'Batch Processing',
      description:
        'Upload CSV files and generate hundreds of labels automatically. Save hours every week.',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description:
        'Invite team members, manage roles, and collaborate on label designs together.',
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-600',
    },
    {
      icon: Printer,
      title: 'Direct Printing',
      description:
        'Print directly to your label printer. Support for DYMO, Zebra, Rollo, and more.',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-600',
    },
    {
      icon: Code,
      title: 'API Access',
      description: 'Integrate LabelPro into your workflow with our REST API. Enterprise only.',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <section id="features" className={`py-20 px-4 bg-background ${className || ''}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Scale Your Business
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for e-commerce sellers who value their time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border border-border">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.iconBg}`}>
                    <Icon size={24} className={feature.iconColor} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
