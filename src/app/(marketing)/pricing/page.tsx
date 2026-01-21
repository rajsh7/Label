import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="text-center mb-8 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
              Choose the plan that fits your business. Contact us to upgrade your subscription tier.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-16">
          {/* Starter Plan */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground mb-2">Starter</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Perfect for testing the waters
              </p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <div className="p-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    <strong>200 labels/month</strong> - Perfect for small sellers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    <strong>4 batch jobs/month</strong> - Process CSV files
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Basic label editor - All element types
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Access to all 255 label formats
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Email support (48h response)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Community access
                  </span>
                </li>
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </Card>

          {/* Professional Plan */}
          <Card className="border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Professional
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                For serious e-commerce sellers
              </p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">$7.99</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-sm text-muted-foreground mt-2">
                  or $71.91/year (save 26%)
                </p>
              </div>
            </CardHeader>
            <div className="p-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    <strong>Unlimited labels</strong> - Scale without limits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    <strong>50 batch jobs/month</strong> - Process more data
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Print scheduling - Automate your workflow
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    <strong>2 team members</strong> - Collaborate with your team
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Priority support (12h response)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    No ads - Clean interface
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Advanced analytics
                  </span>
                </li>
              </ul>
              <Link href="/signup?plan=pro">
                <Button className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </Card>

          {/* Enterprise Plan */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Enterprise
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                For high-volume operations
              </p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">$39.99</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-sm text-muted-foreground mt-2">
                  or $359.91/year (save 25%)
                </p>
              </div>
            </CardHeader>
            <div className="p-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Everything in Professional
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    <strong>Unlimited batches</strong> - No limits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    <strong>API access</strong> - Integrate with your systems
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    <strong>Unlimited team members</strong> - Scale your team
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    WMS integrations - Connect with warehouse systems
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Dedicated account manager
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Custom SLA - Guaranteed uptime
                  </span>
                </li>
              </ul>
              <Link href="/signup?plan=enterprise">
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes! Contact support to upgrade or downgrade your plan. Changes take effect immediately.',
              },
              {
                q: 'What happens if I exceed my plan limits?',
                a: 'Free tier users will see a prompt to upgrade when they reach their limits. Pro and Enterprise users have unlimited labels.',
              },
              {
                q: 'How do I upgrade my plan?',
                a: 'Contact our support team or use the admin panel if you have admin access. Subscription tiers are managed manually.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can request to change your subscription tier at any time by contacting support.',
              },
            ].map((faq, index) => (
              <Card key={index}>
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

