'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (!user) throw new Error("Authentication failed")

      // Check if user is admin
      // You can check a 'role' in profiles table or user_metadata if setup
      // For now, let's assume valid login is enough to access the admin layout which does the check
      // OR we can do a quick check here
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (profileError || !profile?.is_admin) {
        // Sign out if not admin
        await supabase.auth.signOut()
        throw new Error("Access denied. Admin privileges required.")
      }

      router.push('/admin')
      router.refresh()
    } catch (error: any) {
        console.error("Admin login error:", error)
        setError(error.message || "Failed to login")
        // If error, ensure signed out
        await supabase.auth.signOut()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-slate-900 text-white font-sans antialiased">
        {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-black to-slate-950"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-3xl animate-blob opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl animate-blob opacity-50 animation-delay-2000"></div>

      <div className="relative z-10 w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 mb-6 shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
                <p className="text-slate-400">Secure access for administrators only.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-center">
                {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">mail</span>
                        <input 
                            className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium placeholder:text-slate-600 text-white" 
                            type="email" 
                            placeholder="admin@labelpro.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Password</label>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">lock</span>
                        <input 
                            className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium placeholder:text-slate-600 text-white" 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                         type="submit" 
                         disabled={loading}
                        className="w-full h-14 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Access Dashboard"}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <Link href="/login" className="text-slate-500 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Main Login
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}
