import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="py-12 sm:py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4 text-center">
              Terms of Service
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] text-center mb-8">
              Last updated: January 2024
            </p>
            
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using LabelPro, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Service Availability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be announced in advance.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}