'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white text-slate-900 font-sans antialiased">
      <div className="hidden lg:flex w-5/12 xl:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black opacity-80"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-3xl animate-blob will-change-transform"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 will-change-transform"></div>
        <div className="relative z-10">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-white/90 hover:opacity-80 transition-opacity">
            <div className="size-8">
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_543)">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
                  <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_543"><rect fill="white" height="48" width="48"></rect></clipPath>
                </defs>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">LabelPro</span>
          </Link>
        </div>
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <div className="absolute -right-8 top-10 w-24 h-16 bg-white/10 backdrop-blur-md rounded-lg rotate-12 border border-white/20 animate-bounce-slow" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -left-4 bottom-20 w-20 h-24 bg-white/10 backdrop-blur-md rounded-lg -rotate-6 border border-white/20 animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
            <img alt="High fidelity thermal printer" className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/50 rotate-[-2deg] hover:rotate-0 transition-all duration-700 ease-out border border-white/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiet19wbDayBDaalhPKHcoGTOI6zaeEzB-U-5cIFOD6_JORQDOIC2JD3U3nutgHHTCXHKWngeImF0T4TcYF6hBYnOjgdlT44V7jRoc3hix3b2jaEKjSwgDDJaWNS5RI28_9ENUJ0XDyhMcHiS2P3J4EofVkfavMlhHZdgxKtJlPJpsO6FrUoxfDYWS2ODiQRXr3xSk3JJ9JsSBbFpktx7j_SW0mLBWYzXLhLF6d5C6kTGVhJHEOdyt8O39dwPqx_C65nFuu0Wkd7A"/>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-2xl text-white font-medium leading-relaxed">"The new resizing engine is pure magic. It's like having a design team in your printer."</p>
          <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-sm">— TechDaily Review</p>
        </div>
      </div>
      <div className="w-full lg:w-7/12 xl:w-1/2 bg-white flex flex-col relative h-full overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-20 xl:px-32 py-12">
          <Link href={user ? "/dashboard" : "/"} className="lg:hidden flex items-center gap-2 text-primary mb-10 hover:opacity-80 transition-opacity w-fit">
            <div className="size-8">
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_543_mob)">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_543_mob"><rect fill="white" height="48" width="48"></rect></clipPath>
                </defs>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">LabelPro</span>
          </Link>
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">Welcome back.</h1>
            <p className="text-slate-500 text-lg">Enter your details to access your workspace.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-3 h-14 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-bold text-slate-700 group-hover:text-slate-900">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 h-14 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.429 14.885c-1.353.644-2.735.952-4.102.952-1.282 0-2.316-.272-3.238-.857-1.121-.714-1.782-1.996-1.782-3.447 0-2.748 2.226-5.118 5.626-5.118 1.139 0 2.112.26 2.89.774.204.135.297.378.225.608l-.517 1.638c-.087.276-.39.412-.662.3-.497-.206-1.096-.328-1.745-.328-1.758 0-2.822 1.097-2.822 2.373 0 .734.332 1.401.895 1.774.458.303 1.041.444 1.65.444 1.144 0 2.228-.48 2.87-1.272.155-.19.43-.23.635-.09l1.637 1.112c.23.155.285.47.165.717-.384.776-.902 1.458-1.53 1.986zm5.83-2.174c-1.11-1.02-3.136-1.63-5.385-1.554-.25.01-.462.203-.483.453-.02.247.16.467.408.498 1.956.242 3.65 1.056 4.39 2.05.12.16.326.24.526.202.2-.038.362-.178.416-.373l.394-1.42c.036-.128-.008-.263-.102-.347-.07-.062-.163-.082-.254-.055l-.128.038c.074.155.152.32.22.493zm-5.02 5.513c-3.766 0-7.05-1.674-8.85-4.478-.173-.27-.08-.63.203-.795.284-.166.65-.07.81.22 1.554 2.83 4.673 4.29 7.842 4.29 2.093 0 4.095-.65 5.864-1.874.263-.182.624-.127.818.125.195.253.14.614-.123.805-2.022 1.47-4.32 2.24-6.565 2.24z" fill="#000000"/>
              </svg>
              <span className="font-bold text-slate-700 group-hover:text-slate-900">Amazon</span>
            </button>
          </div>
          <div className="relative flex py-2 items-center mb-10">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-widest font-bold">Or continue with</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-slate-400 text-slate-900" 
                  id="email" 
                  placeholder="name@company.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-slate-400 text-slate-900" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input className="peer h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all checked:bg-primary checked:border-primary" type="checkbox"/>
                </div>
                <span className="text-sm text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Remember me</span>
              </label>
              <Link className="text-sm font-bold text-slate-900 hover:text-primary transition-colors" href="/forgot-password">
                Forgot password?
              </Link>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </form>
          <p className="mt-10 text-center text-slate-500">
            Don't have an account? <Link className="font-bold text-slate-900 hover:text-primary transition-colors underline decoration-slate-200 underline-offset-4 hover:decoration-primary" href="/signup">Create one now</Link>
          </p>
        </div>
        <div className="p-8 md:px-12 flex justify-between items-end">
          <Link className="text-slate-400 hover:text-primary font-bold text-sm flex items-center gap-2 transition-colors group" href="/admin-login">
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">admin_panel_settings</span>
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
