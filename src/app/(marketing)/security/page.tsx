import { Metadata } from 'next'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'Security - LabelPro',
  description: 'Learn about our security practices and how we protect your data.',
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Security</h1>
          <p className="text-xl text-muted-foreground">
            Your data security is our top priority
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Data Protection</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.</p>
            <p>We use Supabase's enterprise-grade PostgreSQL database with Row-Level Security (RLS) policies.</p>
            <p>Regular security audits and penetration testing ensure our systems remain secure.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Authentication</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Multi-factor authentication (MFA) available for all accounts.</p>
            <p>OAuth integration with Google and Amazon for secure sign-in.</p>
            <p>Session management with automatic timeout and secure token handling.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Compliance</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>GDPR compliant with data portability and deletion rights.</p>
            <p>SOC 2 Type II certified infrastructure through our cloud providers.</p>
            <p>Regular compliance audits and security assessments.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Report Security Issues</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              If you discover a security vulnerability, please report it to us at:
            </p>
            <p className="font-mono text-foreground">security@labelpro.com</p>
          </div>
        </section>
      </div>
      </main>
      <Footer />
    </div>
  )
}