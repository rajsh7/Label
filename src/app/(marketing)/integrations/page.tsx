import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="py-12 sm:py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
              Integrations
            </h1>
            <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Connect LabelPro with your favorite e-commerce platforms and tools
            </p>
          </div>
        </div>
        
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-xl border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Amazon FBA</h3>
              <p className="text-muted-foreground">Direct integration with Amazon Seller Central</p>
            </div>
            
            <div className="p-6 bg-card rounded-xl border border-border text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛍️</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Shopify</h3>
              <p className="text-muted-foreground">Sync orders and generate labels automatically</p>
            </div>
            
            <div className="p-6 bg-card rounded-xl border border-border text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Walmart</h3>
              <p className="text-muted-foreground">Connect with Walmart Marketplace</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}