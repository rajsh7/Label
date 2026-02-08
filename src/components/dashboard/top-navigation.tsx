"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Search, Bell, Tags, LogOut, LayoutDashboard, FolderOpen, Settings, Edit, Layers, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils/cn"
import { useNotifications } from "@/lib/notifications/context"

export function TopNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const { notifications, markAsRead, clearAll } = useNotifications()
  const unreadCount = notifications.filter(n => !n.isRead).length


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
      <div className="w-full max-w-[1800px] bg-[#f6f5f8]/80 dark:bg-[#161022]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-sm">
        <header className="flex items-center justify-between gap-4 px-8 py-4">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
                      >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto z-[100]">
                      <div className="flex items-center justify-between px-2 py-2 border-b">
                        <h3 className="font-bold text-sm">Notifications</h3>
                        {notifications.length > 0 && (
                          <button onClick={clearAll} className="text-xs text-blue-600 hover:underline">
                            Clear All
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-slate-500">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={cn(
                              "flex flex-col items-start gap-1 p-3 cursor-pointer",
                              !notification.isRead && "bg-blue-50 dark:bg-blue-950/20"
                            )}
                          >
                            <div className="flex items-start justify-between w-full gap-2">
                              <span className="font-semibold text-sm">{notification.title}</span>
                              {!notification.isRead && (
                                <span className="size-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{notification.message}</p>
                            <span className="text-[10px] text-slate-400">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </span>
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="size-9 ring-2 ring-white dark:ring-slate-800 shadow-sm cursor-pointer hover:ring-[#590df2] transition-all lg:hidden">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 z-[100]">
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className={cn("flex items-center gap-2 cursor-pointer", pathname === "/dashboard" && "bg-blue-50 text-blue-600")}>
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/templates" className={cn("flex items-center gap-2 cursor-pointer", pathname === "/dashboard/templates" && "bg-blue-50 text-blue-600")}>
                          <Tags className="w-4 h-4" />
                          Templates
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/labels" className={cn("flex items-center gap-2 cursor-pointer", pathname === "/dashboard/labels" && "bg-blue-50 text-blue-600")}>
                          <FolderOpen className="w-4 h-4" />
                          My Labels
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings" className={cn("flex items-center gap-2 cursor-pointer", pathname === "/dashboard/settings" && "bg-blue-50 text-blue-600")}>
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/editor" className={cn("flex items-center gap-2 cursor-pointer", pathname === "/dashboard/editor" && "bg-blue-50 text-blue-600")}>
                          <Edit className="w-4 h-4" />
                          Editor
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/batch" className={cn("flex items-center gap-2 cursor-pointer", pathname === "/dashboard/batch" && "bg-blue-50 text-blue-600")}>
                          <Layers className="w-4 h-4" />
                          Batch
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/printers" className={cn("flex items-center gap-2 cursor-pointer", pathname === "/dashboard/printers" && "bg-blue-50 text-blue-600")}>
                          <Printer className="w-4 h-4" />
                          Printers
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link href="/dashboard/settings" className="hidden lg:block">
                    <Avatar className="size-9 ring-2 ring-white dark:ring-slate-800 shadow-sm cursor-pointer hover:ring-[#590df2] transition-all">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-white hover:bg-red-500 transition-all text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
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
