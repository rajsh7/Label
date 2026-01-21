import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Code, Book, HelpCircle } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header variant="marketing" />
      <main>
        <div className="py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
              Documentation
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Learn how to use LabelPro and integrate it into your workflow
            </p>
          </div>
        </div>

        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/docs/api">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-[var(--color-primary-100)] rounded-lg flex items-center justify-center">
                        <Code size={24} className="text-[var(--color-primary-600)]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                          API Documentation
                        </h3>
                      </div>
                    </div>
                    <p className="text-[var(--color-text-secondary)]">
                      Complete API reference for integrating LabelPro into your applications.
                      Available for Enterprise users.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">
                      View API Docs
                    </Button>
                  </div>
                </Card>
              </Link>

              <Card className="h-full">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-success-100)] rounded-lg flex items-center justify-center">
                      <Book size={24} className="text-[var(--color-success-600)]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                        Getting Started Guide
                      </h3>
                    </div>
                  </div>
                  <p className="text-[var(--color-text-secondary)]">
                    Step-by-step tutorials for creating your first label, setting up batch
                    processing, and connecting printers.
                  </p>
                  <Button variant="outline" className="mt-4 w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </Card>

              <Card className="h-full">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-info-100)] rounded-lg flex items-center justify-center">
                      <FileText size={24} className="text-[var(--color-info-600)]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                        Label Format Reference
                      </h3>
                    </div>
                  </div>
                  <p className="text-[var(--color-text-secondary)]">
                    Detailed specifications for all 255+ supported label formats, including
                    dimensions and requirements.
                  </p>
                  <Button variant="outline" className="mt-4 w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </Card>

              <Card className="h-full">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-warning-100)] rounded-lg flex items-center justify-center">
                      <HelpCircle size={24} className="text-[var(--color-warning-600)]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                        FAQs & Support
                      </h3>
                    </div>
                  </div>
                  <p className="text-[var(--color-text-secondary)]">
                    Common questions, troubleshooting guides, and contact information for support.
                  </p>
                  <Button variant="outline" className="mt-4 w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
