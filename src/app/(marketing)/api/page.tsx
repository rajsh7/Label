import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function APIPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="py-12 sm:py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
              API Documentation
            </h1>
            <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Integrate LabelPro into your workflow with our powerful REST API
            </p>
          </div>
        </div>
        
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">REST API</h3>
              <p className="text-muted-foreground mb-4">Full REST API access for Enterprise users</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Process labels programmatically</li>
                <li>• Batch operations</li>
                <li>• Webhook support</li>
                <li>• Rate limiting: 1000 req/min</li>
              </ul>
            </div>
            
            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Authentication</h3>
              <p className="text-muted-foreground mb-4">Secure API key authentication</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• API key in header</li>
                <li>• Production & test keys</li>
                <li>• Key rotation support</li>
                <li>• Usage analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}