import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Documentation</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-8">
                Complete documentation for LabelPro API and features.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
                  <p className="text-muted-foreground mb-4">Learn the basics of using LabelPro</p>
                  <ul className="space-y-2">
                    <li>• Quick Start Guide</li>
                    <li>• Creating Your First Label</li>
                    <li>• Understanding Label Types</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
                  <p className="text-muted-foreground mb-4">Complete API documentation</p>
                  <ul className="space-y-2">
                    <li>• Authentication</li>
                    <li>• Endpoints</li>
                    <li>• Rate Limits</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}