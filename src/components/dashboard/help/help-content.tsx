"use client"

import { useState } from "react"
import {
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  FileText,
  Video,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Zap,
  Printer,
  Tags,
  Upload,
  Settings,
  CreditCard,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils/cn"

const quickLinks = [
  {
    title: "Getting Started",
    description: "Learn the basics of LabelPro",
    icon: Zap,
    href: "#getting-started",
  },
  {
    title: "Label Formats",
    description: "Browse all 255+ supported formats",
    icon: Tags,
    href: "/label-formats",
  },
  {
    title: "Printer Setup",
    description: "Configure your label printers",
    icon: Printer,
    href: "/dashboard/printers",
  },
  {
    title: "Uploading Labels",
    description: "How to upload and process labels",
    icon: Upload,
    href: "#uploading",
  },
]

const faqCategories = [
  {
    id: "general",
    title: "General",
    icon: HelpCircle,
    faqs: [
      {
        question: "What is LabelPro?",
        answer:
          "LabelPro is a professional label resizing platform designed for e-commerce sellers. It supports 255+ label formats across Amazon FBA, Walmart, eBay, Shopify, and all major shipping carriers. Our tool helps you quickly resize and format labels for any printer or platform.",
      },
      {
        question: "Which platforms are supported?",
        answer:
          "We support all major e-commerce platforms including Amazon FBA, Walmart Marketplace, eBay, Shopify, Etsy, and more. We also support all major shipping carriers like UPS, FedEx, USPS, DHL, and regional carriers.",
      },
      {
        question: "Is there a free plan available?",
        answer:
          "Yes! Our Free plan includes 50 labels per month, access to basic formats, and standard processing. You can upgrade to Pro or Enterprise for unlimited labels and advanced features.",
      },
    ],
  },
  {
    id: "labels",
    title: "Labels & Formats",
    icon: Tags,
    faqs: [
      {
        question: "What label formats are supported?",
        answer:
          "We support over 255 label formats including Amazon FBA (FNSKU, shipping labels, box labels), Walmart (2D barcodes, shipping labels), eBay, Shopify, all DYMO label sizes, Zebra formats, Avery templates, and custom sizes.",
      },
      {
        question: "Can I create custom label sizes?",
        answer:
          "Yes! Pro and Enterprise users can create custom label templates with any dimensions. Simply go to Templates and click 'Create Template' to define your custom size and settings.",
      },
      {
        question: "How do I batch process multiple labels?",
        answer:
          "Upload multiple files at once using drag-and-drop or click to select. Choose your target format, and we'll process all labels simultaneously. You can download them as a ZIP file or print directly.",
      },
    ],
  },
  {
    id: "printing",
    title: "Printing",
    icon: Printer,
    faqs: [
      {
        question: "Which printers are compatible?",
        answer:
          "LabelPro works with all major label printers including DYMO (LabelWriter 450, 4XL), Zebra (GK420d, ZD420), Rollo, Brother, and standard desktop/office printers. We provide optimized settings for each printer model.",
      },
      {
        question: "How do I set up my printer?",
        answer:
          "Go to Dashboard > Printers and click 'Add Printer'. Select your printer model from the list, and we'll automatically configure the optimal settings. You can also manually adjust settings like DPI, margins, and orientation.",
      },
      {
        question: "Why are my labels printing incorrectly?",
        answer:
          "Common issues include incorrect paper size settings, wrong DPI, or margin problems. Check your printer settings in Dashboard > Printers, ensure the paper size matches your labels, and verify the print preview before printing.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Billing",
    icon: CreditCard,
    faqs: [
      {
        question: "How do I upgrade my plan?",
        answer:
          "Go to Dashboard > Billing and click 'Upgrade Plan'. Choose between Pro ($7.99/month) for unlimited labels or Enterprise ($39.99/month) for team features and API access. You can upgrade, downgrade, or cancel anytime.",
      },
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise accounts. All payments are processed securely through Stripe.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact support within 30 days of your purchase for a full refund.",
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    icon: Settings,
    faqs: [
      {
        question: "How do I connect my Amazon seller account?",
        answer:
          "Go to Settings > Integrations and click 'Connect' next to Amazon. You'll be redirected to Amazon to authorize the connection. Once connected, you can import orders and generate labels automatically.",
      },
      {
        question: "Is there an API available?",
        answer:
          "Yes! Enterprise users have access to our REST API for automated label processing. You can generate API keys in Settings > Integrations and view documentation at docs.labelpro.com.",
      },
      {
        question: "Can I integrate with my shipping software?",
        answer:
          "Yes, we integrate with popular shipping platforms like ShipStation, Shippo, EasyPost, and more. Check Settings > Integrations for the full list of available integrations.",
      },
    ],
  },
]

const gettingStartedSteps = [
  {
    step: 1,
    title: "Upload Your Labels",
    description:
      "Drag and drop your label files (PDF, PNG, JPG) or click to browse. You can upload multiple files at once for batch processing.",
  },
  {
    step: 2,
    title: "Choose Your Format",
    description:
      "Select your target format from 255+ options. Use quick formats for common sizes or browse by platform (Amazon, Walmart, etc.).",
  },
  {
    step: 3,
    title: "Preview & Adjust",
    description: "Review your resized labels in the preview. Adjust margins, rotation, or other settings if needed.",
  },
  {
    step: 4,
    title: "Download or Print",
    description: "Download your labels as PDF or image files, or print directly to your connected label printer.",
  },
]

const resources = [
  {
    title: "Documentation",
    description: "Comprehensive guides and API reference",
    icon: BookOpen,
    href: "#",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video walkthroughs",
    icon: Video,
    href: "#",
  },
  {
    title: "Blog & Updates",
    description: "Latest news and feature announcements",
    icon: FileText,
    href: "#",
  },
]

export function HelpContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("general")

  const filteredFaqs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.faqs.length > 0)

  const displayedFaqs = searchQuery ? filteredFaqs : faqCategories.filter((c) => c.id === activeCategory)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground mt-1">
          Find answers, learn how to use LabelPro, or contact our support team
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for help articles, FAQs, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 bg-muted/50 border-border"
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {quickLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="group p-4 rounded-xl border border-border bg-card hover:border-accent/50 hover:bg-accent/5 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
              <link.icon className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-medium text-foreground mb-1">{link.title}</h3>
            <p className="text-sm text-muted-foreground">{link.description}</p>
          </a>
        ))}
      </div>

      {/* Getting Started */}
      <section id="getting-started" className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Getting Started</h2>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gettingStartedSteps.map((item) => (
                <div key={item.step} className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
                      {item.step}
                    </div>
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-11">{item.description}</p>
                  {item.step < 4 && (
                    <ChevronRight className="hidden lg:block absolute top-4 -right-3 w-5 h-5 text-muted-foreground/50" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQs */}
      <section id="faqs" className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category tabs (hidden when searching) */}
          {!searchQuery && (
            <nav className="lg:w-44 flex-shrink-0">
              <div className="lg:space-y-1 grid grid-cols-2 lg:grid-cols-1 gap-1 lg:gap-0">
                {faqCategories.map((category) => {
                  const isActive = activeCategory === category.id
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <category.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs lg:text-sm">{category.title}</span>
                    </button>
                  )
                })}
              </div>
            </nav>
          )}

          {/* FAQ list */}
          <div className="flex-1 space-y-3">
            {displayedFaqs.map((category) => (
              <div key={category.id}>
                {searchQuery && (
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <category.icon className="w-4 h-4" />
                    {category.title}
                  </h3>
                )}
                <div className="space-y-2">
                  {category.faqs.map((faq, index) => {
                    const faqId = `${category.id}-${index}`
                    const isExpanded = expandedFaq === faqId
                    return (
                      <div key={faqId} className="border border-border rounded-lg bg-card overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-foreground pr-4">{faq.question}</span>
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform",
                              isExpanded && "rotate-180",
                            )}
                          />
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4">
                            <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {searchQuery && displayedFaqs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Try different keywords or contact support</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.href}
              className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <resource.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground flex items-center gap-1">
                  {resource.title}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>
              Our support team is here to assist you. Choose your preferred contact method.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <MessageCircle className="w-4 h-4" />
                Start Live Chat
              </Button>
              <Button variant="outline" className="flex-1 gap-2 border-border bg-transparent">
                <Mail className="w-4 h-4" />
                Email Support
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Average response time: <span className="text-foreground font-medium">Under 2 hours</span>
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
