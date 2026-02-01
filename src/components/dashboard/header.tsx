"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, LogOut, ChevronDown, LayoutDashboard, Tags, Edit, Layers, FolderOpen, History, Printer, Mail, Tag, Barcode, AlertTriangle, CreditCard, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils/cn"

interface DashboardHeaderProps {
  className?: string
}

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Templates", href: "/dashboard/templates", icon: Tags },
  { name: "Editor", href: "/dashboard/advanced-editor", icon: Edit },
  { name: "My Labels", href: "/dashboard/labels", icon: FolderOpen },
]

const toolsNavigation = [
  { name: "Address Labels", href: "/dashboard/tools/address-maker", icon: Mail },
  { name: "FNSKU Maker", href: "/dashboard/tools/fnsku-maker", icon: Tag },
  { name: "Barcode Maker", href: "/dashboard/tools/barcode-maker", icon: Barcode },
  { name: "Warning Maker", href: "/dashboard/tools/warning-maker", icon: AlertTriangle },
]

const moreNavigation = [
  { name: "Batch Processing", href: "/dashboard/batch", icon: Layers },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Printers", href: "/dashboard/printers", icon: Printer },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
]

export function DashboardHeader({ className }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    loadNotificationCount()
  }, [])

  const loadNotificationCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Count recent activities (last 24 hours)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const { data: recentLabels } = await supabase
        .from('label_designs')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', yesterday.toISOString())

      const { data: recentBatches } = await supabase
        .from('batch_jobs')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', yesterday.toISOString())

      const totalCount = (recentLabels?.length || 0) + (recentBatches?.length || 0)
      setNotificationCount(totalCount)
    } catch (error) {
      console.error('Error loading notification count:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className={cn("h-16 bg-white/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 flex items-center px-6 gap-6", className)}>
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-blue-600 min-w-fit">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
          <Tags className="w-5 h-5" />
        </div>
        <span>LabelPro</span>
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap relative",
                isActive
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
              {isActive && <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500"></div>}
            </Link>
          )
        })}

        {/* Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              suppressHydrationWarning
              className={cn(
                "flex items-center gap-2 px-3 py-2 h-auto text-sm font-medium text-slate-700 hover:text-blue-600 data-[state=open]:text-blue-600",
                pathname.includes('/dashboard/tools') && "text-blue-600"
              )}
            >
              <span>Tools</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {toolsNavigation.map((item) => (
              <DropdownMenuItem key={item.name} asChild>
                <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* More Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" suppressHydrationWarning className="flex items-center gap-2 px-3 py-2 h-auto text-sm font-medium text-slate-700 hover:text-blue-600">
              <span>More</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {moreNavigation.map((item) => (
              <DropdownMenuItem key={item.name} asChild>
                <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2 min-w-fit">
        <Button variant="ghost" size="icon" className="text-slate-700 hover:text-blue-600 relative" asChild>
          <Link href="/dashboard/history">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Link>
        </Button>
        <div className="h-6 w-px bg-white/20 mx-2" />
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-700 hover:text-red-600 gap-2">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}
