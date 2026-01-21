import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { CTASection } from '@/components/sections/marketing/CTASection'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
              About LabelPro
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Empowering e-commerce sellers to scale their operations efficiently
            </p>
          </div>
        </div>

        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="prose prose-lg mx-auto">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
                Our Mission
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                LabelPro was born from a simple observation: e-commerce sellers waste countless
                hours manually resizing labels for different marketplaces and shipping carriers. We
                believe your time is better spent growing your business, not wrestling with label
                dimensions.
              </p>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6 mt-12">
                What We Offer
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                With support for 255+ label formats, batch processing, direct printer integration,
                and an intuitive drag-and-drop editor, LabelPro helps you create professional labels
                in seconds. Whether you're a small seller processing dozens of orders or a large
                operation handling thousands, we've got you covered.
              </p>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6 mt-12">
                Our Commitment
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                We're committed to providing a tool that's both powerful and easy to use. No design
                skills required, no complicated workflows. Just fast, reliable label generation that
                scales with your business.
              </p>
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Save Time?"
          description="Join thousands of sellers who trust LabelPro for their labeling needs."
        />
      </main>
      <Footer />
    </div>
  )
}
