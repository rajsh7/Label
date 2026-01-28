"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { LabelsSection } from "@/components/landing/labels-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  useEffect(() => {
    // Check if user is already logged in and redirect to dashboard
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        window.location.replace('/dashboard')
      }
    }
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <LabelsSection />
        <PricingSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
