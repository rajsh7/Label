import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Changelog</h1>
            <div className="space-y-8">
              <div className="border-l-4 border-primary pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold">v1.0.0</h2>
                  <span className="text-sm text-muted-foreground">December 2024</span>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Initial release of LabelPro</li>
                  <li>• 255+ label templates</li>
                  <li>• Drag-and-drop editor</li>
                  <li>• Batch processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}