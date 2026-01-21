"use client"

import Link from "next/link"

const labelTypes = [
  { emoji: "🛒", name: "Amazon FBA", count: "45+ formats" },
  { emoji: "🏪", name: "Walmart", count: "32+ formats" },
  { emoji: "🏷️", name: "eBay", count: "28+ formats" },
  { emoji: "🛍️", name: "Shopify", count: "35+ formats" },
  { emoji: "🎨", name: "Etsy", count: "20+ formats" },
  { emoji: "📦", name: "UPS", count: "25+ formats" },
  { emoji: "📮", name: "USPS", count: "30+ formats" },
  { emoji: "🚚", name: "FedEx", count: "22+ formats" },
  { emoji: "🌍", name: "DHL", count: "18+ formats" },
]

export function LabelsSection() {
  return (
    <section id="labels" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-accent font-medium mb-4">Label Formats</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">Every format you need</h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            255+ pre-built label templates for every major marketplace and shipping carrier.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {labelTypes.map((label, index) => (
            <div
              key={index}
              className="animate-on-scroll group p-6 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <span className="text-4xl mb-4 block">{label.emoji}</span>
              <h3 className="text-lg font-semibold text-foreground">{label.name}</h3>
              <p className="text-sm text-muted-foreground">{label.count}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <Link 
            href="/label-formats"
            className="inline-block px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            View All 255+ Formats
          </Link>
          <p className="text-muted-foreground">
            {"Don't see your format?"}{" "}
            <a href="#" className="text-accent font-medium hover:underline">
              Request a new format →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
