import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="py-12 sm:py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
              Contact Us
            </h1>
            <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Get in touch with our team for support, sales, or partnerships
            </p>
          </div>
        </div>
        
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-card rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Support</h3>
                <p className="text-muted-foreground mb-4">Need help with your account or labels?</p>
                <p className="text-foreground font-medium">support@labelpro.com</p>
                <p className="text-sm text-muted-foreground">Response time: Under 2 hours</p>
              </div>
              
              <div className="p-6 bg-card rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Sales</h3>
                <p className="text-muted-foreground mb-4">Interested in Enterprise features?</p>
                <p className="text-foreground font-medium">sales@labelpro.com</p>
                <p className="text-sm text-muted-foreground">Response time: Same day</p>
              </div>
            </div>
            
            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Send us a message</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Your name" className="w-full p-3 border border-border rounded-lg" />
                <input type="email" placeholder="Your email" className="w-full p-3 border border-border rounded-lg" />
                <textarea placeholder="Your message" rows={4} className="w-full p-3 border border-border rounded-lg"></textarea>
                <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}