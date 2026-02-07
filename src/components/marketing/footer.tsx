'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export function MarketingFooter() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-primary mb-6 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined">print</span>
              <span className="text-slate-900 font-bold text-xl">LabelPro</span>
            </Link>
            <p className="text-slate-500 mb-6 max-w-sm">The world's most advanced thermal printing platform for modern e-commerce brands.</p>
            <div className="flex gap-4">
              <a className="text-slate-400 hover:text-slate-900 transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="text-slate-400 hover:text-slate-900 transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><Link className="hover:text-primary transition-colors" href="/#features">Features</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/#integrations">Integrations</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/#pricing">Pricing</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/changelog">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><Link className="hover:text-primary transition-colors" href="/docs">Documentation</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/docs/api">API Reference</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/community">Community</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/help-center">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><Link className="hover:text-primary transition-colors" href="/about">About</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/blog">Blog</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/careers">Careers</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><Link className="hover:text-primary transition-colors" href="/privacy">Privacy</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/terms">Terms</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/security">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2023 LabelPro Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500"></span>
            <span className="text-slate-500 text-sm font-bold">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
