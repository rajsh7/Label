"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

interface HeaderProps {
  variant?: 'default' | 'marketing'
}

export function Header({ variant: _variant = 'default' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold text-blue-600">LabelPro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors relative">
              Home
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500"></div>
            </Link>
            <Link href="#features" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#labels" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Labels
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              <User className="w-4 h-4" />
              Login
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-medium">
                Sign Up
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-b border-white/10">
          <nav className="flex flex-col px-4 py-4 gap-4">
            <Link href="/" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#labels" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Labels
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-white/20">
              <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                <User className="w-4 h-4" />
                Login
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-medium w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
