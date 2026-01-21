'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQSectionProps {
  faqs?: FAQItem[]
  className?: string
}

/**
 * FAQ section component
 * Accordion-style FAQ items
 */
export const FAQSection: React.FC<FAQSectionProps> = ({ faqs: customFAQs, className }) => {
  const defaultFAQs: FAQItem[] = [
    {
      question: 'How many label formats do you support?',
      answer:
        'We support 255+ label formats including Amazon FBA, Walmart FWA, eBay, Shopify, USPS, FedEx, UPS, and all major shipping carriers.',
    },
    {
      question: 'Can I use LabelPro for free?',
      answer:
        'Yes! Our free plan includes 200 labels per month and 4 batch jobs. No credit card required.',
    },
    {
      question: 'Do you offer API access?',
      answer:
        'Yes, API access is available on our Enterprise plan. Contact sales for custom integration options.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer:
        'Absolutely! You can cancel your subscription at any time from your account settings. No questions asked.',
    },
    {
      question: 'What printers are supported?',
      answer:
        'We support all major label printers including DYMO, Zebra, Rollo, Brother, and network printers. You can also print to any system printer.',
    },
    {
      question: 'How does batch processing work?',
      answer:
        'Simply upload a CSV file with your product data, map columns to template variables, and LabelPro will generate all your labels automatically. Download as a single PDF or print directly.',
    },
  ]

  const faqs = customFAQs || defaultFAQs
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={`py-20 px-4 bg-white ${className || ''}`}>
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Everything you need to know about LabelPro
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[var(--color-border-primary)] rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[var(--color-gray-50)] transition-colors"
              >
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-[var(--color-text-secondary)] flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown size={20} className="text-[var(--color-text-secondary)] flex-shrink-0 ml-4" />
                )}
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="px-6 py-4 text-[var(--color-text-secondary)] border-t border-[var(--color-border-primary)]">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
