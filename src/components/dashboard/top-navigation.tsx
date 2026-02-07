"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Search, Bell, Tags, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export function TopNavigation() {
  const router = useRouter()
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // Render nothing or skeleton to prevent hydration mismatch if needed, 
  // but for now we'll render empty/loading state in the pill to keep layout stable
  
  return (
    <div id="main-top-navigation" className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-[1440px] bg-[#f6f5f8]/80 dark:bg-[#161022]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-sm">
        <header className="flex items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              <div className="size-8 text-[#590df2] transition-transform group-hover:scale-105">
                 <Tags className="w-full h-full fill-current" />
              </div>
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">LabelPro</h2>
            </Link>

            {/* Search - Visible for Auth, Hidden/Adjusted for Public if needed. 
                User requested "SAME", so we keep the layout structure. 
                For unauth, we might hide it or keep it as specific search. 
                Let's hide search for unauth to keep it clean, or replace with public links container if needed for space.
            */}
            {user && (
              <label className="hidden md:flex flex-col min-w-40 h-10 w-64 group relative">
                <div className="flex w-full flex-1 items-center rounded-lg bg-slate-100 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-[#590df2]/50 transition-all duration-200">
                  <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <input 
                    className="flex w-full min-w-0 flex-1 resize-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-sm font-medium focus:outline-none border-none h-full" 
                    placeholder="Search Templates..." 
                  />
                </div>
              </label>
            )}
          </div>

          {/* Nav & Profile */}
          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden lg:flex items-center gap-6">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-[#590df2] font-bold text-sm leading-normal">Dashboard</Link>
                  <Link href="/dashboard/labels" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">My Labels</Link>
                  <Link href="/dashboard/templates" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Templates</Link>
                  <Link href="/editor" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Editor</Link>
                  <Link href="/dashboard/printers" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Printers</Link>
                  <Link href="/dashboard/batch" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Batch</Link>
                </>
              ) : (
                <>
                   <Link href="/#features" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Features</Link>
                   <Link href="/#templates" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Labels</Link>
                   <Link href="/#pricing" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Pricing</Link>
                </>
              )}
            </nav>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              {user ? (
                <>
                  <Button size="icon" variant="ghost" className="rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    <Bell className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                  <Link href="/dashboard/settings">
                    <Avatar className="size-9 ring-2 ring-white dark:ring-slate-800 shadow-sm cursor-pointer hover:ring-[#590df2] transition-all">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button className="bg-[#590df2] hover:bg-[#4a0bca] text-white rounded-full px-6 font-bold shadow-md shadow-purple-500/20">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
    </div>
  )
}
