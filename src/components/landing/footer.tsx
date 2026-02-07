'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

const footerLinks = {
  Product: ["Features", "Labels", "Pricing", "Integrations"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Resources: ["Documentation", "Help Center"],
  Legal: ["Privacy", "Terms", "Security"],
}

export function Footer() {
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
    <footer className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href={user ? "/dashboard" : "/"} className="text-lg md:text-xl font-bold text-foreground hover:opacity-80 transition-opacity">
              LabelPro
            </Link>
            <p className="mt-3 md:mt-4 text-sm text-muted-foreground max-w-xs">
              The complete platform for e-commerce label management.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">{category}</h4>
              <ul className="space-y-2 md:space-y-3">
                {links.map((link) => {
                  let linkUrl = `/${link.toLowerCase().replace(' ', '-')}`
                  if (link === 'Labels') linkUrl = '/label-formats'
                  return (
                    <li key={link}>
                      <Link href={linkUrl} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 md:pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">© {new Date().getFullYear()} LabelPro. All rights reserved.</p>
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
