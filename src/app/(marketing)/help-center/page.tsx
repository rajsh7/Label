import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="pt-16 flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Help Center</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-8">
                Find answers to common questions and get support.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">📚 Guides</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Getting Started</li>
                    <li>• Label Design Tips</li>
                    <li>• Printer Setup</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">❓ FAQ</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Common Questions</li>
                    <li>• Troubleshooting</li>
                    <li>• Account Issues</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">📞 Support</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Contact Support</li>
                    <li>• Live Chat</li>
                    <li>• Report Bug</li>
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