"use client"

import { RevealUp } from "@/components/ui/reveal-up"

const stats = [
  { value: "255+", label: "label formats", company: "Amazon FBA" },
  { value: "98%", label: "faster labeling", company: "Walmart" },
  { value: "10K+", label: "active sellers", company: "eBay" },
  { value: "6×", label: "faster to ship", company: "Shopify" },
]

export function StatsSection() {
  return (
    <section className="py-16 border-y border-border bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <RevealUp key={index} delay={index * 0.1}>
              <div className="text-center md:text-left">
                <p className="text-muted-foreground">
                  <span className="font-bold text-foreground">{stat.value}</span> {stat.label}.
                </p>
                <p className="mt-4 text-lg font-bold text-foreground">{stat.company}</p>
              </div>
            </RevealUp>
          ))}
        </div>
      </div>
    </section>
  )
}
