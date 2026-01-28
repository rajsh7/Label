import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Shield, FileText, Users, Zap, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="py-12 sm:py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Last updated: January 2024
              </p>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                These terms govern your use of LabelPro's professional label resizing and management platform for e-commerce sellers.
              </p>
            </div>
            
            <div className="grid gap-6">
              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Acceptance of Terms</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using LabelPro, you accept and agree to be bound by these terms. If you do not agree to these terms, please do not use our service. Your continued use of LabelPro constitutes acceptance of any updates to these terms.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Service Description</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  LabelPro provides professional label resizing, formatting, and batch processing services for e-commerce sellers. Our platform supports 255+ label formats across major marketplaces including Amazon FBA, eBay, Shopify, Walmart, and shipping carriers.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Supported Formats</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Amazon FBA & Walmart FWA labels</li>
                      <li>• USPS, FedEx, UPS shipping labels</li>
                      <li>• Custom thermal & inkjet formats</li>
                      <li>• Barcode and QR code generation</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Key Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Drag-and-drop label editor</li>
                      <li>• Batch processing with CSV upload</li>
                      <li>• Printer integration & templates</li>
                      <li>• API access (Enterprise plan)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Service Availability & Uptime</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We strive to maintain 99.9% uptime for our label processing services. Scheduled maintenance will be announced at least 24 hours in advance via email and our status page.
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Service Level Agreement</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Target uptime: 99.9% monthly</li>
                    <li>• Planned maintenance windows: Sundays 2-4 AM UTC</li>
                    <li>• Emergency maintenance: As needed with immediate notification</li>
                    <li>• Status updates: Available at status.labelpro.com</li>
                  </ul>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">User Responsibilities</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  As a LabelPro user, you agree to use our service responsibly and in compliance with all applicable laws and regulations.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Acceptable Use</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use the service only for legitimate business purposes</li>
                      <li>• Ensure all uploaded content complies with marketplace policies</li>
                      <li>• Maintain the security of your account credentials</li>
                      <li>• Report any security vulnerabilities or bugs promptly</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Prohibited Activities</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Creating fraudulent or misleading labels</li>
                      <li>• Attempting to reverse engineer our software</li>
                      <li>• Sharing account access with unauthorized users</li>
                      <li>• Using the service to violate any laws or regulations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Limitation of Liability</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  LabelPro provides label processing services "as is" without warranties. We are not liable for any damages arising from the use of our service.
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Important Disclaimers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• We are not responsible for marketplace policy compliance</li>
                    <li>• Users must verify label accuracy before printing</li>
                    <li>• Backup your important data and templates regularly</li>
                    <li>• Maximum liability limited to your monthly subscription fee</li>
                  </ul>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Subscription & Billing</h2>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Free Plan</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 200 labels/month</li>
                      <li>• 4 batch jobs/month</li>
                      <li>• Basic support</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Pro Plan ($7.99/mo)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Unlimited labels</li>
                      <li>• 50 batch jobs/month</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Enterprise ($39.99/mo)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Unlimited everything</li>
                      <li>• API access</li>
                      <li>• Dedicated support</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Subscriptions are billed monthly and can be cancelled at any time. Refunds are provided on a case-by-case basis within 30 days of purchase.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Contact Information</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have questions about these terms or need support, please contact us:
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li><strong>Email:</strong> support@labelpro.com</li>
                    <li><strong>Help Center:</strong> help.labelpro.com</li>
                    <li><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</li>
                    <li><strong>Emergency Support:</strong> Available for Enterprise customers</li>
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