"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from 'next/link'
import { TopNavigation } from "@/components/dashboard/top-navigation"
import { MarketingFooter } from "@/components/marketing/footer"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

const TEMPLATES = [
  { id: 'amazon', name: 'Amazon', logo: '/amazon-logo.png', tag: 'FBA', color: '#FF9900' },
  { id: 'walmart', name: 'Walmart', logo: '/walmart-logo.png', tag: 'WFS', color: '#0071DC' },
  { id: 'shopify', name: 'Shopify', logo: '/shopify-logo.png', tag: 'DTC', color: '#96BF48' },
  { id: 'etsy', name: 'Etsy', logo: '/etsy-logo.png', tag: 'Seller', color: '#F1641E' },
  { id: 'usps', name: 'USPS', logo: '/usps-logo.png', tag: 'Carrier', color: '#333366' },
]

export default function LandingPage() {
  const mainRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // Check if user is already logged in and redirect to dashboard
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        window.location.replace('/dashboard')
      }
    }
    checkAuth()

    // Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.48, // 1.48x smooth scroll as requested
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    // Reveal Animations
    const ctx = gsap.context(() => {
      // 1. Hero Animations (immediate on load)
      const heroTl = gsap.timeline()
      heroTl.from(".reveal-hero-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
      })
      .from(".reveal-hero-img", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
      }, "-=0.8")

      // 2. Individual Item Reveals (more robust than section-based)
      gsap.utils.toArray<HTMLElement>('.reveal-item').forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none none"
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        })
      })

      // 3. Image Container Reveals
      gsap.utils.toArray<HTMLElement>('.reveal-img-container').forEach((img) => {
        gsap.from(img, {
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          scale: 0.95,
          opacity: 0,
          duration: 1.4,
          ease: "power2.out"
        })
      })
    }, mainRef)

    return () => {
      lenis.destroy()
      ctx.revert()
    }
  }, [])

  return (
    <div ref={mainRef} className="min-h-screen bg-background-light text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <TopNavigation />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-52 lg:pb-32 overflow-hidden bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="w-fit reveal-hero-text">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                  <span className="flex size-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Live</span>
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold leading-[0.9] tracking-tighter reveal-hero-text">
                <span className="block text-slate-900">Resizing</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">Reimagined</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-xl leading-relaxed mt-4 reveal-hero-text">
                The ultra-premium thermal printing workspace for modern commerce. Design, sync, and print with gallery-grade precision.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-6 reveal-hero-text">
                <Link href="/login" className="h-14 px-8 rounded-full bg-slate-900 text-white font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center">
                  Start Designing
                </Link>
                <button className="h-14 px-8 rounded-full bg-white border border-slate-200 text-slate-900 font-bold text-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined">play_circle</span> Watch Demo
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative reveal-hero-img">
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="relative z-10 w-full aspect-square md:aspect-[4/3] lg:aspect-square">
                <img alt="High fidelity thermal printer render" className="w-full h-full object-cover rounded-3xl shadow-2xl shadow-purple-500/20 rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out border border-white/50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiet19wbDayBDaalhPKHcoGTOI6zaeEzB-U-5cIFOD6_JORQDOIC2JD3U3nutgHHTCXHKWngeImF0T4TcYF6hBYnOjgdlT44V7jRoc3hix3b2jaEKjSwgDDJaWNS5RI28_9ENUJ0XDyhMcHiS2P3J4EofVkfavMlhHZdgxKtJlPJpsO6FrUoxfDYWS2ODiQRXr3xSk3JJ9JsSBbFpktx7j_SW0mLBWYzXLhLF6d5C6kTGVhJHEOdyt8O39dwPqx_C65nFuu0Wkd7A"/>
                <div className="absolute top-12 -left-6 md:-left-12 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Print Status</p>
                      <p className="text-slate-900 font-bold">Ready to Print</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-12 -right-6 md:-right-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 animate-bounce-slow animation-delay-1000">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">AI Resize</p>
                      <p className="text-slate-900 font-bold">4x6" to 2.25"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Integration Logos */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10 reveal-item">Trusted Marketplace Integration</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-80 reveal-item">
            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-500 group cursor-default">
              <span className="material-symbols-outlined text-4xl text-[#FF9900] group-hover:scale-110 transition-transform">shopping_cart</span>
              <span className="text-2xl font-bold text-slate-700">Amazon</span>
            </div>
            <div className="flex items-center gap-3 group cursor-default">
              <span className="material-symbols-outlined text-4xl text-[#0071DC] group-hover:scale-110 transition-transform">storefront</span>
              <span className="text-2xl font-bold text-slate-700">Walmart</span>
            </div>
            <div className="flex items-center gap-3 group cursor-default">
              <span className="material-symbols-outlined text-4xl text-[#95BF47] group-hover:scale-110 transition-transform">shopping_bag</span>
              <span className="text-2xl font-bold text-slate-700">Shopify</span>
            </div>
            <div className="flex items-center gap-3 group cursor-default">
              <span className="material-symbols-outlined text-4xl text-[#F1641E] group-hover:scale-110 transition-transform">sell</span>
              <span className="text-2xl font-bold text-slate-700">Etsy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Templates */}
      <section id="templates" className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="reveal-item">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-4">Brand Templates</h2>
            <p className="text-lg text-slate-500 max-w-md">Official carrier and marketplace templates. Pre-formatted, compliant, and ready to print.</p>
          </div>
          <div className="flex gap-4 reveal-item">
            <button 
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className={`size-14 rounded-full border border-slate-200 flex items-center justify-center transition-all ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-50 active:scale-95'}`}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button 
              onClick={() => setCurrentSlide(prev => Math.min(TEMPLATES.length - 3, prev + 1))}
              disabled={currentSlide >= TEMPLATES.length - 3}
              className={`size-14 rounded-full bg-slate-900 text-white flex items-center justify-center transition-all ${currentSlide >= TEMPLATES.length - 3 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 active:scale-95'}`}
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="relative overflow-hidden">
            <div 
              className="flex gap-6 transition-transform duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)]"
              style={{ transform: `translateX(-${currentSlide * (100 / 3 + 2)}%)` }}
            >
              {TEMPLATES.map((template) => (
                <div key={template.id} className="reveal-item flex-none w-full md:w-[calc((100%-48px)/3)]">
                  <div className="group relative aspect-[3/5] rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-x-8 top-16 bottom-32 bg-white rounded-xl shadow-sm flex items-center justify-center p-6">
                      <img src={template.logo} alt={template.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute top-0 right-0 p-6">
                      <span className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest" style={{ backgroundColor: `${template.color}15`, color: template.color }}>
                        {template.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <h3 className="text-slate-900 text-2xl font-bold mb-2">{template.name}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-base font-semibold group-hover:text-primary transition-colors">
                        <span>View Templates</span>
                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-surface flex flex-col gap-32 overflow-hidden">
        {/* Feature 1 */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 reveal-img-container">
            <div className="bg-white p-2 rounded-3xl shadow-xl transform hover:rotate-1 transition-transform duration-500">
              <img alt="Feature visualization 1" className="rounded-2xl w-full h-[500px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVeSPlgl84B6AnV-1I7q0krPfXDMyTX5Co3Vr7zbFu9x9l9WqAncFDpswMew6_tJTn6HOiaqhyvQ4tvn1tP5Et3ye5zeKPCkB1ItDIUyYz808kRCDxqb89G9NVlXGDukotPuKlxaxmqP4DM0IVLNS3V5qsZ84yzDjmLmMFfj_9aPoaJr1T2Parbp37t3ohMnmw5s08SVZ-OevD2-FgxdZBeIKii8_-KkNypfwCb9HCJZxqUp7nkfvZbZWChlT69Zjz9lW9QRuLt3g"/>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="size-16 rounded-2xl bg-purple-100 text-primary flex items-center justify-center mb-8 reveal-item">
              <span className="material-symbols-outlined text-4xl">layers</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 reveal-item">Smart Batching.</h3>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 reveal-item">
              Automatically group SKU variations into intelligent print batches. Our algorithm optimizes paper usage and minimizes thermal transfer waste by up to 40%.
            </p>
            <a className="text-primary font-bold text-lg hover:underline flex items-center gap-2 group reveal-item" href="#">
              Learn about batching <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-1">
            <div className="size-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-8 reveal-item">
              <span className="material-symbols-outlined text-4xl">sync</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 reveal-item">Live Marketplace Sync.</h3>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 reveal-item">
              Changes made in Shopify or Amazon reflect instantly on your print queue. Never print an outdated price or description again. Real-time bi-directional sync keeps your physical inventory matching your digital storefront.
            </p>
            <a className="text-blue-600 font-bold text-lg hover:underline flex items-center gap-2 group reveal-item" href="#">
              Explore integrations <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
          <div className="order-2 reveal-img-container">
            <div className="bg-white p-2 rounded-3xl shadow-xl transform hover:-rotate-1 transition-transform duration-500">
              <img alt="Feature visualization 2" className="rounded-2xl w-full h-[500px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMYb2DgZ9gA6ijCjRLoGcyVtRnZK6PawLPVq0Tnu8QVGrxoyel8VezuuuTU5tq83DHK0_opfoqHLsH4s9qOCFMkO4cJG0GD2_9fxfvCqBUcbf9ykpTbtIWM9qAr1AUmh3iWiOfQPEz49Rs18q63yNGh0y2ffhyCtyHzGakMfpnaFnYxT971T_6Pj0_Aer6iGVRZYQnKlFWliu5zJTQwJvwxobdbYYBhQJkzvUX-5cre-td09gvTcFuZBueQFz9_kQWXdXxJ-yNx6I"/>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 reveal-img-container">
            <div className="bg-white p-2 rounded-3xl shadow-xl transform hover:rotate-1 transition-transform duration-500">
              <img alt="Feature visualization 3" className="rounded-2xl w-full h-[500px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL8JmOj-5UohKI8oOv8yMTy0SGB8aUtY93VMas764p_EzDu7043QI5Lf36BymLAikmugRy1-K0E7rqiwTIasRmrygFXjVlkCQXCuUfqC-4X6xZBMUZbeJKsGVTh-FThv_q5PwuauxnoBTFf9IjZ3lxhhz27RsUjT2tHWQf1M4QxI4MBAnEzaEA0rEE43sAdc1K_C4N_KdoP5tvvXgJ7HvCHsK0iRAD4gnbdPa5RAFxUHgb3onZpa-NeR7v71ZGqnbXpQNvVeUb02E"/>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="size-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-8 reveal-item">
              <span className="material-symbols-outlined text-4xl">coffee</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 reveal-item">Material Awareness.</h3>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 reveal-item">
              From matte paper to glossy synthetics, LabelPro adjusts heat settings automatically based on the detected roll type. Perfect blacks, every time.
            </p>
            <a className="text-amber-600 font-bold text-lg hover:underline flex items-center gap-2 group reveal-item" href="#">
              See material compatibility <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20 reveal-item">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Simple, transparent pricing</h2>
            <p className="text-slate-500 text-xl">Start for free, upgrade as you grow. No hidden fees for additional printers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="reveal-item">
              <div className="h-full p-10 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                <p className="text-slate-500 mb-8">For home businesses.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-400 font-medium">/mo</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-slate-600 font-medium">
                    <span className="material-symbols-outlined text-green-500 text-xl">check</span> 1 Printer
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium">
                    <span className="material-symbols-outlined text-green-500 text-xl">check</span> 50 Labels/mo
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium">
                    <span className="material-symbols-outlined text-green-500 text-xl">check</span> Basic Templates
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors">
                  Start Free
                </button>
              </div>
            </div>
            <div className="reveal-item">
              <div className="h-full p-10 rounded-[2rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">POPULAR</div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-slate-400 mb-8">For growing brands.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold">$29</span>
                  <span className="text-slate-400 font-medium">/mo</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-slate-200 font-medium">
                    <span className="material-symbols-outlined text-primary text-xl">check</span> Unlimited Printers
                  </li>
                  <li className="flex items-center gap-3 text-slate-200 font-medium">
                    <span className="material-symbols-outlined text-primary text-xl">check</span> 5,000 Labels/mo
                  </li>
                  <li className="flex items-center gap-3 text-slate-200 font-medium">
                    <span className="material-symbols-outlined text-primary text-xl">check</span> Marketplace Sync
                  </li>
                  <li className="flex items-center gap-3 text-slate-200 font-medium">
                    <span className="material-symbols-outlined text-primary text-xl">check</span> AI Resizing
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-colors shadow-lg shadow-primary/25">
                  Get Pro
                </button>
              </div>
            </div>
            <div className="reveal-item">
              <div className="h-full p-10 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
                <p className="text-slate-500 mb-8">For logistics hubs.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-slate-900">$99</span>
                  <span className="text-slate-400 font-medium">/mo</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-slate-600 font-medium">
                    <span className="material-symbols-outlined text-green-500 text-xl">check</span> Unlimited Everything
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium">
                    <span className="material-symbols-outlined text-green-500 text-xl">check</span> API Access
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium">
                    <span className="material-symbols-outlined text-green-500 text-xl">check</span> Custom SSO
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-900 font-bold hover:border-slate-900 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <MarketingFooter />
    </div>
  )
}
