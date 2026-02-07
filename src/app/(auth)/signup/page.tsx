'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        router.push('/dashboard')
      }
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        router.push('/dashboard')
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      // If successful, maybe redirect to a verification page or login
      if (data?.user) {
        // Automatically create profile if trigger doesn't work (handled in callback but good safety)
        // For now, assume trigger or callback handles it
        router.push('/dashboard') 
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background-light text-slate-900 font-sans antialiased selection:bg-primary/20 selection:text-primary">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob will-change-transform"></div>
          <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 will-change-transform"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 will-change-transform"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        </div>
        <div className="relative z-10 w-full max-w-xl aspect-square flex items-center justify-center">
          <Link href={user ? "/dashboard" : "/"} className="w-48 h-48 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 flex flex-col items-center justify-center gap-4 z-20 transform transition-transform hover:scale-105 duration-700 ease-out cursor-pointer group">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl text-white">print</span>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">LabelPro</span>
            <div className="absolute top-1/2 left-1/2 -z-10 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-x-1/2 -rotate-45 opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 -z-10 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-x-1/2 rotate-45 opacity-50"></div>
          </Link>
          <div className="absolute top-20 left-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 transform -rotate-6 hover:-translate-y-2 hover:rotate-0 transition-all duration-500 z-10">
            <div className="size-10 bg-[#FF9900]/10 rounded-lg flex items-center justify-center text-[#FF9900]">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Synced</p>
              <p className="text-sm font-bold text-slate-900">Amazon</p>
            </div>
          </div>
          <div className="absolute bottom-32 right-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 transform rotate-3 hover:-translate-y-2 hover:rotate-0 transition-all duration-500 z-10">
            <div className="size-10 bg-[#95BF47]/10 rounded-lg flex items-center justify-center text-[#95BF47]">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Synced</p>
              <p className="text-sm font-bold text-slate-900">Shopify</p>
            </div>
          </div>
          <div className="absolute top-32 right-24 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 transform rotate-12 hover:-translate-y-2 hover:rotate-0 transition-all duration-500 z-0">
            <div className="size-8 bg-[#0071DC]/10 rounded-lg flex items-center justify-center text-[#0071DC]">
              <span className="material-symbols-outlined text-lg">storefront</span>
            </div>
            <span className="text-xs font-bold text-slate-600">Walmart</span>
          </div>
          <div className="absolute bottom-20 left-32 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 transform -rotate-12 hover:-translate-y-2 hover:rotate-0 transition-all duration-500 z-0">
            <div className="size-8 bg-[#F1641E]/10 rounded-lg flex items-center justify-center text-[#F1641E]">
              <span className="material-symbols-outlined text-lg">sell</span>
            </div>
            <span className="text-xs font-bold text-slate-600">Etsy</span>
          </div>
        </div>
        <div className="absolute bottom-10 text-center w-full px-6">
          <p className="text-slate-400 font-medium text-sm">Centralized label management for modern commerce.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-white relative flex flex-col">
        <Link href={user ? "/dashboard" : "/"} className="lg:hidden p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50 hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">print</span>
            <span className="text-slate-900 font-bold text-xl tracking-tight">LabelPro</span>
          </div>
        </Link>
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 max-w-2xl mx-auto w-full">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm transition-transform hover:scale-105 cursor-default">
              <div className="flex -space-x-2">
                <div className="size-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden"><span className="material-symbols-outlined text-[14px] text-slate-400">person</span></div>
                <div className="size-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center overflow-hidden"><span className="material-symbols-outlined text-[14px] text-slate-500">person</span></div>
                <div className="size-6 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center overflow-hidden"><span className="material-symbols-outlined text-[14px] text-slate-600">person</span></div>
              </div>
              <span className="text-xs font-bold text-slate-700 pl-1 uppercase tracking-wider">Trusted by 10,000+ sellers</span>
            </div>
          </div>
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-3">Create your account</h1>
            <p className="text-slate-500 text-lg">Start designing and printing professional labels in seconds.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-slate-100 to-white border border-slate-200 shadow-sm">
            <div className="p-4 rounded-xl bg-white flex items-center justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="size-12 rounded-xl bg-slate-50 shadow-inner flex items-center justify-center text-primary border border-slate-100">
                  <span className="material-symbols-outlined text-2xl">star_rate</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-slate-900">Free Tier</span>
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-primary/10">Active</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">$0/mo • 50 labels • Basic features</p>
                </div>
              </div>
              <div className="text-right relative z-10 hidden sm:block">
                <button type="button" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">Change <span className="material-symbols-outlined text-sm">edit</span></button>
              </div>
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1" htmlFor="name">Full Name</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-slate-400" 
                  id="name" 
                  placeholder="e.g. Jordan Smith" 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1" htmlFor="email">Work Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-slate-400" 
                  id="email" 
                  placeholder="name@company.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1" htmlFor="password">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-slate-400" 
                  id="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-indigo-600 text-white font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">Already have an account? <Link className="text-primary font-bold hover:underline" href="/login">Log in</Link></p>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 max-w-xs mx-auto">By creating an account, you agree to our <Link className="underline hover:text-slate-600" href="/terms">Terms of Service</Link> and <Link className="underline hover:text-slate-600" href="/privacy">Privacy Policy</Link>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
