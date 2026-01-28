"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { HeroMarquee } from "./hero-marquee"

export function HeroSection() {
  return (
    <section className="relative pt-20 md:pt-30 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-accent/10 text-accent mb-6 md:mb-8">
          <span className="text-xs md:text-sm font-medium">New: Infinite Canvas</span>
          <span className="text-xs md:text-sm font-semibold text-accent">Learn more</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground text-balance max-w-4xl mx-auto leading-[1.1]">
          Super fast labels
          <br />
          for every seller
        </h1>

        <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          The complete platform for e-commerce label management. 255+ formats for Amazon FBA, Walmart, eBay, Shopify and
          major shipping carriers.
        </p>

        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3 md:px-8 md:py-6 text-sm md:text-base w-full sm:w-auto" asChild>
            <a href="/signup">Try LabelPro for free</a>
          </Button>
          <Button variant="outline" size="lg" className="px-6 py-3 md:px-8 md:py-6 text-sm md:text-base group bg-transparent w-full sm:w-auto" asChild>
            <a href="/pricing">
              View pricing
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>

        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border">
          <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 px-4">
            <span className="font-semibold text-foreground">Over 10,000+ e-commerce sellers</span> use LabelPro to
            create stunning labels.
          </p>
        </div>
      </div>
      
      {/* Full Width Marquee */}
      <HeroMarquee />
    </section>
  )
}
