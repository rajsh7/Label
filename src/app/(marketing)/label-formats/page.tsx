import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { LabelsPageContent } from "@/components/labels/labels-page-content"

export const metadata: Metadata = {
  title: "255+ Label Formats | Amazon FBA, Walmart, eBay | LabelPro",
  description:
    "Professional label resizing for all major marketplaces and carriers. 255+ formats including Amazon FBA, Walmart FWA, eBay, Shopify, Etsy, DHL, UPS, FedEx.",
}

export default function LabelFormatsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <LabelsPageContent />
      </main>
      <Footer />
    </div>
  )
}
