import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FAQSection } from '@/components/sections/marketing/FAQSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | LabelPro',
  description:
    'Get answers to common questions about LabelPro, our label formats, pricing, features, and more.',
  openGraph: {
    title: 'FAQ - Frequently Asked Questions | LabelPro',
    description: 'Get answers to common questions about LabelPro',
  },
}

const expandedFAQs = [
  {
    question: 'How many label formats do you support?',
    answer:
      'We support 255+ label formats including Amazon FBA, Walmart FWA, eBay, Shopify, Etsy, USPS, FedEx, UPS, DHL, and all major shipping carriers. Our comprehensive library covers thermal, inkjet, and desktop printer formats with exact dimensions for each marketplace and carrier requirement.',
  },
  {
    question: 'Can I use LabelPro for free?',
    answer:
      'Yes! Our free Starter plan includes 200 labels per month and 4 batch jobs. No credit card required, and you can cancel anytime. Perfect for trying out LabelPro or for low-volume sellers.',
  },
  {
    question: 'What is the difference between Starter, Pro, and Enterprise plans?',
    answer:
      'Starter (Free): 200 labels/month, 4 batch jobs, basic editor, email support (48h). Pro ($7.99/month): Unlimited labels, 50 batch jobs, advanced editor, print scheduling, 2 team members, priority support (12h), no ads. Enterprise ($39.99/month): Everything in Pro plus unlimited batches, API access, unlimited team members, WMS integrations, dedicated account manager.',
  },
  {
    question: 'Do you offer API access?',
    answer:
      'Yes, API access is available on our Enterprise plan. It includes 2,000 requests per day and allows you to integrate LabelPro with your existing systems, WMS, or custom applications. Contact sales for custom API rate limits or additional features.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Absolutely! You can cancel your subscription at any time from your account settings. No questions asked, no cancellation fees. Your access will continue until the end of your current billing period.',
  },
  {
    question: 'What printers are supported?',
    answer:
      'We support all major label printers including DYMO LabelWriter series, Zebra thermal printers (LP2844, ZD420, ZD620), Rollo thermal printers, Brother QL-series, and network printers. You can also print to any system printer (Windows, macOS, Linux). Each label format includes recommended printer settings.',
  },
  {
    question: 'How does batch processing work?',
    answer:
      'Batch processing is simple: 1) Select a saved template, 2) Upload a CSV or Excel file with your product data (or paste data as text), 3) Map CSV columns to template variables, 4) Preview and generate. LabelPro will create all labels automatically and provide a single PDF download or direct printing option. Supports up to 1,000 rows per batch.',
  },
  {
    question: 'Can I edit labels after creating them?',
    answer:
      'Yes! All label designs are saved as drafts and can be edited at any time. Your designs auto-save every 10 seconds. You can modify text, images, barcodes, shapes, and all element properties. Changes are saved automatically.',
  },
  {
    question: 'Do you support custom label sizes?',
    answer:
      'While we specialize in standardized marketplace and carrier label formats, you can create custom-sized labels in the editor. However, for best results and compliance, we recommend using our pre-configured label formats that match marketplace requirements exactly.',
  },
  {
    question: 'What file formats can I export?',
    answer:
      'Currently, we export labels as PDF files optimized for printing. Batch jobs generate a single PDF with all labels. Individual labels can also be downloaded as PDF. We plan to add PNG and other image formats in future updates.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. All data is encrypted in transit (HTTPS) and at rest. We use Supabase with row-level security, so users can only access their own data. We never share your data with third parties. Read our Privacy Policy for full details.',
  },
  {
    question: 'Can I use LabelPro offline?',
    answer:
      'LabelPro is a web-based application and requires an internet connection. This ensures you always have access to the latest features, label formats, and your designs are automatically backed up to the cloud.',
  },
  {
    question: 'How accurate are the label dimensions?',
    answer:
      'All label dimensions are verified against official marketplace and carrier specifications. We maintain exact measurements in millimeters and inches, with pixel dimensions calculated for both 203 DPI and 300 DPI printing. Our label library is regularly updated as requirements change.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 30-day money-back guarantee on Pro and Enterprise plans. If you are not satisfied within the first 30 days, contact support for a full refund. No questions asked.',
  },
  {
    question: 'Can I share templates with my team?',
    answer:
      'Team collaboration is available on Pro (2 team members) and Enterprise (unlimited) plans. Team members can share templates, designs, and collaborate on label creation. Free plan users work independently.',
  },
  {
    question: 'What if I need help?',
    answer:
      'We offer multiple support channels: Email support (48h response on Starter, 12h on Pro, 4h on Enterprise), priority phone support for Enterprise customers, and a comprehensive help center with tutorials and guides. Our support team is knowledgeable about all label formats and marketplace requirements.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <Header variant="marketing" />
      <main className="flex-1">
        <div className="py-12 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)]">
              Everything you need to know about LabelPro
            </p>
          </div>
        </div>

        <FAQSection faqs={expandedFAQs} />
      </main>
      <Footer />
    </div>
  )
}

