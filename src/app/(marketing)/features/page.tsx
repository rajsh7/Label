import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { FeaturesSection } from '@/components/sections/marketing/FeaturesSection'
import { CTASection } from '@/components/sections/marketing/CTASection'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="py-12 sm:py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
              Powerful Features for E-commerce Sellers
            </h1>
            <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Everything you need to create, resize, and print professional labels at scale
            </p>
          </div>
        </div>
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
